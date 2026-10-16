import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const ALLOWED = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
]);

export const vendorDocUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED.has(file.mimetype)) {
            return cb(AppError.badRequest('Only PDF, JPG, PNG or WebP files are allowed'));
        }
        cb(null, true);
    },
});