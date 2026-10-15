import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { money } from '../../data/catalogMock';

const BADGE = {
    sale:    'bg-secondary text-on-secondary',
    primary: 'bg-primary-fixed text-on-primary-fixed',
    new:     'bg-primary text-on-primary',
};

function Stars({ rating }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const arr = [0, 1, 2, 3, 4];
    return (
        <div className="flex items-center text-tertiary-fixed-dim">
            {arr.map((i) => (
                <Icon
                    key={i}
                    name={i < full ? 'star' : i === full && half ? 'star_half' : 'star'}
                    size={15}
                    filled={i < full}
                />
            ))}
        </div>
    );
}

export default function CatalogProductCard({ product }) {
    const { slug, title, vendor, price, compareAtPrice, image, rating, reviewCount, badge, colors } = product;

    return (
        <div className="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative">
            <div className="relative w-full aspect-square bg-[#f4f3f0] overflow-hidden flex items-center justify-center p-4">
                {badge && (
                    <span className={`absolute top-3 left-3 px-2 py-0.5 rounded ${BADGE[badge.variant] ?? BADGE.primary} font-label-sm text-label-sm uppercase tracking-wider font-bold z-10`}>
                        {badge.label}
                    </span>
                )}
                <button
                    type="button"
                    aria-label="Add to wishlist"
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-secondary shadow-sm transition-colors"
                >
                    <Icon name="favorite" size={18} />
                </button>
                <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-space-md flex flex-col flex-1 justify-between gap-space-xs">
                <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        {vendor}
                    </span>
                    <Link
                        to={`/products/${slug}`}
                        className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors line-clamp-1"
                    >
                        {title}
                    </Link>
                </div>

                <div className="flex items-center gap-1 my-0.5">
                    <Stars rating={rating} />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">({reviewCount})</span>
                </div>

                {colors?.length > 0 && (
                    <div className="flex items-center gap-1">
                        {colors.slice(0, 4).map((c) => (
                            <span key={c} className="w-3 h-3 rounded-full border border-outline-variant bg-surface-container" title={c} />
                        ))}
                        {colors.length > 4 && (
                            <span className="text-label-sm text-on-surface-variant">+{colors.length - 4}</span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-price-lg text-on-surface font-bold">{money(price)}</span>
                        {compareAtPrice && (
                            <span className="text-price-strike text-outline line-through">
                                {money(compareAtPrice)}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        aria-label={`Quick add ${title}`}
                        className="w-9 h-9 rounded-lg bg-surface-container-low text-on-surface hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors shadow-sm"
                    >
                        <Icon name="add_shopping_cart" size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}