import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";

const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID || "";
const REDIRECT_URI = "https://la-eclante.com/auth/callback";
const POST_LOGOUT_REDIRECT_URI = "https://la-eclante.com/";
const AUTH_CONFIG_KEY = "la-eclante.customer-auth-config";
const CODE_VERIFIER_KEY = "la-eclante.customer-code-verifier";
const STATE_KEY = "la-eclante.customer-auth-state";
const NONCE_KEY = "la-eclante.customer-auth-nonce";
const TOKENS_KEY = "la-eclante.customer-tokens";
const CUSTOMER_INITIAL_KEY = "la-eclante.customer-initial";

export interface CustomerAuthConfig {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
}

export interface CustomerApiTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
}

export interface CustomerOrder {
  id: string;
  name: string;
  number: number;
  processedAt: string;
  totalPrice: { amount: string; currencyCode: string };
  fulfillmentStatus: string;
  lineItems: { nodes: CustomerLineItem[] };
}

export interface CustomerLineItem {
  id: string;
  name: string;
  title: string;
  quantity: number;
  image: { url: string; altText: string | null } | null;
}

export interface CustomerProfile {
  firstName: string | null;
  lastName: string | null;
  emailAddress: { emailAddress: string } | null;
  orders: { nodes: CustomerOrder[] };
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

const CUSTOMER_QUERY = `
  query CustomerAccount {
    customer {
      firstName
      lastName
      emailAddress { emailAddress }
      orders(first: 10, reverse: true) {
        nodes {
          id
          name
          number
          processedAt
          fulfillmentStatus
          totalPrice { amount currencyCode }
          lineItems(first: 10) {
            nodes { id name title quantity image { url altText } }
          }
        }
      }
    }
  }
`;

function requireBrowserStorage(): Storage {
  if (typeof window === "undefined" || !window.sessionStorage) throw new Error("Customer sign in requires browser session storage.");
  return window.sessionStorage;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function randomBase64Url(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return encodeBase64Url(bytes);
}

async function createCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return encodeBase64Url(new Uint8Array(digest));
}

export async function discoverCustomerAuth(): Promise<CustomerAuthConfig> {
  const storage = requireBrowserStorage();
  const cached = storage.getItem(AUTH_CONFIG_KEY);
  if (cached) {
    try { return JSON.parse(cached) as CustomerAuthConfig; } catch { storage.removeItem(AUTH_CONFIG_KEY); }
  }
  if (!SHOPIFY_STORE_PERMANENT_DOMAIN) throw new Error("The Shopify storefront domain is not configured.");
  const response = await fetch(`https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/.well-known/openid-configuration`);
  if (!response.ok) throw new Error("Shopify sign in is temporarily unavailable.");
  const config = await response.json() as CustomerAuthConfig;
  if (!config.authorization_endpoint || !config.token_endpoint || !config.end_session_endpoint) throw new Error("Shopify returned an incomplete sign-in configuration.");
  storage.setItem(AUTH_CONFIG_KEY, JSON.stringify(config));
  return config;
}

export async function buildCustomerAuthorizeUrl(prompt?: "none"): Promise<string> {
  if (!CLIENT_ID) throw new Error("Customer Account client ID is not configured.");
  const storage = requireBrowserStorage();
  const verifier = randomBase64Url();
  const state = randomBase64Url();
  const nonce = randomBase64Url();
  const challenge = await createCodeChallenge(verifier);
  storage.setItem(CODE_VERIFIER_KEY, verifier);
  storage.setItem(STATE_KEY, state);
  storage.setItem(NONCE_KEY, nonce);
  const config = await discoverCustomerAuth();
  const url = new URL(config.authorization_endpoint);
  url.searchParams.set("scope", "openid email customer-account-api:full");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  if (prompt) url.searchParams.set("prompt", prompt);
  return url.toString();
}

export async function exchangeCustomerCode(code: string, returnedState: string | null): Promise<void> {
  const storage = requireBrowserStorage();
  const expectedState = storage.getItem(STATE_KEY);
  const verifier = storage.getItem(CODE_VERIFIER_KEY);
  storage.removeItem(CODE_VERIFIER_KEY);
  storage.removeItem(STATE_KEY);
  storage.removeItem(NONCE_KEY);
  if (!verifier || !expectedState || returnedState !== expectedState) throw new Error("This sign-in link is invalid or expired. Please try again.");
  if (!CLIENT_ID) throw new Error("Customer Account client ID is not configured.");
  const config = await discoverCustomerAuth();
  const response = await fetch(config.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", client_id: CLIENT_ID, redirect_uri: REDIRECT_URI, code, code_verifier: verifier }),
  });
  if (!response.ok) throw new Error("Shopify could not complete sign in. The code may have expired.");
  const tokenResponse = await response.json() as TokenResponse;
  if (!tokenResponse.access_token || !tokenResponse.expires_in) throw new Error("Shopify returned an incomplete sign-in response.");
  const idTokenClaims = tokenResponse.id_token ? readIdTokenClaims(tokenResponse.id_token) : null;
  setCustomerTokens({ accessToken: tokenResponse.access_token, refreshToken: tokenResponse.refresh_token, idToken: tokenResponse.id_token, expiresAt: Date.now() + tokenResponse.expires_in * 1000 }, idTokenClaims?.given_name || idTokenClaims?.name);
}

