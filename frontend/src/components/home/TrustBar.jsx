import Icon from '../ui/Icon';
import { trustItems } from '../../data/homeContent';

export default function TrustBar() {
    return (
        <section className="w-full py-8 bg-surface-container-low/60">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
                <div className="flex flex-col items-center gap-6">
                    <h4 className="text-label-lg uppercase tracking-wider text-on-surface font-bold">
                        Trusted by 10,000+ Happy Customers
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                        {trustItems.map((item) => (
                            <div
                                key={item.title}
                                className="flex items-center gap-3 justify-center text-center sm:text-left"
                            >
                                <Icon name={item.icon} size={24} className="text-primary-container" />
                                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface font-bold">
                    {item.title}
                  </span>
                                    <span className="text-body-sm text-on-surface-variant">
                    {item.sub}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}