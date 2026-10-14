export class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(msg = 'Bad request', details)  { return new AppError(msg, 400, 'BAD_REQUEST', details); }
    static unauthorized(msg = 'Unauthorized')        { return new AppError(msg, 401, 'UNAUTHORIZED'); }
    static forbidden(msg = 'Forbidden')              { return new AppError(msg, 403, 'FORBIDDEN'); }
    static notFound(msg = 'Not found')               { return new AppError(msg, 404, 'NOT_FOUND'); }
    static conflict(msg = 'Conflict')                { return new AppError(msg, 409, 'CONFLICT'); }
    static validation(msg = 'Validation failed', d)  { return new AppError(msg, 422, 'VALIDATION_ERROR', d); }
    static internal(msg = 'Internal server error')   { return new AppError(msg, 500, 'INTERNAL_ERROR'); }
}