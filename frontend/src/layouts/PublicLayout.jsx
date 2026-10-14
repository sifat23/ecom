import { Outlet } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';

export default function PublicLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Sticky top: promo bar + header */}
            <div className="sticky top-0 z-50">
                <TopBar />
                <SiteHeader />
            </div>

            <main className="flex-1">
                <Outlet />
            </main>

            <SiteFooter />
        </div>
    );
}