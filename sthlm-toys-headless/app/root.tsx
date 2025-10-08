// app/root.tsx - Simplified version for Classic Customer Accounts
// ✅ PERFORMANCE ENHANCED: Added preload hints to existing CSS strategy
// ✅ PRESERVES: All existing functionality from 223-line version

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
import favicon from "~/assets/favicon.svg";
import {
  FOOTER_QUERY,
  HEADER_QUERY,
  MOBILE_MENU_COLLECTIONS_QUERY,
} from "~/lib/fragments";
import resetStyles from "~/styles/reset.css?url";
import tailwindCss from "~/styles/tailwind.css?url";
import appStyles from "~/styles/app.css?url";
import designSystemStyles from "~/styles/design-system.css?url";
import { PageLayout } from "./components/PageLayout";

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

// ✅ PERFORMANCE ENHANCED: Added preload hints for critical CSS
export function links() {
  return [
    // ✅ CRITICAL: Preconnect to CDN domains first (highest priority)
    { rel: "preconnect", href: "https://cdn.shopify.com", crossOrigin: "anonymous" },
    { rel: "preconnect", href: "https://shop.app" },
    { rel: "dns-prefetch", href: "https://monorail-edge.shopifysvc.com" },
    
    // Favicon
    { rel: "icon", type: "image/svg+xml", href: favicon },
    
    // ✅ PERFORMANCE: Preload critical CSS files
    { rel: "preload", href: resetStyles, as: "style" },
    { rel: "preload", href: tailwindCss, as: "style" },
    
    // ✅ EXISTING: Your CSS loading order (preserved)
    { rel: "stylesheet", href: resetStyles },
    { rel: "stylesheet", href: tailwindCss },
    { rel: "stylesheet", href: appStyles },
    { rel: "stylesheet", href: designSystemStyles },
  ];
}

// ✅ EXISTING: Classic Accounts loader (preserved completely)
export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, env, cart } = context;

  // --- Critical data ---
  const [header, mobileMenuCollections] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { headerMenuHandle: "mega-menu" },
    }),
    storefront.query(MOBILE_MENU_COLLECTIONS_QUERY, {
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

  return {
    header,
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
  };
}

// ✅ EXISTING: Layout component (preserved completely)
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
        
        {/* ✅ EXISTING: Organization Schema for Google Merchant Center */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        
        {/* ✅ EXISTING: CSS links handled by links() function above */}
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

// ✅ EXISTING: App component (preserved)
export default function App() {
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