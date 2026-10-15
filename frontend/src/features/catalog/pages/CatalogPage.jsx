import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import Icon from '../../../components/ui/Icon';
import CatalogProductCard from '../../../components/product/CatalogProductCard';
import { CATEGORIES, VENDORS, PRODUCTS, money } from '../../../data/catalogMock';

/* ── Page heading config per route type ───────────────────── */

function useHeading({ slug, searchParams }) {
    const sort = searchParams.get('sort');
    const tag  = searchParams.get('tag');
    const q    = searchParams.get('q');

    if (q) return { eyebrow: 'Search results', title: `"${q}"`, desc: `Products matching your query.` };
    if (slug) {
        const cat = CATEGORIES.find((c) => c.slug === slug);
        return {
            eyebrow: 'Category',
            title: cat?.name ?? slug,
            desc: `Curated pieces from verified vendors in ${cat?.name ?? slug}.`,
        };
    }
    if (sort === 'best') return { eyebrow: 'Top picks', title: 'Best Sellers', desc: 'The products customers keep coming back for.' };
    if (sort === 'new')  return { eyebrow: 'Just landed', title: 'New Arrivals', desc: 'The newest additions to the marketplace.' };
    if (tag === 'sale')  return { eyebrow: 'Limited time', title: 'Sale Items', desc: 'Discounted while stock lasts.' };
    return { eyebrow: 'All products', title: 'Collections', desc: 'Browse everything in one place.' };
}

/* ── Sidebar filters ──────────────────────────────────────── */

