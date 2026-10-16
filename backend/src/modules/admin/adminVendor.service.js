import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../../services/activityLogger.js';
import { vendorApprovedEmail, vendorRejectedEmail } from '../../services/emailTemplates.js';
import { sendMail } from '../../services/mailer.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

/**
 * List vendors by querying users with role 'vendor'
 * Includes their extended business profile, verification documents, and review status
 */
export async function listVendors({ status, search, page = 1, limit = 50 } = {}) {
    const userWhere = {
        role: 'vendor',
    };

    if (status && status !== 'all') {
        if (status === 'pending') {
            // Pending includes vendors with status 'pending' OR registered vendor users awaiting submission
            userWhere.OR = [
                { vendor: null },
                { vendor: { status: 'pending' } },
            ];
        } else {
            userWhere.vendor = {
                status,
            };
        }
    }

    if (search && search.trim()) {
        const q = search.trim();
        const searchFilter = {
            OR: [
                { email: { contains: q, mode: 'insensitive' } },
                { firstName: { contains: q, mode: 'insensitive' } },
                { lastName: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q, mode: 'insensitive' } },
                { vendor: { businessName: { contains: q, mode: 'insensitive' } } },
                { vendor: { businessRegistrationNo: { contains: q, mode: 'insensitive' } } },
                { vendor: { taxId: { contains: q, mode: 'insensitive' } } },
            ],
        };

        if (userWhere.OR) {
            userWhere.AND = [{ OR: userWhere.OR }, searchFilter];
            delete userWhere.OR;
        } else {
            userWhere.AND = [searchFilter];
        }
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    // Concurrently fetch counts and page of vendor users
    const [
        users,
        totalMatching,
        allCount,
        pendingCount,
        approvedCount,
        rejectedCount,
    ] = await Promise.all([
        prisma.user.findMany({
            where: userWhere,
            include: {
                vendor: {
                    include: {
                        approvedBy: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                role: true,
                            },
                        },
                        _count: {
                            select: { products: true, orderItems: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: Number(limit),
        }),
        prisma.user.count({ where: userWhere }),
        prisma.user.count({ where: { role: 'vendor' } }),
        prisma.user.count({
            where: {
                role: 'vendor',
                OR: [{ vendor: null }, { vendor: { status: 'pending' } }],
            },
        }),
        prisma.user.count({
            where: {
                role: 'vendor',
                vendor: { status: 'approved' },
            },
        }),
        prisma.user.count({
            where: {
                role: 'vendor',
                vendor: { status: 'rejected' },
            },
        }),
    ]);

    // Map each user with their vendor profile and submitted documents
    const vendors = users.map((user) => {
        const v = user.vendor;
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        const defaultName = fullName || user.email.split('@')[0];

        // Helper for review completeness
        const requiredDocTypes = ['business_registration', 'tax_certificate', 'national_id'];
        const uploadedTypes = new Set(
            (Array.isArray(v?.documents) ? v.documents : []).map((d) => d.type)
        );
        const missingDocs = requiredDocTypes.filter((t) => !uploadedTypes.has(t));

        return {
            id: v?.id || user.id,
            vendorId: v?.id || null,
            userId: user.id,
            businessName: v?.businessName || defaultName,
            businessDescription: v?.businessDescription || '',
            legalBusinessName: v?.legalBusinessName || null,
            businessType: v?.businessType || null,
            businessRegistrationNo: v?.businessRegistrationNo || null,
            taxId: v?.taxId || null,
            vatNumber: v?.vatNumber || null,
            businessPhone: v?.businessPhone || null,
            businessEmail: v?.businessEmail || null,
            website: v?.website || null,
            yearsInBusiness: v?.yearsInBusiness ?? null,
            employeeCount: v?.employeeCount ?? null,
            businessAddress: v
                ? {
                    line1: v.businessAddressLine1,
                    line2: v.businessAddressLine2,
                    city: v.businessCity,
                    state: v.businessState,
                    zip: v.businessZip,
                    country: v.businessCountry,
                }
                : null,
            bank: v
                ? {
                    accountHolder: v.bankAccountHolder,
                    accountNumberMasked: v.bankAccountNumber
                        ? `${'•'.repeat(Math.min(v.bankAccountNumber.length - 4, 8))}${v.bankAccountNumber.slice(-4)}`
                        : null,
                    bankName: v.bankName,
                    routingNumber: v.bankRoutingNumber,
                    ibanMasked: v.bankIban
                        ? `${'•'.repeat(Math.min(v.bankIban.length - 4, 8))}${v.bankIban.slice(-4)}`
                        : null,
                    swift: v.bankSwift,
                }
                : null,
            stripeConnectId: v?.stripeConnectId || null,
            stripeOnboardingComplete: v?.stripeOnboardingComplete ?? false,
            status: v?.status || 'pending',
            rejectionReason: v?.rejectionReason || null,
            approvedById: v?.approvedById || null,
            approvedAt: v?.approvedAt || null,
            approvedBy: v?.approvedBy || null,
            documents: Array.isArray(v?.documents) ? v.documents : [],
            missingDocs,
            isReadyForReview: Boolean(v?.businessName),
            applicationSubmittedAt: v?.applicationSubmittedAt || null,
            applicationReviewedAt: v?.applicationReviewedAt || null,
            createdAt: v?.createdAt || user.createdAt,
            updatedAt: v?.updatedAt || user.updatedAt,
            hasSubmittedProfile: Boolean(v?.applicationSubmittedAt),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
            },
            _count: v?._count || { products: 0, orderItems: 0 },
        };
    });

    return {
        vendors,
        total: totalMatching,
        page: Number(page),
        limit: Number(limit),
        counts: {
            all: allCount,
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
        },
    };
}

/**
 * Get detailed vendor record including submitted documents and activities
 */
export async function getVendorDetail(vendorId) {
    let vendor = await prisma.vendor.findFirst({
        where: {
            OR: [
                { id: vendorId },
                { userId: vendorId },
            ],
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    emailVerified: true,
                    createdAt: true,
                },
            },
            approvedBy: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            },
            _count: {
                select: { products: true, orderItems: true },
            },
        },
    });

    if (!vendor) {
        // If not found in Vendor table, look up in User table with role 'vendor'
        const user = await prisma.user.findFirst({
            where: { id: vendorId, role: 'vendor' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw AppError.notFound('Vendor not found');
        }

        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        vendor = {
            id: user.id,
            vendorId: null,
            userId: user.id,
            businessName: fullName || user.email.split('@')[0],
            businessDescription: 'Registered vendor account awaiting business details and verification papers.',
            businessRegistrationNo: null,
            taxId: null,
            stripeConnectId: null,
            stripeOnboardingComplete: false,
            status: 'pending',
            rejectionReason: null,
            approvedById: null,
            approvedAt: null,
            approvedBy: null,
            documents: [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            hasSubmittedProfile: false,
            user,
            _count: { products: 0, orderItems: 0 },
        };
    }

    const activities = await prisma.activity.findMany({
        where: {
            entityType: 'vendor',
            OR: [
                { entityId: vendor.id },
                { entityId: vendor.userId },
            ],
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
    });

    return {
        vendor,
        activities,
    };
}

/**
 * Approve a vendor and notify via email
 */
export async function approveVendor({ vendorId, admin, req }) {
    const existing = await prisma.vendor.findFirst({
        where: { OR: [{ id: vendorId }, { userId: vendorId }] },
        include: { user: true },
    });

    if (!existing) throw AppError.notFound('Vendor not found');

    if (!existing.applicationSubmittedAt) {
        throw AppError.badRequest(
            'This vendor has not submitted a complete application yet. Required documents are missing.'
        );
    }

    const requiredDocTypes = ['business_registration', 'tax_certificate', 'national_id'];
    const uploadedTypes = new Set(
        (Array.isArray(existing.documents) ? existing.documents : []).map((d) => d.type)
    );
    const missing = requiredDocTypes.filter((t) => !uploadedTypes.has(t));
    if (missing.length) {
        throw AppError.badRequest(
            `Cannot approve — missing required documents: ${missing.join(', ')}`
        );
    }

    const updated = await prisma.vendor.update({
        where: { id: existing.id },
        data: {
            status: 'approved',
            rejectionReason: null,
            approvedById: admin.id,
            approvedAt: new Date(),
            applicationReviewedAt: new Date(),
        },
        // ...rest unchanged
    });

    // ...rest of function unchanged (activity log + email)
}

/**
 * Reject a vendor with reason and notify via email
 */
export async function rejectVendor({ vendorId, reason, admin, req }) {
    if (!reason || !reason.trim()) {
        throw AppError.badRequest('Rejection reason is required');
    }

    let existing = await prisma.vendor.findFirst({
        where: {
            OR: [
                { id: vendorId },
                { userId: vendorId },
            ],
        },
        include: { user: true },
    });

    if (!existing) {
        const user = await prisma.user.findFirst({
            where: { id: vendorId, role: 'vendor' },
        });
        if (!user) {
            throw AppError.notFound('Vendor not found');
        }
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        existing = await prisma.vendor.create({
            data: {
                userId: user.id,
                businessName: fullName || user.email.split('@')[0],
                status: 'pending',
                documents: [],
            },
            include: { user: true },
        });
    }

    const updated = await prisma.vendor.update({
        where: { id: existing.id },
        data: {
            status: 'rejected',
            rejectionReason: reason.trim(),
            approvedById: admin.id,
            approvedAt: new Date(),
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            },
            approvedBy: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            },
        },
    });

    const adminFullName = `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'Super Admin';
    const actionDate = new Date();

    // Audit log activity
    await logActivity({
        actorType: 'admin',
        actorId: admin.id,
        action: 'vendor.rejected',
        entityType: 'vendor',
        entityId: updated.id,
        metadata: {
            adminId: admin.id,
            adminName: adminFullName,
            adminEmail: admin.email,
            adminRole: admin.role,
            vendorName: updated.businessName,
            vendorEmail: updated.user?.email,
            rejectionReason: reason.trim(),
            action: 'Rejected vendor registration application',
            timestamp: actionDate.toISOString(),
            dateFormatted: actionDate.toLocaleDateString(),
            timeFormatted: actionDate.toLocaleTimeString(),
        },
        req,
    });

    // Send email to vendor
    if (updated.user?.email) {
        try {
            const tpl = vendorRejectedEmail({
                vendorName: updated.businessName,
                adminName: adminFullName,
                adminEmail: admin.email,
                reason: reason.trim(),
                resubmitUrl: `${env.APP_URL}/vendor/rejected`,
            });
            await sendMail({
                to: updated.user.email,
                ...tpl,
            });
        } catch (mailErr) {
            logger.error(`Failed to send vendor rejection email: ${mailErr.message}`);
        }
    }

    return updated;
}

/**
 * Get all vendor-related administrative activities
 */
export async function getVendorActivities({ limit = 50 } = {}) {
    return prisma.activity.findMany({
        where: {
            OR: [
                { action: { startsWith: 'vendor.' } },
                { entityType: 'vendor' },
            ],
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
    });
}
