import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { navigate } from 'wouter/use-browser-location';
import {
  setBaseUrl,
  setAuthTokenGetter,
  setOwnerTokenGetter,
} from '@workspace/api-client-react';

const OWNER_TOKEN_KEY = 'divideai_owner_token';

export const isNative = Capacitor.isNativePlatform();

let ownerTokenPromise: Promise<string> | null = null;

async function getOrCreateOwnerToken(): Promise<string> {
  const { value } = await Preferences.get({ key: OWNER_TOKEN_KEY });
  if (value) return value;
  const token = crypto.randomUUID();
  await Preferences.set({ key: OWNER_TOKEN_KEY, value: token });
  return token;
}

function getOwnerToken(): Promise<string> {
  if (!ownerTokenPromise) ownerTokenPromise = getOrCreateOwnerToken();
  return ownerTokenPromise;
}

// clerk-js attaches itself to window.Clerk once ClerkProvider mounts. This
// getter is only called lazily, at request time, so the timing is safe.
declare global {
  interface Window {
    Clerk?: { session?: { getToken(): Promise<string | null> } };
  }
}

/**
 * Wires the generated API client for the native (Capacitor) build:
 *  - points every relative request at the remote API, since
 *    `capacitor://localhost` can't proxy `/api` the way the web's
 *    same-origin dev/prod server does;
 *  - sends the on-device owner token via `X-Owner-Token` (T1) instead of
 *    the httpOnly cookie the web relies on, which the WKWebView can't hold
 *    across origins;
 *  - sends the Clerk session as a Bearer token instead of Clerk's own
 *    cookie, for the same cross-origin reason — `@clerk/express` already
 *    accepts either on the server.
 * No-op on web, where the existing cookie-based flow is untouched.
 */
export function initNativeApi(): void {
  if (!isNative) return;

  const rawBase = import.meta.env.VITE_API_BASE_URL;
  if (rawBase) {
    // Accept the origin with or without a trailing /api — the generated
    // client already prefixes every request with /api (see the OpenAPI
    // `servers` entry), so a double prefix would 404 every call.
    const origin = rawBase.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    setBaseUrl(origin);
  }

  setOwnerTokenGetter(getOwnerToken);
  setAuthTokenGetter(async () => {
    try {
      return (await window.Clerk?.session?.getToken()) ?? null;
    } catch {
      return null;
    }
  });

  void App.addListener('appUrlOpen', ({ url }) => {
    const path = deepLinkToPath(url);
    if (!path) return;
    // The system browser (checkout, and later OAuth) may still be on top —
    // dismiss it now that the deep link handed control back to the app.
    void Browser.close().catch(() => {});
    navigate(path, { replace: true });
  });
}

// `new URL("divideai://pagamento/sucesso?x=1")` parses "pagamento" as the
// hostname and "/sucesso" as the pathname (custom schemes have no host
// authority), so the app path has to be reassembled from both.
function deepLinkToPath(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'divideai:') return null;
  const path = `/${parsed.hostname}${parsed.pathname}`.replace(/\/+/g, '/');
  return `${path}${parsed.search}`;
}
