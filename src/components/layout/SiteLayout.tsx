import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NewsletterPopup } from "@/components/marketing/NewsletterPopup";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function SiteLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
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
      <NewsletterPopup />
    </div>
  );
}
