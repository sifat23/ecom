import HeroSection       from '../../components/home/HeroSection';
import CategoryGrid      from '../../components/home/CategoryGrid';
import PromoBanner       from '../../components/home/PromoBanner';
import TrendingProducts  from '../../components/home/TrendingProducts';
import TrustBar          from '../../components/home/TrustBar';
import NewsletterStrip   from '../../components/home/NewsletterStrip';

export default function HomePage() {
    return (
        <div className="flex flex-col w-full">
            <HeroSection />
            <CategoryGrid />
            <PromoBanner />
            <TrendingProducts />
            <TrustBar />
            <NewsletterStrip />
        </div>
    );
}