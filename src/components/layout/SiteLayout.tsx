import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NewsletterPopup } from "@/components/marketing/NewsletterPopup";
import { OctoberLaunchPromo } from "@/components/marketing/OctoberLaunchPromo";
import LaunchSaleBanner from "@/components/marketing/LaunchSaleBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function SiteLayout() {
  const location = useLocation();
  const [launchPromoOpen, setLaunchPromoOpen] = useState(false);
  const [saleBannerVisible, setSaleBannerVisible] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LaunchSaleBanner onVisibilityChange={setSaleBannerVisible} />
      {saleBannerVisible && <div aria-hidden="true" className="h-11 shrink-0" />}
      <Header saleBannerVisible={saleBannerVisible} />
      <main className="flex-1">
        {/* Boundary is keyed to the route so a crash on one page clears when
            the shopper navigates elsewhere. Header/Footer/Cart live outside it
            and stay operational no matter what the current page does. */}
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
      <OctoberLaunchPromo onOpenChange={setLaunchPromoOpen} />
      <NewsletterPopup blocked={launchPromoOpen} />
    </div>
  );
}
