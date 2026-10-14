import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const slugify = (s) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const DEV_PASSWORD = 'Password123!';

async function main() {
    console.log('🌱  Seeding database...');
    const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);

    // ── Admin ────────────────────────────────────────────────
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@marketplace.local' },
        update: {},
        create: {
            email: 'admin@marketplace.local',
            passwordHash,
            firstName: 'Platform',
            lastName: 'Admin',
            role: 'super_admin',
        },
    });
    console.log(`   ✓ admin: ${admin.email}`);

    // ── Categories ───────────────────────────────────────────
    const categoryDefs = [
        'Computer Accessories',
        'TVs',
        'Routers',
        'Laptops',
        'Perfume',
        'Makeup',
    ];

    const categories = {};
    for (const name of categoryDefs) {
        const slug = slugify(name);
        const cat = await prisma.category.upsert({
            where: { slug },
            update: {},
            create: {
                name,
                slug,
                // Stripe Tax: "General – Tangible Goods". Refine per-category later.
                taxCategoryCode: 'txcd_99999999',
            },
        });
        categories[slug] = cat;
    }
    console.log(`   ✓ ${Object.keys(categories).length} categories`);

    // ── Vendor user + vendor profile ─────────────────────────
    const vendorUser = await prisma.user.upsert({
        where: { email: 'vendor@marketplace.local' },
        update: {},
        create: {
            email: 'vendor@marketplace.local',
            passwordHash,
            firstName: 'Test',
            lastName: 'Vendor',
            role: 'vendor',
            emailVerified: true,
        },
    });

    let vendor = await prisma.vendor.findUnique({ where: { userId: vendorUser.id } });
    if (!vendor) {
        vendor = await prisma.vendor.create({
            data: {
                userId: vendorUser.id,
                businessName: 'Acme Electronics',
                businessDescription: 'Dev seed vendor. Sells assorted consumer electronics.',
                taxId: '00-0000000',
                stripeOnboardingComplete: true,
                status: 'approved',
                approvedById: admin.id,
                approvedAt: new Date(),
            },
        });
    }
    console.log(`   ✓ vendor: ${vendor.businessName} (${vendor.status})`);

    // ── Customer ─────────────────────────────────────────────
    const customer = await prisma.user.upsert({
        where: { email: 'customer@marketplace.local' },
        update: {},
        create: {
            email: 'customer@marketplace.local',
            passwordHash,
            firstName: 'Test',
            lastName: 'Customer',
            role: 'customer',
            emailVerified: true,
        },
    });
    console.log(`   ✓ customer: ${customer.email}`);

    // ── Products ─────────────────────────────────────────────
    const productDefs = [
        { title: 'Wireless Mechanical Keyboard',   cat: 'computer-accessories', price: 89.99,  stock: 40 },
        { title: '27" 4K IPS Monitor',             cat: 'tvs',                  price: 329.00, stock: 12 },
        { title: 'Wi-Fi 6E Mesh Router (3-pack)',  cat: 'routers',              price: 249.50, stock: 18 },
        { title: '14" Ultrabook — 16GB / 512GB',   cat: 'laptops',              price: 1099.00, stock: 7 },
        { title: 'Amber Oud Eau de Parfum 50ml',   cat: 'perfume',              price: 74.00,  stock: 25 },
    ];

    for (const def of productDefs) {
        const slug = slugify(def.title);
        await prisma.product.upsert({
            where: { slug },
            update: {},
            create: {
                vendorId: vendor.id,
                categoryId: categories[def.cat].id,
                title: def.title,
                slug,
                description: `${def.title} — seeded for local development.`,
                price: def.price,
                inventoryCount: def.stock,
                taxCategoryCode: 'txcd_99999999',
                fulfillmentType: 'self_ship',
                status: 'active',
                images: {
                    create: [{
                        url: '/uploads/products/placeholder.png',
                        altText: def.title,
                        sortOrder: 0,
                    }],
                },
            },
        });
    }
    console.log(`   ✓ ${productDefs.length} products`);

    console.log('\n✅  Seed complete.\n');
    console.log('   Admin    admin@marketplace.local    / Password123!');
    console.log('   Vendor   vendor@marketplace.local   / Password123!');
    console.log('   Customer customer@marketplace.local / Password123!\n');
}

main()
    .catch((e) => { console.error('❌  Seed failed:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());