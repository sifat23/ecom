import { Link } from 'react-router-dom';

const perks = [
    { title: 'Reach thousands',  sub: 'List on a marketplace built for discovery.' },
    { title: 'Weekly payouts',   sub: 'Stripe Connect handles the money, you ship.' },
    { title: 'One shipping API', sub: 'Self-ship or generate labels via Shippo.' },
    { title: 'You keep control', sub: 'Set prices, manage inventory, own your brand.' },
];

export default function SellLandingPage() {
    return (
        <div className="mx-auto max-w-[1200px] px-margin-mobile md:px-margin py-space-xl">
            <header className="max-w-2xl">
                <p className="text-label-sm tracking-widest text-primary uppercase">Become a Seller</p>
                <h1 className="mt-space-sm text-display-hero-mobile md:text-display-hero text-on-surface">
                    Sell to customers who are ready to buy.
                </h1>
                <p className="mt-space-md text-body-lg text-on-surface-variant">
                    Apply in minutes. Stripe handles your identity check. Once we approve you,
                    your products go live — no monthly fee, just a small commission on sales.
                </p>
                <div className="mt-space-lg flex flex-wrap gap-space-sm">
                    <Link
                        to="/sell/register"
                        className="rounded-lg bg-primary px-space-lg py-space-sm text-label-lg text-on-primary hover:bg-primary-container"
                    >
                        Start your application
                    </Link>
                    <Link
                        to="/login"
                        className="rounded-lg border border-outline px-space-lg py-space-sm text-label-lg text-on-surface hover:bg-surface-container-low"
                    >
                        I already have an account
                    </Link>
                </div>
            </header>

            <section className="mt-space-xl grid gap-gutter md:grid-cols-2">
                {perks.map((p) => (
                    <div key={p.title} className="rounded-xl bg-surface-container-lowest p-space-lg">
                        <h3 className="text-headline-sm text-on-surface">{p.title}</h3>
                        <p className="mt-space-xs text-body-md text-on-surface-variant">{p.sub}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}