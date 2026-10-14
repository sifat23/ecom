import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import ProductCard from '../product/ProductCard';
import { trendingProducts } from '../../data/homeContent';

export default function TrendingProducts() {
    return (
        <section className="w-full py-12 lg:py-16 bg-background">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex flex-col gap-space-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-headline-lg text-on-surface tracking-tight">
                        Trending Products
                    </h2>
                    <Link
                        to="/search?sort=trending"
                        className="inline-flex items-center gap-1 text-label-lg text-on-surface font-semibold hover:text-primary-container transition-colors group"
                    >
                        <span>View all products</span>
                        <Icon
                            name="arrow_forward"
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md">
                    {trendingProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}