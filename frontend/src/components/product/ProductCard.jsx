import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';

const BADGE_STYLES = {
    primary: 'bg-primary-container text-on-primary',
    outline: 'bg-surface-container-highest text-primary-container',
};

export default function ProductCard({ product }) {
    const { slug, title, price, compareAtPrice, image, imageAlt, rating, reviewCount, badge } = product;

    return (
        <div className="group flex flex-col rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300">
            <Link to={`/products/${slug}`} className="relative aspect-square w-full bg-surface-container-low overflow-hidden block">
                {badge && (
                    <span
                        className={`absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-label-sm text-[10px] tracking-wider uppercase ${BADGE_STYLES[badge.variant] ?? BADGE_STYLES.primary}`}
                    >
            {badge.label}
          </span>
                )}
                <img
                    src={image}
                    alt={imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </Link>

            <div className="p-3.5 flex flex-col gap-2">
                <Link
                    to={`/products/${slug}`}
                    className="text-headline-sm text-[15px] font-bold text-on-surface truncate hover:text-primary-container transition-colors"
                >
                    {title}
                </Link>

                <div className="flex items-baseline gap-2">
          <span className="text-price-lg text-on-surface font-bold">
            ${price.toFixed(2)}
          </span>
                    {compareAtPrice && (
                        <span className="text-price-strike text-on-surface-variant line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
                    )}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-tertiary-fixed-dim">
                        <Icon name="star" size={14} filled />
                        <span className="text-body-sm text-on-surface-variant">
              ({reviewCount})
            </span>
                    </div>
                    <button
                        type="button"
                        aria-label={`Add ${title} to cart`}
                        className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface hover:bg-primary-container hover:text-on-primary flex items-center justify-center transition-colors"
                    >
                        <Icon name="shopping_cart" size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}