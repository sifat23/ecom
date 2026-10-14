import { AppError } from '../utils/AppError.js';

/**
 * Yup validation middleware.
 * @param {import('yup').AnySchema} schema
 * @param {'body'|'query'|'params'} source
 */
export const validate = (schema, source = 'body') => async (req, _res, next) => {
    try {
        req[source] = await schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true,
        });
        next();
    } catch (err) {
        next(AppError.validation('Validation failed', err.errors ?? [err.message]));
    }
};