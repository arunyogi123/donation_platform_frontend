import React from 'react';
import { RouterProvider, useRouter } from './router';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/navbar/Navbar';
import { Footer } from './components/footer/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignDetailPage } from './pages/CampaignDetailPage';
import { DonatePage } from './pages/DonatePage';
import { PaymentStatusPage } from './pages/PaymentStatusPage';
import { SearchPage } from './pages/SearchPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyDonationsPage } from './pages/MyDonationsPage';
import { ReceiptDetailPage } from './pages/ReceiptDetailPage';
import { MyRecurringDonationsPage } from './pages/MyRecurringDonationsPage';
import { StartCampaignPage } from './pages/StartCampaignPage';

const AppRoutes: React.FC = () => {
  const { pathname } = useRouter();

  const renderCurrentRoute = () => {
    // 1. Root
    if (pathname === '/' || pathname === '') {
      return <HomePage />;
    }

    // 2. Discover Campaigns
    if (pathname === '/campaigns') {
      return <CampaignsPage />;
    }

    // 3. Campaign Donate: /campaigns/:id/donate
    const donateMatch = pathname.match(/^\/campaigns\/(\d+)\/donate\/?$/);
    if (donateMatch) {
      const campaignId = parseInt(donateMatch[1], 10);
      return <DonatePage id={campaignId} />;
    }

    // 4. Campaign Detail: /campaigns/:id
    const campaignMatch = pathname.match(/^\/campaigns\/(\d+)\/?$/);
    if (campaignMatch) {
      const campaignId = parseInt(campaignMatch[1], 10);
      return <CampaignDetailPage id={campaignId} />;
    }

    // 5. Search
    if (pathname === '/search') {
      return <SearchPage />;
    }

    // 6. Categories
    if (pathname === '/categories') {
      return <CategoriesPage />;
    }

    // 7. Category Detail: /categories/:category
    const categoryMatch = pathname.match(/^\/categories\/([^/]+)\/?$/);
    if (categoryMatch) {
      return <CategoryDetailPage categoryKey={categoryMatch[1]} />;
    }

    // 8. Informational pages
    if (pathname === '/how-it-works') {
      return <HowItWorksPage />;
    }
    if (pathname === '/about') {
      return <AboutPage />;
    }

    // 9. Auth
    if (pathname === '/login') {
      return <LoginPage />;
    }
    if (pathname === '/register') {
      return <RegisterPage />;
    }

    // 10. Donation Payment Callbacks
    if (pathname === '/donation/success') {
      return <PaymentStatusPage status="success" />;
    }
    if (pathname === '/donation/failed') {
      return <PaymentStatusPage status="failed" />;
    }
    if (pathname === '/donation/cancelled') {
      return <PaymentStatusPage status="cancelled" />;
    }

    // 11. User Profile & Records
    if (pathname === '/profile') {
      return <ProfilePage />;
    }
    if (pathname === '/my-donations') {
      return <MyDonationsPage />;
    }

    // 12. Receipt / Billing Detail: /my-donations/:id
    const receiptMatch = pathname.match(/^\/my-donations\/(\d+)\/?$/);
    if (receiptMatch) {
      const receiptId = parseInt(receiptMatch[1], 10);
      return <ReceiptDetailPage id={receiptId} />;
    }

    if (pathname === '/my-recurring-donations') {
      return <MyRecurringDonationsPage />;
    }

    // 13. Campaign Creation
    if (pathname === '/start-a-campaign') {
      return <StartCampaignPage />;
    }

    // 404 Fallback
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl font-semibold text-[#1C1917]">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-[#78716C]">
          The page or route you requested could not be located on GiveHope.
        </p>
        <div className="pt-2">
          <a
            href="/"
            className="px-4 py-2 bg-[#0D5C3A] text-white text-xs font-semibold rounded inline-block"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1C1917] selection:bg-[#0D5C3A]/20 selection:text-[#0D5C3A]">
      <Navbar />
      <main className="flex-1">{renderCurrentRoute()}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </RouterProvider>
  );
}
