// ─── Images ──────────────────────────────────────────────
// Placeholder URLs from the original design. Replace with real
// product/vendor assets from the API in Phase 3/4.
const IMG = {
    heroCollage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBngXLOK0DSkmhiZPg7R6Ph2t0OSt_RXhTz3xgyp1Egd6GO9JKlWfPSVsxTeWuOvOhVoV01rMcHN1FfHrtEyMw2ezTT80WY34m_8rWqLWTE8N10MDxGYc_xoyqNsYi7YatO3o1RknwnB4r3DSraS_6S6jeKQJIRcDtSy9dEGhccWrY6jd2QXJmvxZZH_KonnaLWlPmrDBvVCtGuPQGDGZUx6tFmHfZQcb7rq8Y0yL9RaSbIPRQx7JLw',
    catMens:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Mv2GljHy9wscvhPPJNHsN_c0SRyziQrOyK-sBBO1tc2CoMIGcLJCyWMKXKFCh87mw-uOGNT5eTYPU6wgQQiZa0Eao42p2sJYRVdnp3fooKXShzw4ANp3mf6fEYY1yyR4db_Og2roigJl1juIjKGjaAFUGd2BfqCvoQima3ycgTme0LE3AxsEjrkNlbXKbYBFJiKPVIrod39ZnEP6Xa_QfuwWMNxwao80PyOIQF7LNQRWBA_c1161',
    catWomens:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAXQU6D92WCm_y3OJuGxwmIkPU5CePH-JkTvOnqnWwAI8whsUtyUFN7MQoyQwd5QQdR0kwXxT2Ke5XHHB2Lee9ZiWWdpLTc-vesAJEOtT5_BlfEiyxWgUYtGwTb8GlK-LG5Jm-O3teR58Zk-45d1MK5R8SrWLdk46Rpt3YkRrnD1u5rM3ULbwW_5gIYVgx7Jn5DllO50Nuk4KNz1e_m1bnzy57WJBq3JxhrZgbTNTX6xfHWKx6Dxtex',
    catFootwear:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB0NOgeWCD9cNw_oj6b9CCWP0Jd-MnI0NyxdCUKjnwhNDzojKwdPrPKJ5yLjKjQGG_KHpg_lS4qdZCYB7A0nizz85c3cfjCrPaKdhQxB2jW1eHbQlTju5ZBnXvDxpZIMpm70_rPoi9p-GKYrkgQukYX0xhcUkxI_AjKAWMrhSNgCYKkJ2gQZAkVtVMZgcjKZHqOFCq6OoWGvV_A0VhrQUF9QmDuvSYf15NKDgoix31KQf6lrwrplFY8',
    catWatches:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBWxhEqokKe7qe_dmhoP8kAFAzP0lomfmMIi3joBTtwbejjiTNqOi6xPoIi_GC4p1dmGkhHI-hOQZBJFAvKtDT-5h7CrZ_CHi-Br95hetCIs_jTyqqjWcRud-MDQNZiAKko5DAvcwvV3h_bOB6X-sXWP4iWyAMb6FmUdeGJIuYe0ZgT6y0Kuppm_u0nFHB7FuCU-am_BOHLe5Tw4mniampnB5v4Eh2H0kPzws1zij55rDSFcMzJDiLW',
    catBags:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCuGD8B9CwNyBSUmDZhRduxQLGEkPIVaZiWubzGAO4ap0trqGUwajc1HfdGnj6bM34Ebx2Kkr0EaXdjbZBtcxJlCeSYaG0WtjH05iIxrjxJFxTIpbFAXqsaXp4rI7sN8d3KCO_vwSGBJIDVUyz1IBjjLbiJBKZfw4RscYMoE9sEYLveB2y7fMBFF9Cx1ZVJPMZtdZYLQWvdcl_11FLFSaSoVcTrr3d7OpMn7kmdwCn8HBdg1Rw5BIdU',
    catAccessories:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAhAQ04qebFKfGfqZfRB_fYiDR_hKzGv5uWhYtNIgdMRbCFcrILvndaLMbqFndqh0KykNA5LsBT-eSHL8XNvtiZywQ7_tEID3HgGmmuQvs_nKYDSOv9LC8UMvau5LopjfIfRvmz4Qdh4bVoFr4-dvlveSLrRX-iQsnw5mQ9lF3RF0nEiYPtEwSp6I1bU6nLaSFYrCVC2sT0HGXcIHv8khtRX5-2J94t_AxqmkmV_63SFF7yGXHElQvl',
    catHome:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCJr7KQIqTRMlmVU7se8EQmF9oR-xlI_TtGER9MsyoDWhtH6MsccTo9V1EEBInjCUt9iUZN_fSaxzgOgqan8l_bvEN--Vxyy_lg759X0Jh6LoOLLlvBv5Iig0pWhxuH-ZxauX--bgCqtBmY5m8exFzryaCDvoTdFnpEKusjc7kgu4phw7CSebnV6E2y4VlRTQ354K6e19ClpxHQE-AIXN96pscmUBN9ccODktOrvZsbaJOCDMP76gia',
    catBeauty:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD_HygNv6-YgFEDniKuoJD6rGcIL3vdbGhXOLFJ_9TvjqQtLw5Kem7ede-RTPbLw5WpPR9HHmSvVFM1FOkNTObLW-WhNXR9TQHvZtY2h06QpredJg6UyjaSpyJLoHkMFif5o_rroZcDx1Eoqin09NHhqFQD6aZoTyXV2Q4PWWNFtIMgraJ5K6_ZC7MkG-2ofxpiv545n4zeupgHLjB-knFOYfkB6oHA4OwVwWgHJ3_Cue4zsjHU6pQy',

    promo1:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBJBU1Oqmq1wLJRm6N0eVVTPD_ACVhMJkyvzMCr3hiAPodfHP43Wk5VS86I1R9ELr7W4eSpmHeEMXIUCPHYmDMYHcUaRS4se5kcWyfNf97k5ZpP4fV26K1sZa8RNy7W6Ughcwidij7-OlPAfKpWUnIkyPwsDJr7v8WAiOzNQEv1PaAwQZoCDvEE4gCVtD_7_oZuhdLzcyYAAmrcTFb1Dw-OM1oEtwUKX1qA6Mv4i-vMTsUWjqVEmd7w',
    promo2:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDNh24_YRjzSJSUvapO7MR343Km2F7sOQkQki27wmyg5JLvEYJ2jnQDa3CSkzL8dDJb1KEKAFsq62Xxir8L5lDJrZXKG9v4-iHfjDkvVrtTfroB8c_9JVA85U2NXXPhqAJwpbJ0WMGFptkOKs-V2WVz0du8V_52oFmVZFXngp2DJrTNQcgYAFnopxXI9adkoFrmQ6jwomkntVJMSmX2Vm_w4keFdFxysHwMLkf5vkeTc2UWNxY8QDOD',

    pBackpack:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC_G0xxs_ac8abSihvniUFLw12z8y8aqBgZ6WARtCb9x8X-7iuEqol3FVruSFJ82WrK9m-U0oObAQI6rXPSNekbAC1ST606drewscn18sEtrhcXD_oKOzxMxujzD3eaX6y51fz3eDd_GBE87RfZXQUESybFVFTDaSE2ytJztgqtZ3VAl3NqWIAKp1L62WZn_2RBhjhor1EC4qjtmITD0PqVS7T30U-VwHDtBQAlzCELneZT8dNTMsU3',
    pSneakers:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA5VvoJh2eN6gadTHGpJ-TYUReuVvIvKBfh4-0hnJiZzMkbxrIcl4h0A4DeYzAYr1RQ7Zehckhg_eg0B4E1QYDixQpYhVdeLSSe8Jrd8gSaejHCQVlgk1kOCfBs7TLo0ROOVkK31DAkx1SEoG-OvhREPFsrdDt9CxpnpDseEJ5o2oGHXHW6vi1kdHse3Jsr8WGo8EbK8nmV_lw_9hHhAMhSZtCIgt-UU-_hWYTixAPxhEg5rhfK17NE',
    pWatch:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCtXOyDjRYLT_LN3eAAzoCfwu2lECIcgYXDHAXJd2y6gndxyEwUm6IZIxJrDLzOK8wMCk5DY5qntGUr6huZeOEriwHy51jMts26MJomzkbRpfryKDeSr3LAmsBKarp4I8Jm9HHdj-WolsabHa_G14T5xj-_xJL9yqrQUBZUgoG7t63thxed4Dbq-8OEDU3LRWW-MYntz_fv2EswyGaSlVu_DJghxC_jQQEJp-qXy_shx-tGTrmHirms',
    pSunglasses:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBo-GI1-KryUxWpkPbvALUsZHIFrXsQk55IGXw81XDQ45jupR-6J6bB0DxsEi6B3YIOvO1FpEKetFmAuefQthjUkYXS6BUnWPdB74gl9MWqf6mFe0pIC5AOg8Q5Y_MT1RXW0kcOuEUwRMc7I3aGWyO5yHBLJSumyOixbusRgwCsP2vkEA972lEoVAcGEPpQb0yFhfJuR_jMBtD_svICvg-5K4UtKuyycyMa9A1fdfWOibC0AtFspE8b',
    pSerum:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1Vr275EiWvjME4NGdOMFR81La-VmnSQUVuZVMJ8FjQNelCO_LLJrKJLhIwL2FF_ABCFHogZ5973YV9kp3Q2eL0gpJenUwenJRLo_lX1Ka049CB2bHpjFdaus6VM2QyDH_gZLTnyUKwtN0bL02OlzqtRdUJi3hVY8nPSPTQ9POUh-1R2QYKLVu9pJul41douamjYTeukInPBxICMqcsbDwyn6fViQKBE6xlyOfE167I_aC8PCma0EE',
};

