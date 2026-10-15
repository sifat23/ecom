import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../../services/activityLogger.js';

export async function registerVendor(userId, input) {
    const existing = await prisma.vendor.findUnique({ where: { userId } });
    if (existing) {
        if (existing.status === 'approved') {
            throw new AppError('Vendor profile already exists and is approved', 409);
        }
        const vendor = await prisma.vendor.update({
            where: { id: existing.id },
            data: { status: 'pending', ...input },
        });
        await logActivity({
            actorType: 'user', actorId: userId,
            action: 'vendor.registered', entityType: 'vendor', entityId: vendor.id,
        });
        return vendor;
    }

    const vendor = await prisma.vendor.create({
        data: { userId, status: 'pending', ...input },
    });

    await logActivity({
        actorType: 'user', actorId: userId,
        action: 'vendor.registered', entityType: 'vendor', entityId: vendor.id,
    });
    return vendor;
}

export async function getMyVendor(userId) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new AppError('Vendor profile not found', 404);
    return vendor;
}

export async function resubmitVendor(userId) {
    const vendor = await getMyVendor(userId);
    if (vendor.status !== 'rejected') throw new AppError('Only rejected vendors can resubmit', 400);
    return prisma.vendor.update({
        where: { id: vendor.id },
        data: { status: 'pending', rejectionReason: null },
    });
}