// app/root.tsx - With Judge.me Reviews Integration + DEBUG LOGGING
// ✅ PERFORMANCE OPTIMIZED: Added early preconnect in <head> for faster CDN connection
// ✅ PRESERVES: All existing functionality
// ✅ UPDATED: Added header banner metaobjects query
// ✅ NEW: Added Judge.me Provider for reviews
// 🔍 DEBUG: Added comprehensive logging to diagnose Judge.me initialization

import { Analytics, getShopAnalytics, useNonce } from "@shopify/hydrogen";
import { type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import React from "react";
import favicon from "~/assets/favicon.svg";
import {
  FOOTER_QUERY,
  HEADER_QUERY,
  MOBILE_MENU_COLLECTIONS_QUERY,
  HEADER_BANNER_QUERY,
} from "~/lib/fragments";
import resetStyles from "~/styles/reset.css?url";
import tailwindCss from "~/styles/tailwind.css?url";
import appStyles from "~/styles/app.css?url";
import designSystemStyles from "~/styles/design-system.css?url";
import { PageLayout } from "./components/PageLayout";
// ✅ NEW: Judge.me import
import { useJudgeme } from '@judgeme/shopify-hydrogen';

// ✅ TypeScript: Extend Window interface for Judge.me global
declare global {
  interface Window {
    jdgm?: any;
  }
}

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== "GET") return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

// ✅ PERFORMANCE OPTIMIZED: Preload critical resources
export function links() {
  return [
    // Favicon
    { rel: "icon", type: "image/svg+xml", href: favicon },
    
    // ✅ PERFORMANCE: Preload critical CSS files
    { rel: "preload", href: resetStyles, as: "style" },
    { rel: "preload", href: tailwindCss, as: "style" },
    { rel: "preload", href: designSystemStyles, as: "style" },
    
    // ✅ CSS loading order (preserved - no changes from original)
    { rel: "stylesheet", href: resetStyles },
    { rel: "stylesheet", href: tailwindCss },
    { rel: "stylesheet", href: appStyles },
    { rel: "stylesheet", href: designSystemStyles },
  ];
}

// ✅ UPDATED: Added header banner metaobjects query + Judge.me config
export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, env, cart } = context;

  // 🔍 DEBUG: Log environment variables (server-side)
  console.log('🔍 [SERVER] Judge.me Environment Check:');
  console.log('  JUDGEME_SHOP_DOMAIN:', env.JUDGEME_SHOP_DOMAIN || '❌ MISSING');
  console.log('  JUDGEME_PUBLIC_TOKEN:', env.JUDGEME_PUBLIC_TOKEN ? '✅ EXISTS (length: ' + env.JUDGEME_PUBLIC_TOKEN.length + ')' : '❌ MISSING');

  // --- Critical data ---
  const [header, mobileMenuCollections, headerBanners] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { headerMenuHandle: "mega-menu" },
    }),
    storefront.query(MOBILE_MENU_COLLECTIONS_QUERY, {
      cache: storefront.CacheLong(),
    }),
    storefront.query(HEADER_BANNER_QUERY, {
      cache: storefront.CacheLong(),
    }),
  ]);

  // --- Deferred data (footer, cart) ---
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { footerMenuHandle: "footer" },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  const judgemeConfig = {
    shopDomain: env.JUDGEME_SHOP_DOMAIN || 'klosslabbet.se',
    publicToken: env.JUDGEME_PUBLIC_TOKEN || '',
    cdnHost: 'https://cdnwidget.judge.me',  // ✅ FIXED: Use correct subdomain!
    delay: 500,
  };

  // 🔍 DEBUG: Log the config being returned
  console.log('🔍 [SERVER] Judge.me Config being returned:', judgemeConfig);

  return {
    header,
    headerBanners: headerBanners?.metaobjects?.nodes || [],
    popularCollections: (mobileMenuCollections?.collections?.nodes || []) as any,
    footer,
    cart: cart.get(),
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    // ✅ NEW: Judge.me configuration
    judgeme: judgemeConfig,
  };
}