// ─── Top bar USP strip ───────────────────────────────────
export const topBarItems = [
    { icon: 'local_shipping', text: 'FREE SHIPPING ON ORDERS OVER $50' },
    { icon: 'verified',       text: '30-DAY MONEY BACK GUARANTEE' },
];

// ─── Categories ──────────────────────────────────────────
// `slug` maps to /category/:slug — will come from the API in Phase 3
export const categories = [
    { name: "Men's Fashion",   slug: 'mens-fashion',   image: IMG.catMens },
    { name: "Women's Fashion", slug: 'womens-fashion', image: IMG.catWomens },
    { name: 'Footwear',        slug: 'footwear',       image: IMG.catFootwear },
    { name: 'Watches',         slug: 'watches',        image: IMG.catWatches },
    { name: 'Bags',            slug: 'bags',           image: IMG.catBags },
    { name: 'Accessories',     slug: 'accessories',    image: IMG.catAccessories },
    { name: 'Home & Living',   slug: 'home-living',    image: IMG.catHome },
    { name: 'Beauty & Care',   slug: 'beauty-care',    image: IMG.catBeauty },
];

// ─── Hero micro-USPs ─────────────────────────────────────
export const heroUSPs = [
    { icon: 'local_shipping', title: 'Free Shipping',    sub: 'On orders over $50'  },
    { icon: 'cached',         title: 'Easy Returns',     sub: '30-day return policy' },
    { icon: 'lock',           title: 'Secure Payment',   sub: '100% secure checkout' },
    { icon: 'headset_mic',    title: '24/7 Support',     sub: 'Dedicated support'    },
];

