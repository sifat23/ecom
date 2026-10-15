// Replace with RTK Query hooks in Phase 3. Self-contained so pages are previewable now.

const initials = (s) =>
    s.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const IMG = {
    backpack: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfpXyQNYv1SXAlc9QFI5Fg79tbZAnZGCM6O2mHkP2mTmvBwPF00EQYbtjxeXOW0E4WBR10aBenXPnSsgDZDVAGBmeaf4MF2doo7kG1jJhywnAlu8Zr1P7hJnF37w-SAhtR2mLy57ooAAyC-AK0NwqntRvzS-LxctLwG2IHSwbhUMcGD7gs_7--vFGdKOJ8F1KZR7FidHMpG-pGzUZHIhjA6ABC-3u5HNUBY35QAO0RntEOcO5FwH4D',
    sneakers: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKzY-QD5dbBWK0R2AkgrjFN-0gAtjo59x1CWRhYnwC5vgP8QYkJb_2xf1HY_FB2OYmSXkGgQPudgBdHn8hPoVdjz1PgUk4hC-97UdZnRuM241OU2YWlfPgM0MIAIYZmXV4OiEjPXqscXMNe6lRNVHtoQb3_l6DANT5yhWEPaPoHyU8Y2z0JnOejfGQqnDO6BsSZxAYPnxBxtNnqtFVkZOPCMfnpsLtPAO8bHlT0IOEDuO-bndy9IgF',
    watch: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnKxrPQ2oLiKRtneRwICDi2LSr-vhjwGBNw0iYkcQ1Hax62FbQtLroK_yfFEzWXFWY_XWfHO_lXEohMDYayOmpKKDHVzcm9TzDBTO3rE8Kb4cNxjp0Uu3UUEz4xqvb4xkFWhLkJVmQhb6aBjlE-RIWK4jRddyV36wUa0jaX1kJ3pezykZ_BaMK4PO8qLMucDddXOeuiJpljILmRjpF2WsDRLJ42YnL65LzG5sosat5ZlQimvFclSxz',
    sunglasses: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjTq8-xGb-8-MbMcPl-yUSb-VwYAPgfNstl64U-4zyf9XC8SkWPN8w3yJsVG4MdA2VzgKOouMS949hvZxCkh9mllsJs74ZWIrIaWLKKTUp2K66aAApiaXAY6XlSkjZghEgM3lO3QI7WvwHeG0BC64XelJeoHj69eA3DASyluWEoLGWNOFsrnNJr-hkGJOyLZbB5lJKRRLZZibQbhJXVk6M__cCTmH4E8cB-asElhFhkRW6EPU2akdX',
    flask: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4TwAups7xuqgbXoPWV34L-Gtl-xu_zfLDgy7gkz5HcyNGS3XzJ1EppJeSg-VHdnjyWfDnECSpcsaraEC307oIjiqZ5KigNJEXo0H3u50jWu1Jzvc4rLqWP4ZQc4fXheZVboSgaWfM88nBO3YKXJW3STbwluKh5QDLnO-xtzOc45nEVbz285KO1YMI1JDyFeeAXGc6Ms_qHCtdJS-oInmeiALQ60lCzTdAh6hiBG-SelIge8CItNjE',
    tote: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrAGuCxtTfj8Ik1vs2G2IAukey058_IprxKmBagbBIgQxCGnZ6vJjt14q34HKJBu0UBBh012HJPzWMUR4p83-04H4vx-A6pB_AC0xIdd5f-8U94IEr7zybFBg7QQK7Nuf9kO8a3_8BEW5GyFccfOKlS0ftOc53FvAwBEjPVq73eTvMwXvw5qgaP3g022PJKvBowzurJmY6u14_tB4CVbBGrBU6Ssj7Mw-so43J7Ejrh7P_Spw4_hMP',
    overshirt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaLuC-_FSb0k5AHIrN5D_fmiQl0TKN1mlpbxeEsHyYuJpuC32XXT3TMf278uXZIVhw0zyq7EMXsvMzeHRR-eEptlI9JZrAyn0Z6IZXx4P9FBQdBUxnjcPA6Ozp1dBND4gleSybB1FkXqP5663zcIIyhvHHLjpW7XNvoqg5WyyW-T7TPGiqOIoj4ZIcLBDiCsHn-ii_73CBb0TjWBGeG9v81uKXeqYuNSdjxGhWiUJgkpeHHJ00FF6a',
    candle: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlFtqZr1yH141IkW49dNyOof0mueTpizc4NP_9MEwKep7Sv6T6PnMvwaK59N_ICbGtQlh-LKEOgGplX9GXHLChpuZ_FsVmZ7cdmhT8TCjVRfFpVEcA0wYuSN5GwI0VKKFcxkiskGIThR0Dkko1ahv9ct8G5X3BC6ZeTVRyhdnwfHXx7WQ_cTJ6hfznb09Fjb62XB6TXDMtYAUI_letU4ot28v_Ig-xJ2fO7zJVTPJ1WQLlhjJ-CA7e',
};

