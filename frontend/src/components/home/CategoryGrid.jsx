import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { categories } from '../../data/homeContent';

export default function CategoryGrid() {
    return (
        <section className="w-full py-12 lg:py-16 bg-background">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex flex-col gap-space-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-headline-lg text-on-surface tracking-tight">
                        Shop by Category
                    </h2>
                    <Link
                        to="/search"
                        className="inline-flex items-center gap-1 text-label-lg text-on-surface font-semibold hover:text-primary-container transition-colors group"
                    >
                        <span>View all collections</span>
                        <Icon
                            name="arrow_forward"
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 shadow-sm group"
                        >
                            <div className="w-20 h-20 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <span className="text-label-md text-on-surface font-semibold text-center group-hover:text-primary-container transition-colors">
                {cat.name}
              </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}