function FilterSidebar({ activeFilters, onClear, onRemove }) {
    const [priceMin, setPriceMin] = useState(20);
    const [priceMax, setPriceMax] = useState(280);
    const [activeCategory, setActiveCategory] = useState('accessories');
    const [activeColor, setActiveColor] = useState('olive');

    return (
        <aside className="lg:col-span-3 flex flex-col gap-space-lg bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                    <Icon name="tune" size={20} className="text-primary" />
                    <span className="font-headline-sm text-headline-sm font-bold">Filter</span>
                </div>
                <button
                    type="button"
                    onClick={onClear}
                    className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-space-sm">
                <h3 className="font-label-lg text-label-lg font-bold uppercase tracking-wider">Category</h3>
                <div className="flex flex-col gap-1.5 pt-1 pl-1">
                    <button
                        type="button"
                        onClick={() => setActiveCategory('all')}
                        className={`flex items-center justify-between text-body-sm py-1 transition-colors ${
                            activeCategory === 'all'
                                ? 'text-on-surface font-semibold'
                                : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${activeCategory === 'all' ? 'bg-primary' : 'bg-transparent'}`} />
                            All Categories
                        </span>
                        <span className="text-on-surface-variant text-label-sm">{PRODUCTS.length}</span>
                    </button>
                    {CATEGORIES.slice(0, 5).map((cat) => {
                        const count = PRODUCTS.filter((p) => p.category === cat.name).length;
                        const active = activeCategory === cat.slug;
                        return (
                            <button
                                key={cat.slug}
                                type="button"
                                onClick={() => setActiveCategory(cat.slug)}
                                className={`flex items-center justify-between text-body-sm py-1 transition-colors ${
                                    active ? 'text-on-surface font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary' : 'bg-transparent'}`} />
                                    {cat.name}
                                </span>
                                <span className="text-outline text-label-sm">{count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="h-px w-full bg-surface-container-high" />

            {/* Price */}
            <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                    <h3 className="font-label-lg text-label-lg font-bold uppercase tracking-wider">Price Range</h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                        ${priceMin} – ${priceMax}
                    </span>
                </div>
                <div className="flex items-center gap-space-sm pt-1">
                    <div className="flex-1 bg-surface-container-low rounded-lg px-2.5 py-1.5 flex items-center">
                        <span className="text-outline text-body-sm">$</span>
                        <input
                            type="number"
                            min="0" max="300"
                            value={priceMin}
                            onChange={(e) => setPriceMin(Number(e.target.value))}
                            className="w-full text-right bg-transparent text-label-md text-on-surface focus:outline-none"
                        />
                    </div>
                    <span className="text-outline-variant font-bold">-</span>
                    <div className="flex-1 bg-surface-container-low rounded-lg px-2.5 py-1.5 flex items-center">
                        <span className="text-outline text-body-sm">$</span>
                        <input
                            type="number"
                            min="0" max="300"
                            value={priceMax}
                            onChange={(e) => setPriceMax(Number(e.target.value))}
                            className="w-full text-right bg-transparent text-label-md text-on-surface focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-surface-container-high" />

            {/* Vendors */}
            <div className="flex flex-col gap-space-sm">
                <h3 className="font-label-lg text-label-lg font-bold uppercase tracking-wider">Vendor / Brand</h3>
                <div className="flex flex-col gap-2 pt-1">
                    {VENDORS.map((v, i) => (
                        <label key={v.name} className="flex items-center justify-between cursor-pointer group">
                            <span className="flex items-center gap-space-sm">
                                <input
                                    type="checkbox"
                                    defaultChecked={i === 0}
                                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                                />
                                <span className="text-body-sm text-on-surface group-hover:text-primary transition-colors">
                                    {v.name}
                                </span>
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">{v.count}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="h-px w-full bg-surface-container-high" />

            {/* Colors */}
            <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                    <h3 className="font-label-lg text-label-lg font-bold uppercase tracking-wider">Color</h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Olive</span>
                </div>
                <div className="flex items-center gap-2.5 pt-1">
                    {[
                        { name: 'obsidian', hex: '#181c1b' },
                        { name: 'olive',    hex: '#1b4d3e' },
                        { name: 'sand',     hex: '#D6C7B2' },
                        { name: 'caramel',  hex: '#8E5328' },
                        { name: 'white',    hex: '#ffffff' },
                    ].map((c) => (
                        <button
                            key={c.name}
                            type="button"
                            onClick={() => setActiveColor(c.name)}
                            title={c.name}
                            className={`w-7 h-7 rounded-full ring-offset-2 transition-transform hover:scale-110 ${
                                activeColor === c.name ? 'ring-2 ring-primary scale-110' : 'ring-2 ring-transparent'
                            } ${c.name === 'white' ? 'border border-outline-variant' : ''}`}
                            style={{ background: c.hex }}
                        >
                            {activeColor === c.name && (
                                <Icon
                                    name="check"
                                    size={14}
                                    className={c.name === 'white' || c.name === 'sand' ? 'text-on-surface' : 'text-white'}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px w-full bg-surface-container-high" />

            {/* Availability */}
            <div className="flex flex-col gap-space-sm">
                <h3 className="font-label-lg text-label-lg font-bold uppercase tracking-wider">Availability</h3>
                {['In Stock Only', 'On Sale'].map((label, i) => (
                    <div key={label} className="flex items-center justify-between pt-1">
                        <span className="text-body-sm text-on-surface">{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" />
                            <span className="w-9 h-5 bg-surface-container-high rounded-full peer-checked:bg-primary relative transition-colors
                                             after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                                             after:rounded-full after:h-4 after:w-4 after:transition-all
                                             peer-checked:after:translate-x-full" />
                        </label>
                    </div>
                ))}
            </div>
        </aside>
    );
}

/* ── Filter toolbar (chips + view + sort) ─────────────────── */

function FilterToolbar({ activeFilters, onRemove, onClear, view, setView, sort, setSort }) {
    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center gap-space-xs">
                {activeFilters.length === 0 ? (
                    <span className="font-label-sm text-label-sm text-on-surface-variant">No active filters</span>
                ) : (
                    <>
                        <span className="font-label-md text-label-md text-on-surface-variant font-semibold mr-1">
                            Active filters:
                        </span>
                        {activeFilters.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => onRemove(f)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full font-label-sm text-label-sm text-on-surface hover:bg-surface-variant transition-colors group"
                            >
                                <span>{f}</span>
                                <Icon name="close" size={14} className="text-outline group-hover:text-on-surface" />
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={onClear}
                            className="font-label-sm text-label-sm text-secondary hover:underline ml-2 font-bold"
                        >
                            Clear all
                        </button>
                    </>
                )}
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-space-md">
                <div className="flex items-center bg-surface-container-low rounded-lg p-1">
                    {[
                        { id: 'dense',    icon: 'grid_view',   label: '4 columns' },
                        { id: 'spacious', icon: 'view_column', label: '3 columns' },
                        { id: 'list',     icon: 'view_list',   label: 'List' },
                    ].map((v) => (
                        <button
                            key={v.id}
                            type="button"
                            aria-label={v.label}
                            onClick={() => setView(v.id)}
                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                                view === v.id
                                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                                    : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            <Icon name={v.icon} size={20} />
                        </button>
                    ))}
                </div>

                <div className="relative flex items-center">
                    <label htmlFor="catalog-sort" className="font-label-sm text-label-sm text-on-surface-variant mr-2 hidden sm:inline">
                        Sort by:
                    </label>
                    <div className="relative inline-block">
                        <select
                            id="catalog-sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="appearance-none bg-surface-container-low text-on-surface font-label-lg text-label-lg rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                            <option value="featured">Featured Picks</option>
                            <option value="best-selling">Best Selling</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="newest">Newest Arrivals</option>
                        </select>
                        <Icon name="expand_more" size={18} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function CatalogPage() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();

    const heading = useHeading({ slug, searchParams });
    const [activeFilters, setActiveFilters] = useState(['In Stock', 'Minimog Studio', 'Under $150']);
    const [view, setView] = useState('dense');
    const [sort, setSort] = useState(searchParams.get('sort') ?? 'featured');

    // Basic client-side filter + sort on mock data
    const products = useMemo(() => {
        let list = [...PRODUCTS];
        if (slug) list = list.filter((p) => p.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-') === slug);
        if (searchParams.get('tag') === 'sale') list = list.filter((p) => p.compareAtPrice);
        if (searchParams.get('sort') === 'new') list = list.filter((p) => p.badge?.label === 'New' || p.badge?.label === 'Bestseller');

        if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
        if (sort === 'best-selling') list.sort((a, b) => b.reviewCount - a.reviewCount);
        return list.length ? list : PRODUCTS;
    }, [slug, searchParams, sort]);

    const gridClass =
        view === 'list'     ? 'grid grid-cols-1 gap-space-md' :
        view === 'spacious' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg' :
                              'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-space-md';

    const removeFilter = (f) => setActiveFilters((prev) => prev.filter((x) => x !== f));
    const clearFilters = () => setActiveFilters([]);

    return (
        <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg flex flex-col gap-space-lg">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
                <Link to="/" className="hover:text-primary flex items-center gap-1">
                    <Icon name="home" size={16} />
                    <span>Home</span>
                </Link>
                <Icon name="chevron_right" size={14} className="text-outline-variant" />
                <Link to="/collections" className="hover:text-primary">Collections</Link>
                <Icon name="chevron_right" size={14} className="text-outline-variant" />
                <span className="text-on-surface font-semibold">{heading.title}</span>
            </nav>

            {/* Hero card */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-lg md:p-space-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-space-lg">
                <div className="flex flex-col gap-space-xs max-w-2xl z-10">
                    <div className="flex items-center gap-space-xs flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
                            {heading.eyebrow}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                            {products.length} Products Found
                        </span>
                    </div>
                    <h1 className="text-headline-lg md:text-display-hero text-on-surface tracking-tight font-bold">
                        {heading.title}
                    </h1>
                    <p className="text-body-lg text-on-surface-variant mt-1">{heading.desc}</p>
                </div>

                <div className="relative z-10 flex items-center gap-space-md bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
                        <Icon name="watch" size={26} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-headline-sm font-bold text-on-surface">Precision Craft</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Lifetime warranty on hardware</span>
                    </div>
                </div>
                <div className="absolute -right-16 -top-24 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
            </div>

            {/* Toolbar */}
            <FilterToolbar
                activeFilters={activeFilters}
                onRemove={removeFilter}
                onClear={clearFilters}
                view={view}
                setView={setView}
                sort={sort}
                setSort={setSort}
            />

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                <FilterSidebar activeFilters={activeFilters} onClear={clearFilters} onRemove={removeFilter} />

                <section className="lg:col-span-9 flex flex-col gap-space-lg">
                    {products.length === 0 ? (
                        <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center flex flex-col items-center gap-space-sm">
                            <Icon name="search_off" size={48} className="text-outline" />
                            <p className="font-headline-sm text-on-surface font-bold">No products found</p>
                            <p className="font-body-md text-on-surface-variant">Try adjusting your filters or search terms.</p>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg font-bold hover:bg-primary transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className={gridClass}>
                            {products.map((p) => (
                                <CatalogProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg border-t border-surface-container-high">
                        <p className="font-body-sm text-body-sm text-on-surface-variant text-center sm:text-left">
                            Showing <span className="font-bold text-on-surface">1 – {products.length}</span> of{' '}
                            <span className="font-bold text-on-surface">{products.length}</span> items
                        </p>
                        <nav aria-label="Pagination" className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled
                                className="w-9 h-9 rounded-lg bg-surface-container-low text-outline flex items-center justify-center cursor-not-allowed"
                            >
                                <Icon name="arrow_back" size={18} />
                            </button>
                            <button type="button" className="w-9 h-9 rounded-lg bg-primary text-on-primary font-label-md font-bold shadow-sm">
                                1
                            </button>
                            <button type="button" className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md shadow-sm">
                                2
                            </button>
                            <button type="button" className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container flex items-center justify-center shadow-sm">
                                <Icon name="arrow_forward" size={18} />
                            </button>
                        </nav>
                    </div>
                </section>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md py-space-lg px-space-md bg-surface-container-lowest rounded-xl shadow-sm">
                {[
                    { icon: 'local_shipping', title: 'Free Fast Delivery',   sub: 'On domestic orders $50+' },
                    { icon: 'sync',           title: '30-Day Returns',       sub: 'Simple no-hassle return' },
                    { icon: 'verified_user',  title: '2-Year Warranty',      sub: 'Guaranteed craftsmanship' },
                    { icon: 'support_agent',  title: '24/7 Dedicated Care',  sub: 'Live chat & phone help' },
                ].map((t) => (
                    <div key={t.title} className="flex items-center gap-space-sm">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
                            <Icon name={t.icon} size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-[14px] text-on-surface leading-tight">{t.title}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{t.sub}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}