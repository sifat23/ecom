import Icon from '../ui/Icon';
import Button from '../ui/Button';
import CountdownTimer from '../ui/CountdownTimer';
import { promoBanner } from '../../data/homeContent';

export default function PromoBanner() {
    return (
        <section className="w-full py-6 lg:py-10 bg-background">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
                <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">
                    {/* Left — content + countdown */}
                    <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6">
                        <div className="flex flex-col items-start gap-3">
              <span className="px-3 py-1 rounded bg-surface-container-highest text-on-surface-variant text-label-sm uppercase tracking-wider font-semibold">
                {promoBanner.badge}
              </span>

                            <h3 className="text-headline-lg text-on-surface font-bold tracking-tight">
                                {promoBanner.title}
                            </h3>

                            <p className="text-body-md text-on-surface-variant">
                                {promoBanner.subtitle}
                            </p>

                            <div className="pt-2">
                                <Button to={promoBanner.cta.to} className="group">
                                    {promoBanner.cta.label}
                                    <Icon
                                        name="arrow_forward"
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1.5 min-w-[260px]">
                <span className="text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
                  Hurry Up! Offer ends in
                </span>
                                <CountdownTimer seconds={promoBanner.countdownSeconds} />
                            </div>
                        </div>
                    </div>

                    {/* Right — dual visuals */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-2 p-2">
                        {promoBanner.images.map((img) => (
                            <div
                                key={img.src}
                                className="relative h-64 lg:h-full rounded-xl overflow-hidden bg-surface-container"
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}