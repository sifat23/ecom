const { PrismaClient, AdminRole, UserRole, VendorStatus, ProductStatus, FulfillmentType } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clean up existing data in reverse order of dependencies
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create 1 Admin
    const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
    const admin = await prisma.admin.create({
        data: {
            email: 'admin@marketplace.com',
            passwordHash: adminPasswordHash,
            firstName: 'Super',
            lastName: 'Admin',
            role: AdminRole.super_admin,
            isActive: true,
        },
    });
    console.log(`✅ Created Admin: ${admin.email}`);

    // 2. Create 5–6 Categories (Computer Accessories, TVs, Routers, Laptops, Perfume, Makeup)
    const categoriesData = [
        { name: 'Computer Accessories', slug: 'computer-accessories', taxCategoryCode: 'TC010000' },
        { name: 'TVs', slug: 'tvs', taxCategoryCode: 'TC020000' },
        { name: 'Routers', slug: 'routers', taxCategoryCode: 'TC030000' },
        { name: 'Laptops', slug: 'laptops', taxCategoryCode: 'TC040000' },
        { name: 'Perfume', slug: 'perfume', taxCategoryCode: 'TC050000' },
        { name: 'Makeup', slug: 'makeup', taxCategoryCode: 'TC060000' },
    ];

    const categories = {};
    for (const cat of categoriesData) {
        const createdCat = await prisma.category.create({ data: cat });
        categories[cat.slug] = createdCat;
        console.log(`✅ Created Category: ${cat.name}`);
    }

    // 3. Create 1 Test Vendor (Approved)
    const vendorUserPasswordHash = await bcrypt.hash('VendorPassword123!', 10);
    const vendorUser = await prisma.user.create({
        data: {
            email: 'vendor@techstore.com',
            passwordHash: vendorUserPasswordHash,
            firstName: 'John',
            lastName: 'Vendor',
            role: UserRole.vendor,
            emailVerified: true,
        },
    });

    const testVendor = await prisma.vendor.create({
        data: {
            userId: vendorUser.id,
            businessName: 'Tech & Beauty Global Inc.',
            businessDescription: 'Your premier destination for tech gadgets and luxury beauty products.',
            taxId: 'US12-3456789',
            stripeConnectId: 'acct_test_123456789',
            stripeOnboardingComplete: true,
            status: VendorStatus.approved,
            approvedById: admin.id,
            approvedAt: new Date(),
        },
    });
    console.log(`✅ Created Test Vendor: ${testVendor.businessName} (Approved)`);

    // 4. Create 3–5 Test Products across categories
    const productsData = [
        {
            title: 'Wireless Ergonomic Mouse',
            slug: 'wireless-ergonomic-mouse',
            description: 'Comfortable wireless mouse with customizable DPI settings.',
            price: 49.99,
            inventoryCount: 150,
            sku: 'ACC-MOU-001',
            categorySlug: 'computer-accessories',
            taxCategoryCode: 'TC010000',
            fulfillmentType: FulfillmentType.self_ship,
            status: ProductStatus.active,
            images: ['/uploads/products/mouse-1.jpg', '/uploads/products/mouse-2.jpg'],
        },
        {
            title: '4K Ultra HD Smart LED TV (55 inch)',
            slug: '4k-ultra-hd-smart-led-tv-55-inch',
            description: 'Stunning 4K resolution with built-in streaming apps and vibrant display colors.',
            price: 449.99,
            inventoryCount: 30,
            sku: 'TV-4K-55',
            categorySlug: 'tvs',
            taxCategoryCode: 'TC020000',
            fulfillmentType: FulfillmentType.warehouse,
            status: ProductStatus.active,
            images: ['/uploads/products/tv-55-1.jpg'],
        },
        {
            title: 'Wi-Fi 6 Gigabit Mesh Router',
            slug: 'wi-fi-6-gigabit-mesh-router',
            description: 'Lightning-fast whole home coverage router eliminating dead zones.',
            price: 129.99,
            inventoryCount: 75,
            sku: 'NET-WIFI6-01',
            categorySlug: 'routers',
            taxCategoryCode: 'TC030000',
            fulfillmentType: FulfillmentType.self_ship,
            status: ProductStatus.active,
            images: ['/uploads/products/router-1.jpg'],
        },
        {
            title: 'Pro Slim Laptop 16-inch',
            slug: 'pro-slim-laptop-16-inch',
            description: 'High-performance laptop for professionals, creators, and daily multi-tasking.',
            price: 1199.99,
            inventoryCount: 20,
            sku: 'LAP-PRO-16',
            categorySlug: 'laptops',
            taxCategoryCode: 'TC040000',
            fulfillmentType: FulfillmentType.warehouse,
            status: ProductStatus.active,
            images: ['/uploads/products/laptop-1.jpg', '/uploads/products/laptop-2.jpg'],
        },
        {
            title: 'Luxury Eau de Parfum (100ml)',
            slug: 'luxury-eau-de-parfum-100ml',
            description: 'Long-lasting floral and woody aromatic scent for all occasions.',
            price: 85.00,
            inventoryCount: 100,
            sku: 'PERF-LUX-100',
            categorySlug: 'perfume',
            taxCategoryCode: 'TC050000',
            fulfillmentType: FulfillmentType.self_ship,
            status: ProductStatus.active,
            images: ['/uploads/products/perfume-1.jpg'],
        },
    ];

    for (const prod of productsData) {
        const { categorySlug, images, ...productFields } = prod;
        const category = categories[categorySlug];

        const createdProduct = await prisma.product.create({
            data: {
                ...productFields,
                vendorId: testVendor.id,
                categoryId: category.id,
                images: {
                    create: images.map((url, index) => ({
                        url,
                        altText: `${prod.title} image ${index + 1}`,
                        sortOrder: index,
                    })),
                },
            },
        });
        console.log(`✅ Created Product: ${createdProduct.title}`);
    }

    console.log('🌱 Seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during database seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });