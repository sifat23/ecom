import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { vendorRegisterSchema } from './vendor.schemas.js';
import * as controller from './vendor.controller.js';

const router = Router();
router.use(requireAuth, requireRole('vendor'));

router.post('/register', validate(vendorRegisterSchema), controller.register);
router.get('/me', controller.me);
router.post('/resubmit', controller.resubmit);
router.post('/stripe-onboarding-link', controller.onboardingLink);

export default router;