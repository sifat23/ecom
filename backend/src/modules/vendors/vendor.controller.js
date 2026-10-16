import * as service from './vendor.service.js';

export const me = async (req, res, next) => {
    try {
        const vendor = await service.getMyVendor(req.user.id);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};

/* ── Step 1: Storefront ───────────────────────────────── */

export const saveStoreDraft = async (req, res, next) => {
    try {
        const vendor = await service.saveStoreDraft(req.user.id, req.body);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};

export const submitStoreStep = async (req, res, next) => {
    try {
        const vendor = await service.submitStoreStep(req.user.id, req.body);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};

/* ── Step 2: Legal & Tax ──────────────────────────────── */

export const saveLegalDraft = async (req, res, next) => {
    try {
        const vendor = await service.saveLegalDraft(req.user.id, req.body);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};

export const submitLegalStep = async (req, res, next) => {
    try {
        const vendor = await service.submitLegalStep(req.user.id, req.body);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};

/* ── Legacy stub (kept for the old /stripe-onboarding-link route) ── */

export const onboardingLink = async (req, res, next) => {
    try {
        res.json({ url: `${process.env.APP_URL}/sell/onboarding/complete?account=stub` });
    } catch (e) { next(e); }
};

/* ── Step 3: Contact & Address ────────────────────────── */

export const saveContactDraft = async (req, res, next) => {
    try {
        const vendor = await service.saveContactDraft(req.user.id, req.body);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};

export const submitContactStep = async (req, res, next) => {
    try {
        const vendor = await service.submitContactStep(req.user.id, req.body);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};

/* ── Step 4: Payouts ──────────────────────────────────── */

export const saveBankDraft = async (req, res, next) => {
    try {
        const vendor = await service.saveBankDraft(req.user.id, req.body);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};

export const submitBankStep = async (req, res, next) => {
    try {
        const vendor = await service.submitBankStep(req.user.id, req.body);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};

/* ── Step 5: Documents ────────────────────────────────── */

export const uploadDocument = async (req, res, next) => {
    try {
        const document = await service.uploadVendorDocument(req.user.id, {
            file: req.file,
            documentType: req.body.documentType,
        });
        res.status(201).json({ success: true, data: { document } });
    } catch (e) { next(e); }
};

export const deleteDocument = async (req, res, next) => {
    try {
        const result = await service.deleteVendorDocument(req.user.id, req.params.docId);
        res.json({ success: true, data: result });
    } catch (e) { next(e); }
};

/* ── Step 6: Final submit ─────────────────────────────── */

export const submitFullApplication = async (req, res, next) => {
    try {
        const vendor = await service.submitFullApplication(req.user.id);
        res.json({ success: true, data: { vendor } });
    } catch (e) { next(e); }
};