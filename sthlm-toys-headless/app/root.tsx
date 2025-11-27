// app/root.tsx - DEBUG VERSION with console logging
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
  POPULAR_COLLECTIONS_QUERY,
  HEADER_BANNER_QUERY,
} from "~/lib/fragments";
import resetStyles from "~/styles/reset.css?url";
import tailwindCss from "~/styles/tailwind.css?url";
import appStyles from "~/styles/app.css?url";
import designSystemStyles from "~/styles/design-system.css?url";
import { PageLayout } from "./components/PageLayout";

export type RootLoader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== "GET") return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    { rel: "icon", type: "image/svg+xml", href: favicon },
    { rel: "preload", href: resetStyles, as: "style" },
    { rel: "preload", href: tailwindCss, as: "style" },
    { rel: "preload", href: designSystemStyles, as: "style" },
    { rel: "stylesheet", href: resetStyles },
    { rel: "stylesheet", href: tailwindCss },
    { rel: "stylesheet", href: appStyles },
    { rel: "stylesheet", href: designSystemStyles },
  ];
}

// ✅ DEBUG: Enhanced helper with detailed logging
function extractPopularCollections(metaobjects: any): any[] {
  console.log('🔍 [DEBUG] Starting extraction...');
  console.log('🔍 [DEBUG] Full metaobjects response:', JSON.stringify(metaobjects, null, 2));
  
  if (!metaobjects) {
    console.log('❌ [DEBUG] metaobjects is null/undefined');
    return [];
  }
  
  if (!metaobjects.nodes) {
    console.log('❌ [DEBUG] metaobjects.nodes is missing');
    console.log('🔍 [DEBUG] Available keys:', Object.keys(metaobjects));
    return [];
  }
  
  console.log('✅ [DEBUG] Found nodes:', metaobjects.nodes.length);
  
  if (!metaobjects.nodes[0]) {
    console.log('❌ [DEBUG] First node is missing');
    return [];
  }
  
  if (!metaobjects.nodes[0].fields) {
    console.log('❌ [DEBUG] fields array is missing');
    console.log('🔍 [DEBUG] Node structure:', Object.keys(metaobjects.nodes[0]));
    return [];
  }
  
  const fields = metaobjects.nodes[0].fields;
  console.log('✅ [DEBUG] Found fields:', fields.length);
  console.log('🔍 [DEBUG] Field keys:', fields.map((f: any) => f.key));
  
  const collectionsField = fields.find((f: any) => f.key === 'kolekcije');
  
  if (!collectionsField) {
    console.log('❌ [DEBUG] kolekcije field not found');
    console.log('🔍 [DEBUG] Available field keys:', fields.map((f: any) => f.key).join(', '));
    return [];
  }
  
  console.log('✅ [DEBUG] Found kolekcije field');
  console.log('🔍 [DEBUG] kolekcije field structure:', JSON.stringify(collectionsField, null, 2));
  
  if (!collectionsField.references) {
    console.log('❌ [DEBUG] references is missing from kolekcije field');
    console.log('🔍 [DEBUG] kolekcije field keys:', Object.keys(collectionsField));
    return [];
  }
  
  if (!collectionsField.references.nodes) {
    console.log('❌ [DEBUG] references.nodes is missing');
    console.log('🔍 [DEBUG] references structure:', Object.keys(collectionsField.references));
    return [];
  }
  
  const collections = collectionsField.references.nodes;
  console.log('✅ [DEBUG] Found collections:', collections.length);
  console.log('🔍 [DEBUG] Collection titles:', collections.map((c: any) => c.title).join(', '));
  
  return collections;
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, env, cart } = context;

  console.log('🚀 [DEBUG] Starting loader...');

  const [header, popularCollectionsData, headerBanners] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { headerMenuHandle: "mega-menu" },
    }),
    storefront.query(POPULAR_COLLECTIONS_QUERY, {
      cache: storefront.CacheLong(),
    }),
    storefront.query(HEADER_BANNER_QUERY, {
      cache: storefront.CacheLong(),
    }),
  ]);

  console.log('✅ [DEBUG] Queries completed');
  console.log('🔍 [DEBUG] popularCollectionsData:', JSON.stringify(popularCollectionsData, null, 2));

  const popularCollections = extractPopularCollections(
    popularCollectionsData?.popularCollections
  );

  console.log('✅ [DEBUG] Final extracted collections:', popularCollections.length);
  console.log('🔍 [DEBUG] Collection data:', JSON.stringify(popularCollections, null, 2));

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { footerMenuHandle: "footer-1" },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    header,
    headerBanners: headerBanners?.metaobjects?.nodes || [],
    popularCollections: popularCollections as any,
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

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>("root");

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Klosslabbet",
    "legalName": "STHLM Toys och Games AB",
    "url": "https://www.klosslabbet.se",
    "logo": "https://cdn.shopify.com/s/files/1/0900/8811/2507/files/logo-klosslabbet.se2.png?v=1755724329",
    "image": "https://cdn.shopify.com/s/files/1/0900/8811/2507/files/logo-klosslabbet.se2.png?v=1755724329",
    "description": "Sveriges ledande leksaksbutik online - LEGO, pussel, spel och mer!",
    "telephone": "+46760070987",
    "email": "info@klosslabbet.se",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Filgränd 8",
      "addressLocality": "Västerhaninge",
      "postalCode": "13738",
      "addressCountry": {
        "@type": "Country",
        "name": "SE"
      }
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
        
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://shop.app" />
        <link rel="dns-prefetch" href="https://monorail-edge.shopifysvc.com" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        
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

export default function App() {
  return <Outlet />;
}

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