// ✅ PERFORMANCE OPTIMIZED: Early preconnect in <head>
export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>("root");

  // ✅ EXISTING: Organization Schema for Google Merchant Center compliance
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Klosslabbet",
    "legalName": "STHLM Toys och Games AB",
    "url": "https://www.klosslabbet.se",
    "logo": "https://cdn.shopify.com/s/files/1/0900/8811/2507/files/logo-klosslabbet.se2.png?v=1755724329",
    "description": "Sveriges ledande leksaksbutik online - LEGO, pussel, spel och mer!",
    "telephone": "+46760070987",
    "email": "info@klosslabbet.se",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Filgränd 8",
      "addressLocality": "Västerhaninge",
      "postalCode": "13738",
      "addressCountry": "SE"
    },
    "vatID": "SE559517564601",
    "taxID": "559517-5646",
    "foundingDate": "2025",
    "sameAs": [
      "https://www.youtube.com/@klosslabbet",
      "https://www.instagram.com/klosslabbet.se/",
      "https://www.facebook.com/profile.php?id=61573161414339",
      "http://www.tiktok.com/@klosslabbet"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+46760070987",
        "contactType": "customer service",
        "email": "info@klosslabbet.se",
        "availableLanguage": ["Swedish"],
        "areaServed": "SE"
      }
    ]
  };

  return (
    <html lang="sv">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        
        {/* ✅ CRITICAL PERFORMANCE: Early preconnect BEFORE any other resources */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://shop.app" />
        <link rel="dns-prefetch" href="https://monorail-edge.shopifysvc.com" />
        {/* ✅ Judge.me CDN preconnect */}
        <link rel="preconnect" href="https://cdn.judge.me" />
        
        {/* ✅ EXISTING: Organization Schema for Google Merchant Center */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        
        {/* ✅ CSS links handled by links() function above */}
        <Meta />
        <Links />
      </head>
      <body>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout
              {...data}
              popularCollections={data.popularCollections || []}
            >
              {children}
            </PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

// ✅ App component with Judge.me initialization + COMPREHENSIVE DEBUG LOGGING
export default function App() {
  const data = useRouteLoaderData<RootLoader>("root");
  
  // 🔍 DEBUG: Comprehensive logging for client-side
  React.useEffect(() => {
    console.log('🔍 [CLIENT] ===== JUDGE.ME DEBUG START =====');
    console.log('🔍 [CLIENT] data object exists:', !!data);
    console.log('🔍 [CLIENT] data.judgeme exists:', !!data?.judgeme);
    
    if (data?.judgeme) {
      console.log('🔍 [CLIENT] Judge.me Config:', {
        shopDomain: data.judgeme.shopDomain,
        publicTokenExists: !!data.judgeme.publicToken,
        publicTokenLength: data.judgeme.publicToken?.length || 0,
        cdnHost: data.judgeme.cdnHost,
        delay: data.judgeme.delay,
      });
      
      // Check if token is empty string
      if (data.judgeme.publicToken === '') {
        console.error('❌ [CLIENT] PUBLIC TOKEN IS EMPTY STRING!');
      }
    } else {
      console.error('❌ [CLIENT] No judgeme config found in data!');
      console.log('🔍 [CLIENT] Available data keys:', Object.keys(data || {}));
    }
    
    // Check if Judge.me script loaded
    const checkScript = setInterval(() => {
      if (typeof window.jdgm !== 'undefined') {
        console.log('✅ [CLIENT] Judge.me script LOADED! window.jdgm exists');
        console.log('🔍 [CLIENT] window.jdgm:', window.jdgm);
        clearInterval(checkScript);
      }
    }, 500);
    
    // Stop checking after 10 seconds
    setTimeout(() => {
      clearInterval(checkScript);
      if (typeof window.jdgm === 'undefined') {
        console.error('❌ [CLIENT] Judge.me script did NOT load after 10 seconds');
        console.log('🔍 [CLIENT] Check Network tab for cdn.judge.me requests');
      }
    }, 10000);
    
    console.log('🔍 [CLIENT] ===== JUDGE.ME DEBUG END =====');
  }, [data]);
  
  // ✅ FIX: Call useJudgeme at top level, not inside useEffect!
  // This is a React hook and must be called at the top level of the component
  if (data?.judgeme) {
    console.log('✅ [CLIENT] Calling useJudgeme() with config...');
    useJudgeme(data.judgeme);
  }
  
  return <Outlet />;
}

// ✅ EXISTING: ErrorBoundary (preserved)
export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = "Unknown error";
  let errorStatus = 500;

  if (isRouteErrorResponse(error) && error.data) {
    errorMessage = error.data.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}