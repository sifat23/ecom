import * as service from './vendor.service.js';

export const register = async (req, res, next) => {
    try { res.status(201).json(await service.registerVendor(req.user.id, req.body)); }
    catch (e) { next(e); }
};

export const me = async (req, res, next) => {
    try { res.json(await service.getMyVendor(req.user.id)); }
    catch (e) { next(e); }
};

export const resubmit = async (req, res, next) => {
    try { res.json(await service.resubmitVendor(req.user.id)); }
    catch (e) { next(e); }
};

export const onboardingLink = async (req, res, next) => {
    try {
        // TODO Phase 2: stripe.accounts.create() + accountLinks.create()
        // For now return a stub so the UI redirect doesn't dead-end during testing.
        res.json({ url: `${process.env.APP_URL}/sell/onboarding/complete?account=stub` });
    } catch (e) { next(e); }
};