export function getCustomerTokens(): CustomerApiTokens | null {
  try {
    const value = requireBrowserStorage().getItem(TOKENS_KEY);
    return value ? JSON.parse(value) as CustomerApiTokens : null;
  } catch { return null; }
}

export function setCustomerTokens(tokens: CustomerApiTokens, customerName?: string): void {
  // This frontend has no server endpoint for an httpOnly cookie. sessionStorage
  // limits token persistence to this tab, but it remains readable by JavaScript.
  requireBrowserStorage().setItem(TOKENS_KEY, JSON.stringify(tokens));
  const initial = customerName?.trim().charAt(0).toUpperCase();
  if (initial) requireBrowserStorage().setItem(CUSTOMER_INITIAL_KEY, initial);
}

function readIdTokenClaims(token: string): { given_name?: string; name?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { given_name?: string; name?: string };
  } catch { return null; }
}

export function getCustomerInitial(): string | null {
  try { return requireBrowserStorage().getItem(CUSTOMER_INITIAL_KEY); } catch { return null; }
}

export function cacheCustomerInitial(firstName: string | null): void {
  const initial = firstName?.trim().charAt(0).toUpperCase();
  if (initial) requireBrowserStorage().setItem(CUSTOMER_INITIAL_KEY, initial);
}

export function clearCustomerTokens(): void {
  try {
    requireBrowserStorage().removeItem(TOKENS_KEY);
    requireBrowserStorage().removeItem(CUSTOMER_INITIAL_KEY);
  } catch { /* browser storage unavailable */ }
}

async function refreshWithToken(tokens: CustomerApiTokens): Promise<string> {
  if (!tokens.refreshToken) throw new Error("interactive_refresh_required");
  const config = await discoverCustomerAuth();
  const response = await fetch(config.token_endpoint, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "refresh_token", client_id: CLIENT_ID, refresh_token: tokens.refreshToken }) });
  if (!response.ok) throw new Error("interactive_refresh_required");
  const refreshed = await response.json() as TokenResponse;
  setCustomerTokens({ accessToken: refreshed.access_token, refreshToken: refreshed.refresh_token || tokens.refreshToken, idToken: refreshed.id_token || tokens.idToken, expiresAt: Date.now() + refreshed.expires_in * 1000 });
  return refreshed.access_token;
}

export async function getValidCustomerAccessToken(): Promise<string> {
  const tokens = getCustomerTokens();
  if (!tokens) throw new Error("not_authenticated");
  if (tokens.expiresAt > Date.now() + 30_000) return tokens.accessToken;
  return refreshWithToken(tokens);
}

export async function fetchCustomerProfile(): Promise<CustomerProfile> {
  const accessToken = await getValidCustomerAccessToken();
  if (!SHOPIFY_STORE_PERMANENT_DOMAIN) throw new Error("The Shopify storefront domain is not configured.");
  const response = await fetch(`https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/.well-known/customer-account-api`);
  if (!response.ok) throw new Error("Customer account data is temporarily unavailable.");
  const apiConfig = await response.json() as { graphql_api?: string };
  if (!apiConfig.graphql_api) throw new Error("Shopify returned an incomplete account API configuration.");
  const apiResponse = await fetch(apiConfig.graphql_api, { method: "POST", headers: { "Content-Type": "application/json", Authorization: accessToken }, body: JSON.stringify({ query: CUSTOMER_QUERY }) });
  if (!apiResponse.ok) throw new Error("Customer account data is temporarily unavailable.");
  const result = await apiResponse.json() as { data?: { customer: CustomerProfile }; errors?: Array<{ message: string }> };
  if (result.errors?.length || !result.data?.customer) throw new Error(result.errors?.[0]?.message || "Customer account data could not be loaded.");
  return result.data.customer;
}

export async function logoutCustomer(): Promise<void> {
  const tokens = getCustomerTokens();
  clearCustomerTokens();
  if (!tokens?.idToken) { window.location.assign("/"); return; }
  try {
    const config = await discoverCustomerAuth();
    const url = new URL(config.end_session_endpoint);
    url.searchParams.set("id_token_hint", tokens.idToken);
    url.searchParams.set("post_logout_redirect_uri", POST_LOGOUT_REDIRECT_URI);
    window.location.assign(url.toString());
  } catch { window.location.assign("/"); }
}