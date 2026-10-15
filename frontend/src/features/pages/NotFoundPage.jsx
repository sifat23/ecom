import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';

export default function NotFoundPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [chatOpen, setChatOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "404 — Page Not Found | Minimog";
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        } else {
            navigate('/search');
        }
    };

    return (
        <div className="w-full bg-background min-h-[calc(100vh-160px)]">
            <div className="flex flex-col w-full">
                {/* ── 404 Hero Section ── */}
                <section className="relative w-full overflow-hidden px-margin-mobile md:px-margin-tablet lg:px-margin pt-space-lg md:pt-space-xl pb-space-xl">
                    <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-primary-fixed-dim/20 via-surface-container/30 to-transparent blur-3xl rounded-full" />
                    
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
                        {/* 404 Big typography with SVG wave and badge */}
                        <div className="relative flex items-center justify-center select-none py-space-xs">
                            <span className="font-display-hero text-[110px] md:text-[180px] lg:text-[220px] leading-none tracking-tighter text-surface-container-highest/70 font-bold opacity-60">
                                404
                            </span>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                    className="w-48 md:w-72 lg:w-96 h-20 md:h-28 text-primary/10"
                                    fill="none"
                                    viewBox="0 0 400 120"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0 60C50 20 100 100 150 60C200 20 250 100 300 60C350 20 380 80 400 60"
                                        stroke="currentColor"
                                        strokeDasharray="6 8"
                                        strokeLinecap="round"
                                        strokeWidth="3"
                                    />
                                </svg>
                            </div>
                            <div className="absolute bottom-2 md:bottom-6 flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-low shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-secondary" />
                                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                                    Archived Reference #404
                                </span>
                            </div>
                        </div>

                        {/* Heading & description */}
                        <div className="flex flex-col gap-space-xs mt-space-md max-w-2xl">
                            <h1 className="font-headline-lg text-headline-lg md:font-display-hero md:text-display-hero text-on-surface tracking-tight font-bold">
                                We couldn't find the piece you're looking for
                            </h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
                                The page may have been moved, renamed, or is temporarily unavailable in our archive. Let us guide you back to our curated catalog.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full max-w-xl mt-space-lg">
                            <form
                                className="flex flex-col sm:flex-row items-stretch gap-space-xs bg-surface-container-lowest p-2 rounded-xl shadow-md"
                                onSubmit={handleSearch}
                            >
                                <div className="flex items-center flex-1 px-3 gap-2">
                                    <Icon name="search" size={20} className="text-on-surface-variant" />
                                    <input
                                        className="w-full bg-transparent text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none"
                                        placeholder="Search products, articles, or collections..."
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="h-11 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                    type="submit"
                                >
                                    <span>Search</span>
                                    <Icon name="arrow_forward" size={18} />
                                </button>
                            </form>

                            {/* Suggested queries */}
                            <div className="flex items-center justify-center gap-space-sm mt-3 flex-wrap text-on-surface-variant font-label-sm text-label-sm">
                                <span className="text-outline">Suggested queries:</span>
                                <Link
                                    className="hover:text-primary transition-colors underline decoration-outline-variant underline-offset-4"
                                    to="/search?q=Minimalist+Backpack"
                                >
                                    Minimalist Backpack
                                </Link>
                                <span className="w-1 h-1 rounded-full bg-outline-variant" />
                                <Link
                                    className="hover:text-primary transition-colors underline decoration-outline-variant underline-offset-4"
                                    to="/search?q=Nordic+Knitwear"
                                >
                                    Nordic Knitwear
                                </Link>
                                <span className="w-1 h-1 rounded-full bg-outline-variant" />
                                <Link
                                    className="hover:text-primary transition-colors underline decoration-outline-variant underline-offset-4"
                                    to="/search?q=Leather+Chelsea+Boots"
                                >
                                    Leather Chelsea Boots
                                </Link>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-lg">
                            <Link
                                className="h-12 px-7 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center gap-2 shadow-sm transition-all hover:translate-y-[-1px]"
                                to="/"
                            >
                                <Icon name="home" size={18} />
                                <span>Return to Homepage</span>
                            </Link>
                            <Link
                                className="h-12 px-7 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center gap-2 shadow-sm transition-all hover:translate-y-[-1px]"
                                to="/collections"
                            >
                                <span>Explore Collections</span>
                                <Icon name="arrow_outward" size={18} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Popular Destinations Section ── */}
                <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-primary font-label-md text-label-md uppercase tracking-wider">
                                <span className="w-6 h-[2px] bg-primary" />
                                <span>Curated Waypoints</span>
                            </div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                Popular Destinations
                            </h2>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                            Explore our signature departments handcrafted with Scandinavian functionalism and certified sustainable sourcing.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                        {/* Destination Card 1 — Best Sellers */}
                        <Link
                            className="group relative flex flex-col rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300"
                            to="/search?sort=best"
                        >
                            <div className="relative w-full h-48 overflow-hidden bg-surface-container-low">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Minimalist luxury leather boots and everyday carry accessories"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM1o0NE4crOOwkuMbisr3vva9KIkOY66Lyi1Y7Noqc1zfUMw9ScnBVF54yU-lXIjN86FzozVarSELCpBVT_asRvOK2xBXwiphkqN5oAOx0G6kdsxUn0g-FcpyiyquyDEQ8IooInjoDC3dP5kYdV5TOUx5v63a0G7MLyIFiNJ4-KVHjxURoBxkr70nHpXk4EjveKAOho5HoQRsEjcb8PBbXthGAOe7Dcn6dVVkfrkRRF5PB0R9-lb5h"
                                />
                                <div className="absolute top-3 left-3 px-2 py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-md font-label-sm text-label-sm text-primary font-bold shadow-sm">
                                    TOP RATED
                                </div>
                            </div>
                            <div className="p-space-md flex flex-col justify-between flex-1 gap-space-sm">
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                                        Essential Carry
                                    </span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1 group-hover:text-primary transition-colors">
                                        Best Sellers
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                        Engineered footwear, organic cotton staples, and handcrafted leather carry.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-space-xs text-primary font-label-md text-label-md font-bold">
                                    <span>Shop Essentials</span>
                                    <Icon
                                        name="arrow_forward"
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </div>
                            </div>
                        </Link>

                        {/* Destination Card 2 — New Arrivals */}
                        <Link
                            className="group relative flex flex-col rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300"
                            to="/search?sort=new"
                        >
                            <div className="relative w-full h-48 overflow-hidden bg-surface-container-low">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Relaxed wool trench coats and textured knits styled in Copenhagen studio"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5sg-Lbb6EgReIs-4VBxVDEJJipQ_1-5KGY2DUf5-Svv-8jsv_Yp2VwwmFDpBgM3DpI-z1xQjU_kJqD2qxCMFqSefkz8HdScAQJfDimFc0-ZvqYC0JPajnlnJwdt6UUUX_NnZhNN0ebqVDVMFIzhllIEAtYcQdwFe40W3acyjStIXvKVEV9EK_aB315a1w8x4aqoWt9fZKz7vD8PX8qiTyfREAPqf5cnZ1eR22ZCNVs9Rpe7se6RCe"
                                />
                                <div className="absolute top-3 left-3 px-2 py-1 bg-secondary text-on-secondary rounded-md font-label-sm text-label-sm font-bold shadow-sm">
                                    NEW DROP
                                </div>
                            </div>
                            <div className="p-space-md flex flex-col justify-between flex-1 gap-space-sm">
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                                        Season Release
                                    </span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1 group-hover:text-primary transition-colors">
                                        New Arrivals
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                        Autumn / Winter capsule release built for warmth, durability, and soft layering.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-space-xs text-primary font-label-md text-label-md font-bold">
                                    <span>View Seasonal Drop</span>
                                    <Icon
                                        name="arrow_forward"
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </div>
                            </div>
                        </Link>

                        {/* Destination Card 3 — Workshop Archive */}
                        <Link
                            className="group relative flex flex-col rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300"
                            to="/collections"
                        >
                            <div className="relative w-full h-48 overflow-hidden bg-surface-container-low">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Artisanal workshop table showing recycled textile swatches"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhSNB6sstBTEgRPwWmNOcw4K_Y20-qe4JbttFlTJ1-Zs_8XGmBE38ENc0GHtT0s6d2AbVQ1hCcP_UUIGHzbe8wpfYeci3J40xwvZOfqiX-L0d-mY95dAOr15gLCU0LvV99y60y3Q0d5QpJ0aSWo6YwbKcMR15NRS-Ezb0WRwaIuFwvLn2wVHIKzDlXrvDl8ZhRZOO1OLHTVcjhWdFelP3HIr05k54uaRwel6hVY4WH6TZXfgVGidtF"
                                />
                                <div className="absolute top-3 left-3 px-2 py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-md font-label-sm text-label-sm text-on-surface font-bold shadow-sm">
                                    ETHICAL
                                </div>
                            </div>
                            <div className="p-space-md flex flex-col justify-between flex-1 gap-space-sm">
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                                        Circular Making
                                    </span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1 group-hover:text-primary transition-colors">
                                        Workshop Archive
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                        Deadstock restock, upcycled studio runs, and zero-waste garment initiatives.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-space-xs text-primary font-label-md text-label-md font-bold">
                                    <span>Discover Archive</span>
                                    <Icon
                                        name="arrow_forward"
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </div>
                            </div>
                        </Link>

                        {/* Destination Card 4 — Support Desk */}
                        <Link
                            className="group relative flex flex-col rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300"
                            to="/account"
                        >
                            <div className="relative w-full h-48 overflow-hidden bg-surface-container-low flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high">
                                <div className="w-16 h-16 rounded-2xl bg-surface-container-lowest shadow-md flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Icon name="support_agent" size={32} />
                                </div>
                                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    ACTIVE DESK
                                </div>
                            </div>
                            <div className="p-space-md flex flex-col justify-between flex-1 gap-space-sm">
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                                        Assistance
                                    </span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1 group-hover:text-primary transition-colors">
                                        Support Desk
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                        Order status tracker, courier updates, bespoke sizing questions, and returns.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-space-xs text-primary font-label-md text-label-md font-bold">
                                    <span>Open Help Portal</span>
                                    <Icon
                                        name="arrow_forward"
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* ── Need Immediate Assistance Section ── */}
                <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin mb-space-xl">
                    <div className="w-full rounded-2xl bg-surface-container-low p-space-md md:p-space-lg flex flex-col lg:flex-row items-center justify-between gap-space-md shadow-sm">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-space-md text-center sm:text-left">
                            <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm flex-shrink-0">
                                <Icon name="headset_mic" size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                                    Need immediate assistance?
                                </span>
                                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                                    Chat with our studio concierge team (24/7) or speak directly to a specialist at{' '}
                                    <span className="font-bold text-on-surface font-mono">1-800-MINIMOG</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-space-sm flex-wrap justify-center">
                            <button
                                type="button"
                                onClick={() => setChatOpen(true)}
                                className="h-10 px-5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                            >
                                <Icon name="chat_bubble" size={18} className="text-primary" />
                                <span>Start Live Chat</span>
                            </button>
                            <a
                                className="h-10 px-5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors"
                                href="tel:18006464664"
                            >
                                <Icon name="call" size={18} />
                                <span>Call Studio</span>
                            </a>
                        </div>
                    </div>
                </section>
            </div>

            {/* Live Chat Modal Dialog */}
            {chatOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
                    onClick={() => setChatOpen(false)}
                >
                    <div
                        className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-6 border border-surface-container-high flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                                    <Icon name="support_agent" size={22} />
                                </div>
                                <div>
                                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">Minimog Studio Concierge</h4>
                                    <span className="flex items-center gap-1.5 font-label-sm text-label-sm text-primary font-medium">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        Available 24/7
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setChatOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                            >
                                <Icon name="close" size={18} />
                            </button>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Hello! How can we assist you today? Our concierge team is standing by to help locate archival pieces, assist with sizing, or check order deliveries.
                        </p>
                        <div className="p-3 bg-surface-container-low rounded-xl flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                            <Icon name="schedule" size={16} className="text-primary flex-shrink-0" />
                            <span>Average response time: under 2 minutes</span>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setChatOpen(false)}
                                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                            <a
                                href="mailto:support@minimog.test?subject=Archival%20Inquiry%20404"
                                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 transition-colors"
                            >
                                <Icon name="mail" size={16} />
                                <span>Email Concierge</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