// ─── Hero image ──────────────────────────────────────────
export const heroImage = {
    src: IMG.heroCollage,
    alt: 'Modern lifestyle product arrangement on a warm cream podium',
};

// ─── Promo banner ────────────────────────────────────────
export const promoBanner = {
    badge: 'Limited Time Offer',
    title: 'Spring Sale Is Live!',
    subtitle: 'Get up to 30% off on selected seasonal items and bestsellers.',
    cta: { label: 'Shop the Sale', to: '/search?tag=sale' },
    /** Countdown duration in seconds from page load */
    countdownSeconds: 2 * 24 * 3600 + 14 * 3600 + 36 * 60 + 45,
    images: [
        { src: IMG.promo1, alt: 'Stacked knit sweaters and cream sneakers' },
        { src: IMG.promo2, alt: 'Editorial lookbook portrait' },
    ],
};

// ─── Trending products (mock — replaces with API in Phase 3) ─
export const trendingProducts = [
    {
        id: 'p1',
        slug: 'urban-backpack',
        title: 'Urban Backpack',
        price: 59.0,
        compareAtPrice: 79.0,
        image: IMG.pBackpack,
        imageAlt: 'Matte black urban commuter backpack',
        rating: 4.8,
        reviewCount: 128,
        badge: { label: 'Sale', variant: 'primary' },
    },
    {
        id: 'p2',
        slug: 'minimal-white-sneakers',
        title: 'Minimal White Sneakers',
        price: 79.0,
        image: IMG.pSneakers,
        imageAlt: 'Clean minimal white leather sneakers',
        rating: 4.9,
        reviewCount: 96,
    },
    {
        id: 'p3',
        slug: 'classic-brown-watch',
        title: 'Classic Brown Watch',
        price: 129.0,
        image: IMG.pWatch,
        imageAlt: 'Analog wrist watch with brown leather strap',
        rating: 4.7,
        reviewCount: 64,
        badge: { label: 'New', variant: 'outline' },
    },
    {
        id: 'p4',
        slug: 'polarized-sunglasses',
        title: 'Polarized Sunglasses',
        price: 49.0,
        image: IMG.pSunglasses,
        imageAlt: 'Dark tortoiseshell frame unisex sunglasses',
        rating: 4.6,
        reviewCount: 82,
    },
    {
        id: 'p5',
        slug: 'hydrating-face-serum',
        title: 'Hydrating Face Serum',
        price: 24.0,
        compareAtPrice: 34.0,
        image: IMG.pSerum,
        imageAlt: 'Amber glass dropper bottle with hydrating face serum',
        rating: 4.8,
        reviewCount: 45,
        badge: { label: 'Sale', variant: 'primary' },
    },
];

