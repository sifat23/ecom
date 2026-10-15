import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import CatalogProductCard from '../../../components/product/CatalogProductCard';
import {
    PRODUCT_DETAIL,
    BUNDLE_ITEMS,
    PRODUCTS,
    money,
} from '../../../data/catalogMock';

/* ── Small pieces ─────────────────────────────────────────── */

function Stars({ rating, size = 18 }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
        <div className="flex items-center text-tertiary-fixed-dim">
            {[0,1,2,3,4].map((i) => (
                <Icon
                    key={i}
                    name={i < full ? 'star' : i === full && half ? 'star_half' : 'star'}
                    size={size}
                    filled={i < full}
                />
            ))}
        </div>
    );
}

function Accordion({ title, icon, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-outline-variant/40 last:border-0">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full px-space-md py-4 flex items-center justify-between text-left font-headline-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
            >
                <span className="flex items-center gap-2">
                    <Icon name={icon} size={20} className="text-primary" />
                    <span>{title}</span>
                </span>
                <Icon name="expand_more" size={20} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="px-space-md pb-4 pt-1 text-on-surface-variant text-body-md leading-relaxed">
                    {children}
                </div>
            )}
        </div>
    );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function ProductDetailPage() {
    const { slug } = useParams();
    const product = PRODUCT_DETAIL;   // swap for `useGetProductQuery(slug)` later

    const [activeImg, setActiveImg] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colorOptions[0]);
    const [selectedSize, setSelectedSize] = useState('9.5');
    const [qty, setQty] = useState(1);
    const [wishlisted, setWishlisted] = useState(false);
    const [bundleChecks, setBundleChecks] = useState(
        Object.fromEntries(BUNDLE_ITEMS.map((b) => [b.id, b.checked]))
    );

    const related = PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4);
    const bundleTotal = BUNDLE_ITEMS.reduce(
        (sum, b) => sum + (bundleChecks[b.id] ? b.price : 0),
        product.price
    );
    const bundleSavings = bundleTotal * 0.15;
    const bundleFinal = bundleTotal - bundleSavings;

    return (
        <div className="flex flex-col w-full">

            {/* ── Breadcrumb bar ───────────────────────── */}
            <section className="w-full bg-surface-container-low/60 py-space-sm px-margin-mobile md:px-margin-tablet lg:px-margin">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-label-md">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs">
                        <Link to="/" className="hover:text-primary">Home</Link>
                        <Icon name="chevron_right" size={14} />
                        <Link to={`/category/footwear`} className="hover:text-primary">{product.category}</Link>
                        <Icon name="chevron_right" size={14} />
                        <span className="text-on-surface font-semibold">{product.title}</span>
                    </nav>
                    <div className="hidden sm:flex items-center gap-space-md font-body-sm">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                            In stock, ready to dispatch
                        </span>
                        <span>Item ID: <strong className="text-on-surface font-semibold">{product.sku}</strong></span>
                    </div>
                </div>
            </section>

            {/* ── Split panel ───────────────────────────── */}
            <section className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">

                    {/* Gallery */}
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-space-md lg:sticky lg:top-32">
                        <div className="flex md:flex-col gap-space-sm overflow-x-auto shrink-0 md:w-20 lg:w-24">
                            {product.gallery.map((src, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveImg(i)}
                                    className={`rounded-lg overflow-hidden bg-surface-container aspect-square w-16 md:w-full p-1 transition-all ${
                                        activeImg === i
                                            ? 'ring-2 ring-primary bg-surface-container-high'
                                            : 'hover:bg-surface-container-high'
                                    }`}
                                >
                                    <img src={src} alt={`View ${i + 1}`} className="w-full h-full object-cover rounded-md" />
                                </button>
                            ))}
                        </div>

                        <div className="relative flex-1 rounded-xl bg-surface-container-low overflow-hidden shadow-sm group">
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                <span className="px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-sm uppercase shadow-sm">
                                    Save 28%
                                </span>
                                <span className="px-2.5 py-1 rounded bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm uppercase font-bold shadow-sm">
                                    Curated Essential
                                </span>
                            </div>
                            <button
                                type="button"
                                aria-label="Zoom"
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur text-on-surface-variant hover:text-on-surface flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                            >
                                <Icon name="zoom_in" size={20} />
                            </button>

                            <div className="w-full aspect-square flex items-center justify-center p-space-md overflow-hidden">
                                <img
                                    src={product.gallery[activeImg]}
                                    alt={product.title}
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/80 backdrop-blur-md rounded-lg p-2.5 flex items-center justify-between text-label-md">
                                <span className="flex items-center gap-2">
                                    <Icon name="eco" size={18} className="text-primary" />
                                    <span>100% Carbon Neutral Certified Delivery</span>
                                </span>
                                <span className="text-on-surface-variant text-[11px]">Handcrafted in Portugal</span>
                            </div>
                        </div>
                    </div>

                    {/* Purchase panel */}
                    <div className="lg:col-span-5 flex flex-col gap-space-md">
                        <div className="flex flex-col gap-space-xs">
                            <div className="flex items-center justify-between">
                                <Link
                                    to={`/vendors/${product.vendor.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="font-label-sm tracking-widest uppercase font-bold text-primary hover:underline"
                                >
                                    {product.vendor}
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setWishlisted((v) => !v)}
                                    className={`flex items-center gap-1 font-label-sm transition-colors ${wishlisted ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
                                >
                                    <Icon name={wishlisted ? 'favorite' : 'favorite_border'} size={18} filled={wishlisted} />
                                    <span>{wishlisted ? 'Saved' : 'Save'}</span>
                                </button>
                            </div>
                            <h1 className="text-headline-lg font-bold tracking-tight">{product.title}</h1>

                            <div className="flex items-center gap-space-sm pt-1 flex-wrap">
                                <Stars rating={product.rating} />
                                <a href="#reviews" className="font-label-md font-bold text-on-surface hover:underline">
                                    {product.rating.toFixed(1)}{' '}
                                    <span className="text-on-surface-variant font-normal">({product.reviewCount} verified reviews)</span>
                                </a>
                                <span className="text-outline-variant">•</span>
                                <span className="font-body-sm text-on-surface-variant">SKU: {product.sku}</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-space-sm py-2 flex-wrap">
                            <span className="text-[34px] leading-none font-bold text-primary">{money(product.price)}</span>
                            {product.compareAtPrice && (
                                <>
                                    <span className="text-price-strike text-outline line-through text-[18px]">
                                        {money(product.compareAtPrice)}
                                    </span>
                                    <span className="font-label-sm font-bold text-secondary px-2 py-0.5 rounded bg-error-container text-on-error-container">
                                        SAVE {money(product.compareAtPrice - product.price)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Urgency */}
                        {product.lowStock && (
                            <div className="bg-secondary-container/15 rounded-lg p-3 flex items-center gap-space-sm">
                                <Icon name="local_fire_department" size={22} className="text-secondary animate-pulse" />
                                <div className="flex flex-col">
                                    <span className="font-label-md font-bold text-secondary">Low Stock Alert</span>
                                    <span className="font-body-sm text-on-surface-variant">
                                        Only {product.lowStock.remaining} pairs remaining in size {product.lowStock.size}. Order within{' '}
                                        <strong className="text-on-surface">{product.lowStock.window}</strong> for same-day packing.
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Color */}
                        <div className="flex flex-col gap-space-xs pt-1">
                            <div className="flex items-center justify-between">
                                <label className="font-label-md text-on-surface">
                                    Color: <span className="font-bold text-primary">{selectedColor.name}</span>
                                </label>
                                <span className="font-body-sm text-on-surface-variant">{product.colorOptions.length} Shades</span>
                            </div>
                            <div className="flex items-center gap-space-sm">
                                {product.colorOptions.map((c) => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        onClick={() => setSelectedColor(c)}
                                        aria-label={c.name}
                                        className={`w-10 h-10 rounded-full p-0.5 shadow-sm transition-all flex items-center justify-center ${
                                            selectedColor.name === c.name
                                                ? 'ring-2 ring-primary'
                                                : 'ring-1 ring-outline-variant hover:ring-primary'
                                        }`}
                                    >
                                        <span
                                            className={`w-full h-full rounded-full ${
                                                c.name === 'Clean White' ? 'border border-outline-variant' : ''
                                            }`}
                                            style={{ background: c.hex }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size */}
                        <div className="flex flex-col gap-space-xs pt-1">
                            <div className="flex items-center justify-between">
                                <label className="font-label-md text-on-surface">
                                    Size (US Men): <span className="font-bold text-primary">{selectedSize}</span>
                                </label>
                                <button type="button" className="flex items-center gap-1 font-label-sm text-primary font-bold hover:underline">
                                    <Icon name="straighten" size={16} />
                                    <span>Size Guide</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                {product.sizeOptions.map((s) => (
                                    <button
                                        key={s.label}
                                        type="button"
                                        disabled={!s.available}
                                        onClick={() => setSelectedSize(s.label)}
                                        className={`h-11 rounded-lg font-label-md flex items-center justify-center transition-colors shadow-sm ${
                                            !s.available
                                                ? 'bg-surface-container-lowest text-on-surface-variant opacity-50 cursor-not-allowed'
                                                : selectedSize === s.label
                                                    ? 'bg-primary text-on-primary font-bold ring-2 ring-primary'
                                                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                                        }`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Qty + Add to cart */}
                        <div className="flex flex-col gap-space-sm pt-2">
                            <div className="flex items-center gap-space-sm">
                                <div className="flex items-center bg-surface-container-lowest rounded-lg shadow-sm h-12 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                                        className="w-10 h-full flex items-center justify-center rounded-md hover:bg-surface-container transition-colors"
                                    >
                                        <Icon name="remove" size={18} />
                                    </button>
                                    <span className="w-10 text-center font-label-lg font-bold">{qty}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQty((q) => q + 1)}
                                        className="w-10 h-full flex items-center justify-center rounded-md hover:bg-surface-container transition-colors"
                                    >
                                        <Icon name="add" size={18} />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="flex-1 h-12 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg tracking-wide uppercase font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] transition-all"
                                >
                                    <Icon name="shopping_bag" size={20} />
                                    <span>Add to Cart • {money(product.price * qty)}</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                className="w-full h-12 rounded-lg bg-[#5A31F4] hover:bg-[#4922dc] text-white font-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                            >
                                <span>Buy with</span>
                                <span className="tracking-wider uppercase font-black text-[15px] bg-white text-[#5A31F4] px-1.5 py-0.5 rounded leading-none">Shop</span>
                                <span className="font-normal text-[15px]">Pay</span>
                            </button>
                        </div>

                        {/* Highlights */}
                        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs mt-1">
                            <span className="font-label-sm tracking-wider uppercase font-bold text-on-surface-variant">
                                Signature Craftsmanship
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-2">
                                {product.highlights.map((h) => (
                                    <div key={h.title} className="flex items-start gap-2">
                                        <Icon name={h.icon} size={20} className="text-primary mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="font-label-md font-bold text-on-surface">{h.title}</span>
                                            <span className="font-body-sm text-on-surface-variant">{h.sub}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Accordions */}
                        <div className="flex flex-col rounded-xl overflow-hidden shadow-sm bg-surface-container-lowest mt-2">
                            <Accordion title="Description & Construction" icon="info" defaultOpen>
                                {product.description}
                            </Accordion>
                            <Accordion title="Materials & Sustainability Care" icon="science">
                                <ul className="list-disc pl-5 flex flex-col gap-1.5 text-body-sm">
                                    <li><strong>Upper:</strong> 100% Top-grain Italian nappa calf leather (LWG Gold certified).</li>
                                    <li><strong>Lining:</strong> Vegetable-tanned micro-perforated calfskin.</li>
                                    <li><strong>Outsole:</strong> Margom-style Italian rubber vulcanized at 140°C.</li>
                                    <li><strong>Care:</strong> Wipe clean with a damp microfiber cloth.</li>
                                </ul>
                            </Accordion>
                            <Accordion title="Complimentary Shipping & 30-Day Returns" icon="local_shipping">
                                Enjoy complimentary tracked courier shipping across the contiguous United States.
                                If the fit isn't immaculate, exchange or return within 30 days for a full refund.
                            </Accordion>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Bundle ────────────────────────────────── */}
            <section className="w-full bg-surface-container-low/50 py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
                        <div>
                            <span className="font-label-sm uppercase tracking-widest text-primary font-bold">Curated Ensemble</span>
                            <h2 className="text-headline-lg font-bold">Frequently Bought Together</h2>
                        </div>
                        <span className="font-body-sm text-on-surface-variant">Save an extra 15% at checkout</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-center bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm">
                        <div className="lg:col-span-8 flex flex-col md:flex-row items-center gap-space-md">
                            <div className="flex items-center gap-space-sm w-full md:w-1/3">
                                <div className="w-20 h-20 rounded-xl bg-surface-container p-1 overflow-hidden shrink-0">
                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-sm font-bold text-primary">This Item</span>
                                    <span className="font-label-md font-bold text-on-surface truncate">{product.title}</span>
                                    <span className="text-price-lg font-bold">{money(product.price)}</span>
                                </div>
                            </div>
                            <Icon name="add" size={24} className="text-outline-variant hidden md:block" />

                            {BUNDLE_ITEMS.map((b) => (
                                <div key={b.id} className="flex items-center gap-space-sm w-full md:w-1/3">
                                    <div className="w-20 h-20 rounded-xl bg-surface-container p-1 overflow-hidden shrink-0">
                                        <img src={b.image} alt={b.title} className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={bundleChecks[b.id]}
                                                onChange={(e) => setBundleChecks((prev) => ({ ...prev, [b.id]: e.target.checked }))}
                                                className="w-4 h-4 rounded text-primary focus:ring-primary"
                                            />
                                            <span className="font-label-md font-bold text-on-surface">{b.title}</span>
                                        </label>
                                        <span className="text-price-lg font-bold">{money(b.price)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-space-xs bg-surface-container-low rounded-xl p-space-md">
                            <div className="flex items-baseline justify-between">
                                <span className="font-label-md text-on-surface-variant font-semibold">Total Bundle:</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="line-through text-outline text-price-strike">{money(bundleTotal)}</span>
                                    <span className="text-headline-md font-bold text-primary">{money(bundleFinal)}</span>
                                </div>
                            </div>
                            <span className="font-label-sm text-secondary font-bold text-right">
                                You save {money(bundleSavings)} with trio discount
                            </span>
                            <button
                                type="button"
                                className="w-full mt-2 h-11 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                            >
                                <Icon name="add_shopping_cart" size={18} />
                                Add All to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Reviews ───────────────────────────────── */}
            <section id="reviews" className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
                    <div className="bg-surface-container-lowest rounded-2xl p-space-lg md:p-space-xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
                        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-1">
                            <span className="text-[56px] leading-none font-extrabold text-primary">
                                {product.rating.toFixed(1)}
                            </span>
                            <Stars rating={product.rating} size={24} />
                            <span className="font-label-lg font-bold">
                                Based on {product.reviewCount} verified purchases
                            </span>
                            <span className="font-body-sm text-on-surface-variant">
                                98% of customers recommend this pair
                            </span>
                            <button
                                type="button"
                                className="mt-space-sm px-5 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest font-label-md font-bold transition-colors"
                            >
                                Write a Review
                            </button>
                        </div>
                        <div className="md:col-span-8 flex flex-col gap-2.5">
                            {[
                                { stars: 5, pct: 88 },
                                { stars: 4, pct: 9 },
                                { stars: 3, pct: 2 },
                                { stars: 2, pct: 1 },
                                { stars: 1, pct: 0 },
                            ].map(({ stars, pct }) => (
                                <div key={stars} className="flex items-center gap-space-sm font-label-sm">
                                    <span className="w-12 text-right">{stars} Star{stars > 1 ? 's' : ''}</span>
                                    <div className="flex-1 h-3 rounded-full bg-surface-container overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="w-10 text-on-surface-variant">{pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                        {[
                            { title: 'Stupendous leather quality', body: 'Zero break-in period and buttery calfskin leather. Blown away.', name: 'Lucas Henderson', initials: 'LH', when: '2 days ago', size: '9.5' },
                            { title: 'My new daily uniform',        body: 'Pairs with denim or wool trousers. Walks 10k steps without sore arches.', name: 'Elena Rostova',    initials: 'EK', when: '1 week ago', size: '8' },
                            { title: 'Flawless packaging',          body: 'Arrived within 48 hours in a dust bag with spare laces. Unboxing is luxury.', name: 'Marcus Thorne',  initials: 'MT', when: '2 weeks ago', size: '10' },
                        ].map((r) => (
                            <article key={r.name} className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between gap-space-sm">
                                <div className="flex flex-col gap-space-xs">
                                    <div className="flex items-center justify-between">
                                        <Stars rating={5} size={16} />
                                        <span className="font-body-sm text-on-surface-variant">{r.when}</span>
                                    </div>
                                    <h4 className="font-headline-sm font-bold">{r.title}</h4>
                                    <p className="font-body-md text-on-surface-variant leading-relaxed">"{r.body}"</p>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-label-sm">
                                        {r.initials}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-label-md font-bold">{r.name}</span>
                                        <span className="font-label-sm text-primary flex items-center gap-0.5">
                                            <Icon name="check_circle" size={14} /> Verified Buyer • Size {r.size}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Related ───────────────────────────────── */}
            <section className="w-full bg-surface-container-low/40 py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-label-sm font-bold uppercase tracking-widest text-primary">Discover More</span>
                            <h2 className="text-headline-lg font-bold">You May Also Like</h2>
                        </div>
                        <Link to="/search" className="inline-flex items-center gap-1 font-label-lg font-bold text-primary hover:underline">
                            <span>View All</span>
                            <Icon name="arrow_forward" size={18} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
                        {related.map((p) => (
                            <CatalogProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Trust bar ─────────────────────────────── */}
            <section className="w-full bg-surface-container-lowest py-space-lg px-margin-mobile md:px-margin-tablet lg:px-margin shadow-sm">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-space-md">
                    {[
                        { icon: 'local_shipping', title: 'Fast & Free Shipping', sub: 'On all orders over $50' },
                        { icon: 'history',        title: '30-Day Money Back',    sub: 'Simple, prepaid return label' },
                        { icon: 'verified_user',  title: 'Secure & Safe Checkout', sub: '256-Bit SSL Encrypted' },
                        { icon: 'support_agent',  title: '24/7 Support',         sub: 'Live chat & email assistance' },
                    ].map((t) => (
                        <div key={t.title} className="flex flex-col md:flex-row items-center gap-space-sm text-center md:text-left">
                            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Icon name={t.icon} size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-label-md font-bold">{t.title}</span>
                                <span className="font-body-sm text-on-surface-variant">{t.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}