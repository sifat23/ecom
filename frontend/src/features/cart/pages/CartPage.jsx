import { useState } from 'react';
import { Link } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import CatalogProductCard from '../../../components/product/CatalogProductCard';
import { CART_ITEMS, PRODUCTS, money } from '../../../data/catalogMock';

const FREE_SHIPPING_THRESHOLD = 150;

/* ── Row item ─────────────────────────────────────────────── */

function CartItemRow({ item, onQty, onRemove }) {
    return (
        <div className="p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md group hover:bg-surface-container-low/50 transition-colors">
            <div className="flex items-center gap-space-md w-full sm:w-auto">
                <div className="relative w-24 h-24 rounded-lg bg-surface-container-low overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {item.badge && (
                        <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded font-label-sm text-[10px] font-bold uppercase ${
                            item.badge.variant === 'sale'
                                ? 'bg-secondary text-on-secondary'
                                : 'bg-surface-container-lowest/90 text-on-surface'
                        }`}>
                            {item.badge.label}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-space-xs min-w-0">
                    <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">{item.category}</span>
                    <Link to={`/products/${item.productId}`} className="font-headline-sm font-bold hover:text-primary transition-colors truncate">
                        {item.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-space-sm gap-y-1 font-body-sm text-on-surface-variant">
                        {Object.entries(item.variant).map(([k, v], i) => (
                            <span key={k} className="flex items-center gap-x-space-sm">
                                {i > 0 && <span>•</span>}
                                <span>{k}: <strong className="text-on-surface font-semibold">{v}</strong></span>
                            </span>
                        ))}
                        {item.inStock && (
                            <span className="text-primary font-medium flex items-center gap-0.5">
                                <Icon name="check_circle" size={14} /> In Stock
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-space-lg w-full sm:w-auto">
                <div className="flex items-center bg-surface-container rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => onQty(item.id, item.qty - 1)}
                        className="w-8 h-8 rounded-md bg-surface-container-lowest flex items-center justify-center hover:bg-surface-container-lowest hover:text-primary shadow-sm active:scale-95 transition"
                    >
                        <Icon name="remove" size={16} />
                    </button>
                    <span className="w-10 text-center font-headline-sm font-bold select-none">{item.qty}</span>
                    <button
                        type="button"
                        onClick={() => onQty(item.id, item.qty + 1)}
                        className="w-8 h-8 rounded-md bg-surface-container-lowest flex items-center justify-center hover:bg-surface-container-lowest hover:text-primary shadow-sm active:scale-95 transition"
                    >
                        <Icon name="add" size={16} />
                    </button>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-price-lg font-bold">{money(item.price * item.qty)}</span>
                    {item.qty > 1 && <span className="font-body-sm text-on-surface-variant">{money(item.price)} each</span>}
                    {item.compareAtPrice && (
                        <span className="font-body-sm text-secondary font-medium">Saved {money((item.compareAtPrice - item.price) * item.qty)}</span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.title}`}
                    className="w-9 h-9 rounded-full bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
                >
                    <Icon name="delete" size={18} />
                </button>
            </div>
        </div>
    );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function CartPage() {
    const [items, setItems] = useState(CART_ITEMS);

    const setQty = (id, qty) =>
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
    const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : 4.99;
    const tax = subtotal * 0.08;
    const discount = 5;
    const total = subtotal + shipping + tax - discount;

    const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    // Group by vendor
    const grouped = items.reduce((acc, item) => {
        (acc[item.vendor] ??= []).push(item);
        return acc;
    }, {});

    const recommendations = PRODUCTS.slice(0, 4);

    if (items.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto px-margin-mobile py-space-xl text-center flex flex-col items-center gap-space-md">
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="shopping_cart" size={40} />
                </div>
                <h1 className="text-headline-lg font-bold">Your cart is empty</h1>
                <p className="text-body-md text-on-surface-variant">
                    Looks like you haven't added anything yet. Let's fix that.
                </p>
                <Link
                    to="/search"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary-container text-on-primary px-6 py-3 text-label-lg font-bold hover:bg-primary transition-colors"
                >
                    <Icon name="storefront" size={18} />
                    Start shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">

            {/* ── Hero ─────────────────────────────────── */}
            <section className="w-full bg-surface-container-low py-space-lg px-margin-mobile md:px-margin-tablet lg:px-margin">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md">
                            <Link to="/" className="hover:text-primary">Home</Link>
                            <Icon name="chevron_right" size={14} />
                            <span className="text-on-surface font-semibold">Shopping Cart</span>
                        </div>
                        <div className="flex items-baseline gap-space-sm">
                            <h1 className="text-headline-lg font-bold tracking-tight">Your Shopping Cart</h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-md font-bold">
                                {items.reduce((s, i) => s + i.qty, 0)} items
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm">
                        <Icon name="verified_user" size={18} className="text-primary" />
                        <span>Guaranteed safe checkout & 30-day hassle-free returns</span>
                    </div>
                </div>
            </section>

            {/* ── Body ─────────────────────────────────── */}
            <section className="w-full py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">

                    {/* Free shipping goal */}
                    <div className="w-full bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
                        <div className="flex flex-wrap items-center justify-between gap-space-xs">
                            <div className="flex items-center gap-space-sm">
                                <span className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                                    <Icon name="local_shipping" size={18} />
                                </span>
                                <p className="font-headline-sm font-bold">
                                    {remaining > 0 ? (
                                        <>🎉 Add <span className="text-primary">{money(remaining)}</span> more for <span className="text-primary underline">Free Standard Shipping!</span></>
                                    ) : (
                                        <>🎉 You've unlocked Free Standard Shipping!</>
                                    )}
                                </p>
                            </div>
                            <span className="font-label-md text-on-surface-variant font-semibold">
                                {progress}% Reached ({money(subtotal)} / {money(FREE_SHIPPING_THRESHOLD)})
                            </span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-surface-tint rounded-full transition-all duration-700 shadow-sm"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">

                        {/* Items */}
                        <div className="lg:col-span-7 flex flex-col gap-space-lg">
                            {Object.entries(grouped).map(([vendor, vendorItems]) => (
                                <div key={vendor} className="w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                                    <div className="bg-surface-container-low px-space-md py-space-sm flex items-center justify-between">
                                        <div className="flex items-center gap-space-sm">
                                            <span className="w-6 h-6 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                                                <Icon name="storefront" size={14} />
                                            </span>
                                            <span className="font-headline-sm font-bold">{vendor}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm uppercase">
                                                Verified Partner
                                            </span>
                                        </div>
                                        <span className="font-label-sm text-on-surface-variant font-medium">Ships in 24 hours</span>
                                    </div>
                                    <div className="flex flex-col divide-y divide-outline-variant/40">
                                        {vendorItems.map((item) => (
                                            <CartItemRow
                                                key={item.id}
                                                item={item}
                                                onQty={setQty}
                                                onRemove={remove}
                                            />
                                        ))}
                                    </div>
                                    <div className="p-space-md bg-surface-container-low/60 flex flex-wrap items-center justify-between gap-space-sm">
                                        <Link to="/search" className="inline-flex items-center gap-space-xs text-primary font-label-lg hover:underline font-semibold">
                                            <Icon name="arrow_back" size={18} />
                                            Continue Shopping
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => vendorItems.forEach((i) => remove(i.id))}
                                            className="text-on-surface-variant hover:text-error font-label-md transition-colors flex items-center gap-1"
                                        >
                                            <Icon name="clear_all" size={16} />
                                            Clear vendor bag
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Order notes */}
                            <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm">
                                <label htmlFor="order-note" className="flex items-center gap-space-xs font-headline-sm font-bold">
                                    <Icon name="sticky_note_2" size={20} className="text-primary" />
                                    Add a gift note or special delivery instructions
                                </label>
                                <textarea
                                    id="order-note"
                                    rows="3"
                                    placeholder="Write your personalized gift message or courier note here..."
                                    className="w-full p-space-sm rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition"
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-5 flex flex-col gap-space-md">
                            <div className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col gap-space-md lg:sticky lg:top-32">
                                <div className="flex items-center justify-between pb-space-xs">
                                    <h2 className="text-headline-md font-bold">Order Summary</h2>
                                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm font-semibold">
                                        {items.length} items
                                    </span>
                                </div>

                                <div className="flex flex-col gap-space-sm text-body-md">
                                    <div className="flex items-center justify-between text-on-surface-variant">
                                        <span>Items Subtotal</span>
                                        <span className="text-on-surface font-semibold">{money(subtotal)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-on-surface-variant">
                                        <span>Estimated Shipping</span>
                                        <span className={shipping === 0 ? 'text-primary font-bold' : 'text-on-surface font-semibold'}>
                                            {shipping === 0 ? 'FREE' : money(shipping)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-on-surface-variant">
                                        <span>Estimated Tax</span>
                                        <span className="text-on-surface font-semibold">{money(tax)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-secondary">
                                        <span className="flex items-center gap-1">
                                            <Icon name="local_offer" size={16} />
                                            Promo Discount
                                        </span>
                                        <span className="font-bold">-{money(discount)}</span>
                                    </div>
                                </div>

                                {/* Coupon */}
                                <div className="flex items-center gap-space-xs">
                                    <div className="relative flex-1">
                                        <Icon name="sell" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                                        <input
                                            type="text"
                                            defaultValue="SPRINGMINI"
                                            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface text-body-md font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest font-label-lg font-bold shadow-sm transition-all"
                                    >
                                        Applied
                                    </button>
                                </div>

                                <div className="h-px w-full bg-surface-container-high" />

                                <div className="flex items-baseline justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-headline-sm font-bold">Total Amount</span>
                                        <span className="font-body-sm text-on-surface-variant">Including {money(tax)} in taxes</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-display-hero-mobile text-primary font-bold leading-none">
                                            {money(total)}
                                        </span>
                                        <span className="font-label-sm text-on-surface-variant">USD Currency</span>
                                    </div>
                                </div>

                                <Link
                                    to="/checkout/address"
                                    className="w-full py-3.5 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold flex items-center justify-center gap-space-sm shadow-md transition-all active:scale-[0.99] group"
                                >
                                    <span>Proceed to Checkout</span>
                                    <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1" />
                                </Link>

                                <div className="flex flex-col gap-space-xs pt-space-xs">
                                    <div className="flex items-center gap-space-sm text-outline text-center">
                                        <div className="h-px flex-1 bg-surface-container" />
                                        <span className="font-label-sm uppercase">Or Instant Checkout</span>
                                        <div className="h-px flex-1 bg-surface-container" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-space-xs">
                                        <button type="button" className="h-11 rounded-lg bg-[#5A31F4] text-white font-bold shadow-sm hover:opacity-95 transition">
                                            <span className="italic text-[13px] font-black">shop<span className="font-normal">Pay</span></span>
                                        </button>
                                        <button type="button" className="h-11 rounded-lg bg-[#FFC439] text-[#003087] font-bold shadow-sm hover:opacity-95 transition">
                                            <span className="text-[14px] font-black italic">Pay<span className="text-[#0079C1] not-italic">Pal</span></span>
                                        </button>
                                        <button type="button" className="h-11 rounded-lg bg-black text-white font-bold shadow-sm hover:opacity-90 transition">
                                            <span className="text-[14px] flex items-center gap-0.5">
                                                <Icon name="phone_iphone" size={16} /> Pay
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-space-sm flex flex-col gap-space-xs bg-surface-container-low/70 rounded-lg p-space-sm">
                                    {[
                                        { icon: 'lock', title: '256-Bit SSL Encryption:', sub: 'Bank-grade payment protection' },
                                        { icon: 'published_with_changes', title: '30-Day Easy Returns:', sub: 'Free prepaid exchange label' },
                                        { icon: 'eco', title: 'Carbon Neutral Delivery:', sub: 'Offset on every order' },
                                    ].map((b) => (
                                        <div key={b.icon} className="flex items-center gap-space-sm text-on-surface-variant font-body-sm">
                                            <Icon name={b.icon} size={18} className="text-primary" />
                                            <span><strong>{b.title}</strong> {b.sub}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Also bought */}
                    <div className="w-full flex flex-col gap-space-md pt-space-md">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-label-sm text-primary uppercase tracking-widest font-bold">Frequently Paired</span>
                                <h2 className="text-headline-lg font-bold tracking-tight">Customers Also Bought</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                            {recommendations.map((p) => (
                                <CatalogProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}