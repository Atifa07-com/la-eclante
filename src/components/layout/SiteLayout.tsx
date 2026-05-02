import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NewsletterPopup } from "@/components/marketing/NewsletterPopup";

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <NewsletterPopup />
    </div>
  );
}
