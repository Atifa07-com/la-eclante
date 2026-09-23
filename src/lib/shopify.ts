import { toast } from "sonner";

export const SHOPIFY_API_VERSION =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_API_VERSION || "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "";
export const SHOPIFY_STOREFRONT_TOKEN =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export function getShopifyAccountUrl(path = "/account"): string {
  return `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}${path}`;
}

/** Abort any Shopify request that takes longer than this (ms). */
export const SHOPIFY_REQUEST_TIMEOUT_MS = 4000;

export interface ShopifyImage {
  url: string;
  altText: string | null;
}
export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}
export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  handle: string;
  productType?: string;
  tags?: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: ShopifyImage }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
}
export interface ShopifyProduct {
  node: ShopifyProductNode;
}

/**
 * Single choke point for every Shopify Storefront call.
 *
 * Resilience contract: this function NEVER throws and NEVER hangs. On any
 * failure — network error, non-2xx status, GraphQL errors, or a response that
 * takes longer than SHOPIFY_REQUEST_TIMEOUT_MS — it logs the cause and returns
 * `undefined`. Callers treat `undefined` as "Shopify is unavailable" and fall
 * back to a safe state (null / empty list) instead of crashing the page.
 */
export async function storefrontApiRequest<T = any>(
  query: string,
  variables: Record<string, any> = {}
): Promise<{ data?: T } | undefined> {
  // Strict 4s timeout: abort the request if Shopify is slow or unresponsive.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SHOPIFY_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (response.status === 402) {
      toast.error("Shopify: Payment required", {
        description:
          "Your Shopify store needs an active billing plan. Visit https://admin.shopify.com to upgrade.",
      });
      return undefined;
    }

    if (!response.ok) {
      // Log the status only — never echo tokens or request bodies.
      console.error(`[shopify] request failed with HTTP ${response.status}`);
      return undefined;
    }

    const data = await response.json();
    if (data.errors) {
      console.error(
        "[shopify] GraphQL errors:",
        data.errors.map((e: any) => e.message).join(", ")
      );
      return undefined;
    }
    return data;
  } catch (err) {
    // AbortError (timeout) or any network-level failure lands here.
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error(`[shopify] request aborted after ${SHOPIFY_REQUEST_TIMEOUT_MS}ms timeout`);
    } else {
      console.error("[shopify] network request failed:", (err as Error)?.message ?? err);
    }
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}

const PRODUCT_FIELDS = `
  id
  title
  description
  descriptionHtml
  handle
  productType
  tags
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 10) {
    edges {
      node {
        id title availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
  options { name values }
`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

/**
 * Returns the product edges, or `null` when Shopify was unreachable. An empty
 * array means Shopify responded but the catalog has no matching products —
 * callers can use that distinction to show "unavailable" vs "no products yet".
 */
export async function fetchProducts(
  first = 50,
  query?: string
): Promise<ShopifyProduct[] | null> {
  const res = await storefrontApiRequest<{ products: { edges: ShopifyProduct[] } }>(PRODUCTS_QUERY, {
    first,
    query: query ?? null,
  });
  if (!res) return null; // Shopify unavailable (timeout / network / error)
  return res.data?.products?.edges ?? [];
}

/**
 * Returns the product, `null` when it genuinely does not exist, or `undefined`
 * when Shopify was unreachable. Callers should redirect on `null` but show an
 * "unavailable" fallback on `undefined`.
 */
export async function fetchProductByHandle(
  handle: string
): Promise<ShopifyProductNode | null | undefined> {
  const res = await storefrontApiRequest<{ productByHandle: ShopifyProductNode | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );
  if (!res) return undefined; // Shopify unavailable
  return res.data?.productByHandle ?? null;
}

export function formatMoney(amount: string | number, currencyCode = "USD") {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(value);
}

// ============== CART ==============

export const CART_QUERY = `
  query cart($id: ID!) { cart(id: $id) { id totalQuantity } }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } }
  }
`;

export function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

export function isCartNotFoundError(
  userErrors: Array<{ field: string[] | null; message: string }>
): boolean {
  return userErrors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist")
  );
}
