import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  unitPriceCents: number;
  quantity: number;
  isSubscription: boolean;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: CartLine) => Promise<void>;
  remove: (productId: string, isSubscription: boolean) => Promise<void>;
  update: (productId: string, isSubscription: boolean, qty: number) => Promise<void>;
  clear: () => Promise<void>;
  syncFromServer: () => Promise<void>;
  count: () => number;
  subtotalCents: () => number;
}

const sameLine = (a: CartLine, productId: string, isSub: boolean) =>
  a.productId === productId && a.isSubscription === isSub;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      setOpen: (v) => set({ open: v }),
      count: () => get().lines.reduce((s, l) => s + l.quantity, 0),
      subtotalCents: () => get().lines.reduce((s, l) => s + l.quantity * l.unitPriceCents, 0),

      add: async (line) => {
        const existing = get().lines.find((l) => sameLine(l, line.productId, line.isSubscription));
        const next = existing
          ? get().lines.map((l) =>
              sameLine(l, line.productId, line.isSubscription)
                ? { ...l, quantity: l.quantity + line.quantity }
                : l
            )
          : [...get().lines, line];
        set({ lines: next, open: true });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("cart_items").upsert(
            {
              user_id: user.id,
              product_id: line.productId,
              quantity: existing ? existing.quantity + line.quantity : line.quantity,
              is_subscription: line.isSubscription,
            },
            { onConflict: "user_id,product_id,is_subscription" }
          );
        }
      },

      remove: async (productId, isSub) => {
        set({ lines: get().lines.filter((l) => !sameLine(l, productId, isSub)) });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId)
            .eq("is_subscription", isSub);
        }
      },

      update: async (productId, isSub, qty) => {
        if (qty <= 0) return get().remove(productId, isSub);
        set({
          lines: get().lines.map((l) =>
            sameLine(l, productId, isSub) ? { ...l, quantity: qty } : l
          ),
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("cart_items")
            .update({ quantity: qty })
            .eq("user_id", user.id)
            .eq("product_id", productId)
            .eq("is_subscription", isSub);
        }
      },

      clear: async () => {
        set({ lines: [] });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await supabase.from("cart_items").delete().eq("user_id", user.id);
      },

      syncFromServer: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("cart_items")
          .select("product_id, quantity, is_subscription, products(id, slug, name, price_cents, subscription_price_cents, product_images(url))")
          .eq("user_id", user.id);
        if (!data) return;
        const lines: CartLine[] = data
          .filter((row: any) => row.products)
          .map((row: any) => ({
            productId: row.product_id,
            slug: row.products.slug,
            name: row.products.name,
            imageUrl: row.products.product_images?.[0]?.url ?? "",
            unitPriceCents: row.is_subscription
              ? (row.products.subscription_price_cents ?? row.products.price_cents)
              : row.products.price_cents,
            quantity: row.quantity,
            isSubscription: row.is_subscription,
          }));
        set({ lines });
      },
    }),
    { name: "la-eclante-cart" }
  )
);
