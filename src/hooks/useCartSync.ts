import { useEffect } from "react";
import { useCart } from "@/store/cart";

export function useCartSync() {
  const syncCart = useCart((s) => s.syncCart);
  useEffect(() => {
    syncCart();
    const onVis = () => {
      if (document.visibilityState === "visible") syncCart();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [syncCart]);
}
