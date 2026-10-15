import crypto from 'node:crypto';

/** 32 random bytes → 64-char hex string. Used for refresh + password reset tokens. */
export function randomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
}

/** SHA-256 hex of an arbitrary string. Used to store tokens without keeping the raw value. */
export function sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

/** Timing-safe string comparison. */
export function safeEqual(a, b) {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
}