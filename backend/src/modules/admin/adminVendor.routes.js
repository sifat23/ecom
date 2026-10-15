import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import * as controller from './adminVendor.controller.js';

const router = Router();

// Protect all admin vendor routes with requireAdmin
router.use(requireAdmin);

router.get('/', controller.list);
router.get('/activities', controller.activities);
router.get('/:id', controller.getDetail);
router.post('/:id/approve', controller.approve);
router.post('/:id/reject', controller.reject);

export default router;

