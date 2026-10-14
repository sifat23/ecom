import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { heroUSPs, heroImage } from '../../data/homeContent';

export default function HeroSection() {
    return (
        <section className="w-full relative overflow-hidden bg-gradient-to-b from-surface-container-low/60 to-background pt-4 pb-12 lg:pb-16">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* ── Left content ── */}
                    <div className="lg:col-span-6 flex flex-col items-start gap-space-md z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant shadow-sm">
                            <Icon name="star" size={15} filled className="text-tertiary-fixed-dim" />
                            <span className="text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                New Collection
              </span>
                        </div>

                        <h1 className="text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight leading-[1.1]">
                            Elevate Your Lifestyle <br />
                            with{' '}
                            <span className="text-primary-container font-extrabold">
                Premium Products
              </span>
                        </h1>

                        <p className="text-body-lg text-on-surface-variant max-w-lg">
                            Discover carefully curated products designed for quality, style, and
                            everyday comfort.
                        </p>

                        <div className="flex flex-wrap items-center gap-space-md pt-2">
                            <Button to="/search" size="lg" className="group">
                                Shop Now
                                <Icon
                                    name="arrow_forward"
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Button>
                            <Button to="/search?tag=new" size="lg" variant="secondary">
                                Explore Collections
                            </Button>
                        </div>

                        {/* Micro USP grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 w-full">
                            {heroUSPs.map((usp) => (
                                <div key={usp.title} className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                                        <Icon name={usp.icon} size={18} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                    <span className="text-label-md text-on-surface font-bold leading-tight">
                      {usp.title}
                    </span>
                                        <span className="text-body-sm text-[11px] text-on-surface-variant truncate">
                      {usp.sub}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right visual ── */}
                    <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
                        <div className="absolute -top-12 -right-8 w-96 h-96 bg-primary-fixed-dim/25 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative w-full max-w-lg lg:max-w-none rounded-2xl overflow-hidden bg-surface-container-low/70 shadow-sm">
                            <img
                                src={heroImage.src}
                                alt={heroImage.alt}
                                className="w-full h-[440px] md:h-[490px] object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                            />

                            <div className="absolute top-5 right-5 w-20 h-20 rounded-full bg-primary-container text-on-primary flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-105 duration-200">
                <span className="text-label-sm text-[10px] tracking-wider uppercase opacity-85">
                  Up to
                </span>
                                <span className="text-headline-md font-bold leading-tight">30%</span>
                                <span className="text-label-sm text-[10px] tracking-widest uppercase">
                  Off
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}