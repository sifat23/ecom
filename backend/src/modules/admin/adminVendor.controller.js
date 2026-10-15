import * as adminVendorService from './adminVendor.service.js';

export async function list(req, res, next) {
    try {
        const result = await adminVendorService.listVendors(req.query);
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
}

export async function getDetail(req, res, next) {
    try {
        const result = await adminVendorService.getVendorDetail(req.params.id);
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
}

export async function approve(req, res, next) {
    try {
        const vendor = await adminVendorService.approveVendor({
            vendorId: req.params.id,
            admin: req.admin,
            req,
        });
        res.json({
            success: true,
            data: {
                message: `Vendor "${vendor.businessName}" approved successfully. Notification email dispatched.`,
                vendor,
            },
        });
    } catch (err) { next(err); }
}

export async function reject(req, res, next) {
    try {
        const vendor = await adminVendorService.rejectVendor({
            vendorId: req.params.id,
            reason: req.body.reason,
            admin: req.admin,
            req,
        });
        res.json({
            success: true,
            data: {
                message: `Vendor "${vendor.businessName}" rejected. Notification email dispatched with explanation.`,
                vendor,
            },
        });
    } catch (err) { next(err); }
}

export async function activities(req, res, next) {
    try {
        const items = await adminVendorService.getVendorActivities({
            limit: req.query.limit ? Number(req.query.limit) : 50,
        });
        res.json({ success: true, data: { activities: items } });
    } catch (err) { next(err); }
}

