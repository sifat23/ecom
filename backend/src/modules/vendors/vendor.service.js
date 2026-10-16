import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../../services/activityLogger.js';
import { getStorageService } from '../../services/storage/index.js';
import crypto from 'node:crypto';

/* ── Public shape ─────────────────────────────────────── */

function toPublicVendor(v) {
    if (!v) return null;
    return {
        id: v.id,
        businessName: v.businessName,
        businessDescription: v.businessDescription,

        // ── NEW ──
        legalBusinessName:      v.legalBusinessName,
        businessType:           v.businessType,
        businessRegistrationNo: v.businessRegistrationNo,
        taxId:                  v.taxId,
        vatNumber:              v.vatNumber,

        // ── Step 3 ──
        businessPhone:        v.businessPhone,
        businessEmail:        v.businessEmail,
        website:              v.website,
        yearsInBusiness:      v.yearsInBusiness,
        employeeCount:        v.employeeCount,
        businessAddressLine1: v.businessAddressLine1,
        businessAddressLine2: v.businessAddressLine2,
        businessCity:         v.businessCity,
        businessState:        v.businessState,
        businessZip:          v.businessZip,
        businessCountry:      v.businessCountry,

        // ── Step 4 ──
        bankAccountHolder: v.bankAccountHolder,
        bankAccountNumber: v.bankAccountNumber,
        bankName:          v.bankName,
        bankRoutingNumber: v.bankRoutingNumber,
        bankIban:          v.bankIban,
        bankSwift:         v.bankSwift,

        status: v.status,
        rejectionReason: v.rejectionReason,
        documents: Array.isArray(v.documents) ? v.documents : [],
        applicationSubmittedAt: v.applicationSubmittedAt,
        applicationReviewedAt: v.applicationReviewedAt,
        approvedAt: v.approvedAt,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
    };
}

/* ── Read ─────────────────────────────────────────────── */

export async function getMyVendor(userId) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    return toPublicVendor(vendor);
}

/* ── Draft save (step 1) ──────────────────────────────── */

export async function saveStoreDraft(userId, input) {
    const existing = await prisma.vendor.findUnique({ where: { userId } });

    if (existing?.status === 'approved') {
        throw AppError.conflict('Vendor already approved — use settings to update.');
    }

    // Can't create a vendor row without a businessName (DB NOT NULL).
    if (!existing && !input.businessName) {
        throw AppError.badRequest('Store name is required to start your application.');
    }

    const vendor = existing
        ? await prisma.vendor.update({
            where: { id: existing.id },
            data: input,          // only the keys the sanitizer kept
        })
        : await prisma.vendor.create({
            data: { userId, ...input },
        });

    await logActivity({
        actorType: 'user',
        actorId: userId,
        action: existing ? 'vendor.store_draft_updated' : 'vendor.store_draft_created',
        entityType: 'vendor',
        entityId: vendor.id,
    });

    return toPublicVendor(vendor);
}

/* ── Submit step 1 (finalise the store slice) ─────────── */

export async function submitStoreStep(userId, input) {
    const existing = await prisma.vendor.findUnique({ where: { userId } });
    if (existing?.status === 'approved') {
        throw AppError.conflict('Vendor already approved.');
    }

    const vendor = existing
        ? await prisma.vendor.update({
            where: { id: existing.id },
            data: input,
        })
        : await prisma.vendor.create({
            data: { userId, ...input },
        });

    await logActivity({
        actorType: 'user',
        actorId: userId,
        action: 'vendor.store_step_submitted',
        entityType: 'vendor',
        entityId: vendor.id,
    });

    return toPublicVendor(vendor);
}


/* ── Step 2: Legal & Tax ──────────────────────────────── */

async function writeVendorStep(userId, input, action) {
    const existing = await prisma.vendor.findUnique({ where: { userId } });

    if (!existing) {
        throw AppError.badRequest('Please complete the storefront step first.');
    }
    if (existing.status === 'approved') {
        throw AppError.conflict('Vendor already approved — use settings to update.');
    }

    const vendor = await prisma.vendor.update({
        where: { id: existing.id },
        data: input,
    });

    await logActivity({
        actorType: 'user',
        actorId: userId,
        action,
        entityType: 'vendor',
        entityId: vendor.id,
    });

    return toPublicVendor(vendor);
}

export const saveLegalDraft  = (userId, input) => writeVendorStep(userId, input, 'vendor.legal_draft_updated');
export const submitLegalStep = (userId, input) => writeVendorStep(userId, input, 'vendor.legal_step_submitted');

export const saveContactDraft  = (userId, input) => writeVendorStep(userId, input, 'vendor.contact_draft_updated');
export const submitContactStep = (userId, input) => writeVendorStep(userId, input, 'vendor.contact_step_submitted');

/* ── Step 4: Payouts ──────────────────────────────────── */
export const saveBankDraft  = (userId, input) => writeVendorStep(userId, input, 'vendor.bank_draft_updated');
export const submitBankStep = (userId, input) => writeVendorStep(userId, input, 'vendor.bank_step_submitted');

/* ── Step 5: Documents ────────────────────────────────── */