export const CATEGORIES = [
    { name: "Men's Fashion", slug: 'mens-fashion' },
    { name: "Women's Fashion", slug: 'womens-fashion' },
    { name: 'Footwear', slug: 'footwear' },
    { name: 'Watches', slug: 'watches' },
    { name: 'Bags', slug: 'bags' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Home & Living', slug: 'home-living' },
    { name: 'Beauty & Care', slug: 'beauty-care' },
];

export const VENDORS = [
    { name: 'Minimog Studio', count: 28 },
    { name: 'Nordic Craft', count: 12 },
    { name: 'Aethel Goods', count: 6 },
    { name: 'UrbanCarry Co.', count: 9 },
    { name: 'Solstice Optical', count: 8 },
];

export const PRODUCTS = [
    {
        id: 'p1', slug: 'urban-waterproof-backpack', title: 'Urban Waterproof Backpack',
        vendor: 'Minimog Studio', category: 'Bags', price: 59, compareAtPrice: 79,
        image: IMG.backpack, rating: 5, reviewCount: 128,
        badge: { label: 'Sale -25%', variant: 'sale' },
        colors: ['Obsidian', 'Sand'], sizes: ['One Size'], inStock: true,
    },
    {
        id: 'p2', slug: 'minimal-white-sneakers', title: 'Minimal Sand Low Sneakers',
        vendor: 'Nordic Craft', category: 'Footwear', price: 79,
        image: IMG.sneakers, rating: 4.5, reviewCount: 96,
        badge: { label: 'Bestseller', variant: 'primary' },
        colors: ['Clean White', 'Sand', 'Charcoal'], sizes: ['7', '8', '9', '10', '11'], inStock: true,
    },
    {
        id: 'p3', slug: 'classic-chronograph-watch', title: 'Classic Chronograph Watch',
        vendor: 'Aethel Goods', category: 'Watches', price: 129,
        image: IMG.watch, rating: 4, reviewCount: 64,
        badge: { label: 'New', variant: 'primary' },
        colors: ['Caramel'], sizes: ['40mm'], inStock: true,
    },
    {
        id: 'p4', slug: 'polarized-tortoise-shades', title: 'Polarized Tortoise Shades',
        vendor: 'Solstice Optical', category: 'Accessories', price: 49,
        image: IMG.sunglasses, rating: 4.5, reviewCount: 82,
        colors: ['Tortoise'], sizes: ['One Size'], inStock: true,
    },
    {
        id: 'p5', slug: 'everyday-insulated-flask', title: 'Everyday Insulated Flask 750ml',
        vendor: 'Minimog Studio', category: 'Accessories', price: 34,
        image: IMG.flask, rating: 5, reviewCount: 142,
        badge: { label: 'Bestseller', variant: 'primary' },
        colors: ['Olive'], sizes: ['750ml'], inStock: true,
    },
    {
        id: 'p6', slug: 'minimal-sand-carry-tote', title: 'Minimal Sand Carry Tote',
        vendor: 'UrbanCarry Co.', category: 'Bags', price: 115, compareAtPrice: 130,
        image: IMG.tote, rating: 4, reviewCount: 51,
        colors: ['Sand'], sizes: ['One Size'], inStock: true,
    },
    {
        id: 'p7', slug: 'tactile-utility-overshirt', title: 'Tactile Utility Overshirt',
        vendor: 'Minimog Studio', category: "Men's Fashion", price: 88,
        image: IMG.overshirt, rating: 4.5, reviewCount: 78,
        colors: ['Olive'], sizes: ['S', 'M', 'L', 'XL'], inStock: true,
    },
    {
        id: 'p8', slug: 'sandalwood-amber-candle', title: 'Sandalwood Amber Candle',
        vendor: 'Aethel Goods', category: 'Home & Living', price: 28, compareAtPrice: 35,
        image: IMG.candle, rating: 5, reviewCount: 110,
        badge: { label: 'Sale -15%', variant: 'sale' },
        colors: ['Amber'], sizes: ['8oz'], inStock: true,
    },
];

/* Product detail extra fields — richer shape for PDP */
export const PRODUCT_DETAIL = {
    ...PRODUCTS[1],
    sku: 'MM-FTW-082',
    description:
        'Engineered with uncompromising precision in Porto, Portugal, our Minimalist White Sneaker pairs architectural Scandinavian clarity with bespoke footwear comfort. Each pair undergoes a 72-step assembly process utilizing hand-stitched welt boundaries, breathable organic cotton lining, and a reinforced heel counter.',
    highlights: [
        { icon: 'verified', title: 'Italian Leather', sub: 'Grade-A full grain calfskin' },
        { icon: 'sentiment_very_satisfied', title: 'All-Day Insole', sub: 'Dual-density memory foam' },
        { icon: 'recycling', title: 'Circular Sole', sub: 'Vulcanized 40% recycled gum' },
    ],
    gallery: [IMG.sneakers, IMG.sneakers, IMG.sneakers, IMG.sneakers],
    colorOptions: [
        { name: 'Clean White', hex: '#FFFFFF' },
        { name: 'Natural Sand', hex: '#E5DCCB' },
        { name: 'Charcoal Grey', hex: '#3B3E3D' },
    ],
    sizeOptions: [
        { label: '7', available: true },
        { label: '8', available: true },
        { label: '8.5', available: true },
        { label: '9', available: true },
        { label: '9.5', available: true },
        { label: '10', available: true },
        { label: '10.5', available: false },
        { label: '11', available: true },
    ],
    lowStock: { size: '9.5', remaining: 4, window: '02h 44m' },
};

export const BUNDLE_ITEMS = [
    { id: 'b1', title: 'Combed Socks (3pk)', price: 22, image: IMG.tote, checked: true },
    { id: 'b2', title: 'Shoe Care Kit', price: 18, image: IMG.candle, checked: true },
];

export const CART_ITEMS = [
    {
        id: 'c1', productId: 'p2', vendor: 'Minimog Studio',
        title: 'Minimal White Sneakers', category: 'Footwear',
        image: IMG.sneakers, price: 79, qty: 1,
        variant: { Size: '10 US', Color: 'Clean White' },
        inStock: true, badge: { label: 'New', variant: 'primary' },
    },
    {
        id: 'c2', productId: 'p1', vendor: 'Minimog Studio',
        title: 'Urban Daily Backpack', category: 'Accessories',
        image: IMG.backpack, price: 59, compareAtPrice: 79, qty: 1,
        variant: { Color: 'Matte Black', Waterproof: 'Yes' },
        inStock: true, badge: { label: 'SALE -25%', variant: 'sale' },
    },
];

/* ── Helpers ────────────────────────────────────────────── */

export const money = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export const initialsOf = initials;