// ─── Trust bar ───────────────────────────────────────────
export const trustItems = [
    { icon: 'star',          title: '4.9/5 Average Rating',    sub: 'From 10,000+ Reviews' },
    { icon: 'local_shipping',title: 'Fast & Free Shipping',    sub: 'On orders over $50'   },
    { icon: 'restore',       title: '30-Day Money Back',       sub: 'No questions asked'   },
    { icon: 'verified_user', title: 'Secure & Safe Checkout',  sub: 'Your data is protected' },
];

// ─── Footer ──────────────────────────────────────────────
export const footerColumns = [
    {
        heading: 'Shop',
        links: [
            { label: 'All Products',  to: '/search' },
            { label: 'Best Sellers',  to: '/search?sort=best' },
            { label: 'New Arrivals',  to: '/search?sort=new' },
            { label: 'Sale Items',    to: '/search?tag=sale' },
            { label: 'Gift Cards',    to: '/gift-cards' },
        ],
    },
    {
        heading: 'Collections',
        links: [
            { label: "Men's Fashion",   to: '/category/mens-fashion' },
            { label: "Women's Fashion", to: '/category/womens-fashion' },
            { label: 'Footwear',        to: '/category/footwear' },
            { label: 'Watches',         to: '/category/watches' },
            { label: 'Accessories',     to: '/category/accessories' },
            { label: 'Home & Living',   to: '/category/home-living' },
        ],
    },
    {
        heading: 'Customer Service',
        links: [
            { label: 'Contact Us',       to: '/contact' },
            { label: 'FAQs',             to: '/faqs' },
            { label: 'Shipping Policy',  to: '/shipping-policy' },
            { label: 'Return Policy',    to: '/return-policy' },
            { label: 'Track Your Order', to: '/account/orders' },
            { label: 'Vendor Login',     to: '/login' },
        ],
    },
    {
        heading: 'Company',
        links: [
            { label: 'About Us',         to: '/about' },
            { label: 'Our Blog',         to: '/blog' },
            { label: 'Careers',          to: '/careers' },
            { label: 'Privacy Policy',   to: '/privacy' },
            { label: 'Terms of Service', to: '/terms' },
        ],
    },
];

export const paymentBadges = ['VISA', 'MASTERCARD', 'AMEX', 'PAYPAL', 'APPLE PAY', 'SHOP PAY'];