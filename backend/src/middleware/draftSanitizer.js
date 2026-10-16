/**
 * Deletes empty-string / null / undefined keys from req.body so
 * partial draft payloads don't overwrite existing values with blanks.
 *
 * Only mounted on draft endpoints. The strict submit schema sees the
 * raw body and reports "required" errors properly.
 */
export function draftSanitizer(req, _res, next) {
    if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
        for (const key of Object.keys(req.body)) {
            const v = req.body[key];
            if (v === '' || v === null || v === undefined) delete req.body[key];
        }
    }
    next();
}