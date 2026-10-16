import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const slugify = (s) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const DEV_PASSWORD = 'Password123!';

async function main() {
    console.log('🌱  Seeding database...');
    const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);

    // ── Super Admin ──────────────────────────────────────────
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@marketplace.local' },
        update: {
            firstName: 'Henrik',
            lastName: 'Vang',
            role: 'super_admin',
            isActive: true,
            passwordHash,
        },
        create: {
            email: 'admin@marketplace.local',
            passwordHash,
            firstName: 'Henrik',
            lastName: 'Vang',
            role: 'super_admin',
            isActive: true,
        },
    });
    console.log(`   ✓ admin: ${admin.email} (Henrik Vang, super_admin)`);

    const superAdmin = await prisma.admin.upsert({
        where: { email: 'superadmin@marketplace.local' },
        update: {
            firstName: 'Henrik',
            lastName: 'Vang',
            role: 'super_admin',
            isActive: true,
            passwordHash,
        },
        create: {
            email: 'superadmin@marketplace.local',
            passwordHash,
            firstName: 'Henrik',
            lastName: 'Vang',
            role: 'super_admin',
            isActive: true,
        },
    });
    console.log(`   ✓ superadmin: ${superAdmin.email} (Henrik Vang, super_admin)`);

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
    const acmeDocs = [
        {
            id: 'doc-acme-1',
            name: 'Business_Incorporation_Certificate.pdf',
            type: 'Business Registration',
            fileType: 'pdf',
            fileSize: '2.1 MB',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            uploadedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        },
        {
            id: 'doc-acme-2',
            name: 'State_Tax_Identification_EIN.pdf',
            type: 'Tax & EIN Registration',
            fileType: 'pdf',
            fileSize: '1.4 MB',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            uploadedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        },
    ];

    if (!vendor) {
        vendor = await prisma.vendor.create({
            data: {
                userId: vendorUser.id,
                businessName: 'Acme Electronics',
                businessDescription: 'Dev seed vendor. Sells assorted consumer electronics.',
                businessRegistrationNo: 'DK-9842109',
                taxId: '00-0000000',
                stripeOnboardingComplete: true,
                status: 'approved',
                approvedById: admin.id,
                approvedAt: new Date(),
                documents: acmeDocs,
            },
        });
    } else {
        vendor = await prisma.vendor.update({
            where: { id: vendor.id },
            data: { documents: acmeDocs },
        });
    }
    console.log(`   ✓ vendor: ${vendor.businessName} (${vendor.status})`);

    // ── Additional Pending & Evaluated Vendors ──────────────
    const sampleVendors = [
        {
            email: 'astrid.oak@atelier.local',
            firstName: 'Astrid',
            lastName: 'Lind',
            phone: '+45 31 44 92 10',
            businessName: 'Nordic Oak Studios',
            businessDescription: 'Hand-turned Nordic oak horologes, minimalist clocks, and sustainable joinery based in Copenhagen.',
            businessRegistrationNo: 'CPH-REG-2024-8812',

            legalBusinessName: 'Nordic Oak Studios ApS',
            businessType: 'llc',
            businessPhone: '+45 31 44 92 10',
            businessEmail: 'hello@nordicoak.dk',
            website: 'https://nordicoak.dk',
            yearsInBusiness: 8,
            employeeCount: 4,
            vatNumber: 'DK-77291044',
            businessAddressLine1: 'Nørrebrogade 42',
            businessAddressLine2: 'Suite 3B',
            businessCity: 'Copenhagen',
            businessState: 'Hovedstaden',
            businessZip: '2200',
            businessCountry: 'DK',
            bankAccountHolder: 'Nordic Oak Studios ApS',
            bankName: 'Danske Bank',
            bankAccountNumber: 'DK5000400440116243',
            bankRoutingNumber: '0040',
            bankIban: 'DK5000400440116243',
            bankSwift: 'DABADKKK',
            applicationSubmittedAt: new Date(Date.now() - 2 * 86400000),

            taxId: 'DK-77291044',
            status: 'pending',
            documents: [
                {
                    id: 'doc-oak-1',
                    name: 'Danish_Commercial_Registry_NordicOak.pdf',
                    type: 'Business Trade License',
                    fileType: 'pdf',
                    fileSize: '2.8 MB',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
                },
                {
                    id: 'doc-oak-2',
                    name: 'VAT_Tax_Compliance_Declaration.pdf',
                    type: 'Tax Identification & VAT',
                    fileType: 'pdf',
                    fileSize: '1.5 MB',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
                },
                {
                    id: 'doc-oak-3',
                    name: 'Nordic_Forestry_FSC_Timber_Certification.pdf',
                    type: 'Sustainability & Guild Audit',
                    fileType: 'pdf',
                    fileSize: '3.2 MB',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
                },
                {
                    id: 'doc-oak-4',
                    name: 'Passport_Owner_Astrid_Lind.jpg',
                    type: 'Founder Identity Proof',
                    fileType: 'image',
                    fileSize: '4.6 MB',
                    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
                    uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
                },
            ],
        },
        {
            email: 'kenji.ceramics@atelier.local',
            firstName: 'Kenji',
            lastName: 'Takahashi',
            phone: '+81 75 491 8820',
            businessName: 'Kyoto Ceramic Atelier',
            businessDescription: 'Third-generation wood-fired stoneware, tea ceremony ceramics, and natural celadon glaze pottery from Higashiyama.',
            businessRegistrationNo: 'KYO-ART-99382',
            taxId: 'JP-881920311',
            status: 'pending',
            documents: [
                {
                    id: 'doc-kyo-1',
                    name: 'Kyoto_Prefecture_Business_Permit.pdf',
                    type: 'Boutique Business Permit',
                    fileType: 'pdf',
                    fileSize: '2.1 MB',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
                },
                {
                    id: 'doc-kyo-2',
                    name: 'Master_Ceramist_Accreditation_Scroll.jpg',
                    type: 'Artisan Guild Accreditation',
                    fileType: 'image',
                    fileSize: '5.2 MB',
                    url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
                    uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
                },
                {
                    id: 'doc-kyo-3',
                    name: 'National_Tax_Agency_Registration.pdf',
                    type: 'Tax Clearance Certificate',
                    fileType: 'pdf',
                    fileSize: '1.8 MB',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
                },
            ],
        },
        {
            email: 'matteo.leather@atelier.local',
            firstName: 'Matteo',
            lastName: 'Rossi',
            phone: '+39 055 238 1190',
            businessName: 'Tuscan Leather Guild',
            businessDescription: 'Vegetable-tanned Tuscan calfskin leather accessories, bespoke hand-stitched travel bags, and artisan leather goods.',
            businessRegistrationNo: 'IT-FI-7840192',
            taxId: 'IT-08492019382',
            status: 'pending',
            documents: [
                {
                    id: 'doc-tusc-1',
                    name: 'Camera_di_Commercio_Firenze_Certificate.pdf',
                    type: 'Chamber of Commerce Registry',
                    fileType: 'pdf',
                    fileSize: '3.4 MB',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    uploadedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
                },
                {
                    id: 'doc-tusc-2',
                    name: 'Pelle_Conciata_al_Vegetale_Certification.pdf',
                    type: 'Artisan Material Verification',
                    fileType: 'pdf',
                    fileSize: '2.9 MB',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    uploadedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
                },
                {
                    id: 'doc-tusc-3',
                    name: 'Carta_d_Identita_Matteo_Rossi.jpg',
                    type: 'Director Identity Document',
                    fileType: 'image',
                    fileSize: '3.1 MB',
                    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
                    uploadedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
                },
            ],
        },
        {
            email: 'soeren.glass@atelier.local',
            firstName: 'Søren',
            lastName: 'Møller',
            phone: '+45 22 18 90 41',
            businessName: 'Vesterbro Glassworks',
            businessDescription: 'Hand-blown sculptural glassware, mouth-blown carafes, and molten glass home decor.',
            businessRegistrationNo: 'DK-49102941',
            taxId: 'DK-99201948',
            status: 'rejected',
            rejectionReason: 'Business tax registration paper submitted has expired. Please submit an updated 2026 EU tax certificate.',
            documents: [
                {
                    id: 'doc-glass-1',
                    name: 'Expired_Tax_Registration_2023.pdf',
                    type: 'Tax Registration (Expired)',
                    fileType: 'pdf',
                    fileSize: '1.2 MB',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    uploadedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
                },
            ],
        },
    ];

    for (const vData of sampleVendors) {
        const u = await prisma.user.upsert({
            where: { email: vData.email },
            update: {
                firstName: vData.firstName,
                lastName: vData.lastName,
                phone: vData.phone,
                role: 'vendor',
                emailVerified: true,
            },
            create: {
                email: vData.email,
                passwordHash,
                firstName: vData.firstName,
                lastName: vData.lastName,
                phone: vData.phone,
                role: 'vendor',
                emailVerified: true,
            },
        });

        const v = await prisma.vendor.upsert({
            where: { userId: u.id },
            update: {
                businessName: vData.businessName,
                businessDescription: vData.businessDescription,
                businessRegistrationNo: vData.businessRegistrationNo,
                taxId: vData.taxId,
                status: vData.status,
                rejectionReason: vData.rejectionReason || null,
                documents: vData.documents,
            },
            create: {
                userId: u.id,
                businessName: vData.businessName,
                businessDescription: vData.businessDescription,
                businessRegistrationNo: vData.businessRegistrationNo,
                taxId: vData.taxId,
                status: vData.status,
                rejectionReason: vData.rejectionReason || null,
                documents: vData.documents,
            },
        });
        console.log(`   ✓ vendor: ${v.businessName} (${v.status}) with ${vData.documents.length} docs`);
    }

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
        { title: 'Wireless Mechanical Keyboard', cat: 'computer-accessories', price: 89.99, stock: 40 },
        { title: '27" 4K IPS Monitor', cat: 'tvs', price: 329.00, stock: 12 },
        { title: 'Wi-Fi 6E Mesh Router (3-pack)', cat: 'routers', price: 249.50, stock: 18 },
        { title: '14" Ultrabook — 16GB / 512GB', cat: 'laptops', price: 1099.00, stock: 7 },
        { title: 'Amber Oud Eau de Parfum 50ml', cat: 'perfume', price: 74.00, stock: 25 },
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
    console.log('   Super Admin: admin@marketplace.local      / Password123!');
    console.log('   Super Admin: superadmin@marketplace.local / Password123!');
    console.log('   Vendor:      vendor@marketplace.local     / Password123!');
    console.log('   Customer:    customer@marketplace.local   / Password123!\n');
}

main()
    .catch((e) => { console.error('❌  Seed failed:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());