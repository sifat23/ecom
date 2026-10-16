import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { draftSanitizer } from '../../middleware/draftSanitizer.js';
import {
    vendorStoreDraftSchema,
    vendorStoreSubmitSchema,
    vendorLegalDraftSchema,
    vendorLegalSubmitSchema,
    vendorContactDraftSchema,
    vendorContactSubmitSchema,
    vendorBankDraftSchema,
    vendorBankSubmitSchema,
} from './vendor.schemas.js';
import * as controller from './vendor.controller.js';
import { vendorDocUpload } from '../../middleware/upload.js';

const router = Router();
router.use(requireAuth, requireRole('vendor'));

/* ── Read ─────────────────────────────────────────────── */
router.get('/me', controller.me);

/* ── Step 1: Storefront ───────────────────────────────── */
router.post(
    '/store/draft',
    draftSanitizer,
    validate(vendorStoreDraftSchema),
    controller.saveStoreDraft,
);
router.post(
    '/store/submit',
    validate(vendorStoreSubmitSchema),
    controller.submitStoreStep,
);

/* ── Step 2: Legal & Tax ──────────────────────────────── */
router.post(
    '/legal/draft',
    draftSanitizer,
    validate(vendorLegalDraftSchema),
    controller.saveLegalDraft,
);
router.post(
    '/legal/submit',
    validate(vendorLegalSubmitSchema),
    controller.submitLegalStep,
);

/* ── Step 3: Contact & Address ────────────────────────── */
router.post(
    '/contact/draft',
    draftSanitizer,
    validate(vendorContactDraftSchema),
    controller.saveContactDraft,
);
router.post(
    '/contact/submit',
    validate(vendorContactSubmitSchema),
    controller.submitContactStep,
);

/* ── Step 4: Payouts ──────────────────────────────────── */
router.post(
    '/bank/draft',
    draftSanitizer,
    validate(vendorBankDraftSchema),
    controller.saveBankDraft,
);
router.post(
    '/bank/submit',
    validate(vendorBankSubmitSchema),
    controller.submitBankStep,
);

/* ── Step 5: Documents ────────────────────────────────── */
router.post(
    '/documents/upload',
    vendorDocUpload.single('file'),
    controller.uploadDocument,
);
router.delete(
    '/documents/:docId',
    controller.deleteDocument,
);

/* ── Step 6: Final submit ─────────────────────────────── */
router.post(
    '/application/submit',
    controller.submitFullApplication,
)

/* ── Stripe onboarding stub (kept for the dashboard link) ── */
router.post('/stripe-onboarding-link', controller.onboardingLink);

export default router;