const DOC_LABELS = {
    business_registration: 'Business Registration Certificate',
    tax_certificate:       'Tax ID / TIN Certificate',
    national_id:           "Owner's National ID / Passport",
    tax_clearance:         'Tax Clearance Certificate',
    bank_statement:        'Bank Statement / Proof of Account',
    store_logo:            'Store Logo',
    product_photo:         'Product Sample Photo',
    other:                 'Supporting Document',
};

export const REQUIRED_DOCUMENT_TYPES = [
    'business_registration',
    'tax_certificate',
    'national_id',
    'bank_statement',
];

function humanSize(bytes = 0) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Uploads one file, replaces any existing doc of the same type, persists. */
export async function uploadVendorDocument(userId, { file, documentType }) {
    if (!file) throw AppError.badRequest('No file received');

    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw AppError.badRequest('Please complete the earlier steps first.');
    if (vendor.status === 'approved') {
        throw AppError.conflict('Vendor already approved — use settings to update.');
    }

    const storage = getStorageService();
    const { url } = await storage.upload(file, `vendor-docs/${userId}`);

    const doc = {
        id:         crypto.randomUUID(),
        type:       documentType || 'other',
        label:      DOC_LABELS[documentType] || 'Supporting Document',
        name:       file.originalname,
        url,
        fileType:   file.mimetype === 'application/pdf' ? 'pdf' : 'image',
        fileSize:   humanSize(file.size),
        uploadedAt: new Date().toISOString(),
    };

    const existing = Array.isArray(vendor.documents) ? vendor.documents : [];

    // One document per type — replace in place.
    const previous = existing.find((d) => d.type === doc.type);
    const next = existing.filter((d) => d.type !== doc.type).concat(doc);

    await prisma.vendor.update({
        where: { id: vendor.id },
        data: { documents: next },
    });

    // Best-effort cleanup of the replaced file.
    if (previous?.url) {
        storage.delete(previous.url).catch(() => { /* swallow */ });
    }

    await logActivity({
        actorType: 'user',
        actorId: userId,
        action: 'vendor.document_uploaded',
        entityType: 'vendor',
        entityId: vendor.id,
        metadata: { type: doc.type, name: doc.name },
    });

    return doc;
}

/** Removes a document by id, best-effort deletes the file from disk. */
export async function deleteVendorDocument(userId, docId) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw AppError.notFound('Vendor not found');

    const existing = Array.isArray(vendor.documents) ? vendor.documents : [];
    const doc = existing.find((d) => d.id === docId);
    if (!doc) throw AppError.notFound('Document not found');

    const next = existing.filter((d) => d.id !== docId);

    await prisma.vendor.update({
        where: { id: vendor.id },
        data: { documents: next },
    });

    try {
        const storage = getStorageService();
        await storage.delete(doc.url);
    } catch {
        // File may already be gone — no big deal.
    }

    await logActivity({
        actorType: 'user',
        actorId: userId,
        action: 'vendor.document_deleted',
        entityType: 'vendor',
        entityId: vendor.id,
        metadata: { type: doc.type },
    });

    return { id: docId };
}

/** Server-side check — used by the final submit. */
export function missingRequiredDocs(documents) {
    const have = new Set((documents || []).map((d) => d.type));
    return REQUIRED_DOCUMENT_TYPES.filter((t) => !have.has(t));
}

/* ── Step 6: Final submit ─────────────────────────────── */

export async function submitFullApplication(userId) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw AppError.notFound('Vendor record not found.');
    if (vendor.status === 'approved') {
        throw AppError.conflict('Vendor already approved.');
    }

    // Walk through every step and collect what's missing.
    const incomplete = [];

    if (!vendor.businessName || !vendor.businessDescription) {
        incomplete.push('Storefront');
    }
    if (
        !vendor.legalBusinessName ||
        !vendor.businessType ||
        !vendor.businessRegistrationNo ||
        !vendor.taxId
    ) {
        incomplete.push('Legal & Tax');
    }
    if (
        !vendor.businessPhone ||
        !vendor.businessEmail ||
        !vendor.businessAddressLine1 ||
        !vendor.businessCity ||
        !vendor.businessState ||
        !vendor.businessZip ||
        !vendor.businessCountry
    ) {
        incomplete.push('Contact & Address');
    }
    if (
        !vendor.bankAccountHolder ||
        !vendor.bankName ||
        !vendor.bankAccountNumber
    ) {
        incomplete.push('Payouts');
    }

    const missingDocs = missingRequiredDocs(vendor.documents);
    if (missingDocs.length) incomplete.push('Documents');

    if (incomplete.length) {
        throw AppError.badRequest(
            `Please complete these sections before submitting: ${incomplete.join(', ')}.`,
            { incomplete, missingDocs }
        );
    }

    const updated = await prisma.vendor.update({
        where: { id: vendor.id },
        data: {
            status: 'pending',
            rejectionReason: null,
            applicationSubmittedAt: new Date(),
            applicationReviewedAt: null,
        },
    });

    await logActivity({
        actorType: 'user',
        actorId: userId,
        action: 'vendor.application_submitted',
        entityType: 'vendor',
        entityId: vendor.id,
        metadata: {
            documentCount: (vendor.documents || []).length,
            businessName: vendor.businessName,
        },
    });

    return toPublicVendor(updated);
}