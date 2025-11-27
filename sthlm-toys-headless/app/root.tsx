// app/root.tsx - UPDATED: Added Mega Menu Banners + Cleaned up debug logging
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
  MEGA_MENU_BANNER_QUERY,
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

// ✅ Helper: Extract popular collections from metaobject
function extractPopularCollections(metaobjects: any): any[] {
  if (!metaobjects?.nodes?.[0]?.fields) return [];
  
  const fields = metaobjects.nodes[0].fields;
  const collectionsField = fields.find((f: any) => f.key === 'kolekcije');
  
  if (!collectionsField?.references?.nodes) return [];
  
  return collectionsField.references.nodes;
}

// ✅ NEW: Helper to extract mega menu banners from metaobject
function extractMegaMenuBanners(metaobjects: any): any[] {
  if (!metaobjects?.nodes) return [];
  
  return metaobjects.nodes.map((node: any) => {
    const fields = node.fields || [];
    
    const imeField = fields.find((f: any) => f.key === 'ime_menija');
    const handleField = fields.find((f: any) => f.key === 'menu_handle');
    const slikaField = fields.find((f: any) => f.key === 'slika_400x500px');
    const kolekcjaField = fields.find((f: any) => f.key === 'kolekcija');
    
    const collection = kolekcjaField?.reference;
    
    return {
      id: node.id,
      handle: node.handle,
      menuHandle: handleField?.value || '',
      title: imeField?.value || '',
      image: slikaField?.reference?.image?.url || '',
      link: collection?.handle ? `/collections/${collection.handle}` : '',
      altText: collection?.title || '',
    };
  }).filter((banner: any) => banner.menuHandle && banner.image);
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, env, cart } = context;

  const [header, popularCollectionsData, headerBanners, megaMenuBannersData] = await Promise.all([
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
    storefront.query(MEGA_MENU_BANNER_QUERY, {
      cache: storefront.CacheLong(),
    }),
  ]);

  const popularCollections = extractPopularCollections(
    popularCollectionsData?.popularCollections
  );

  const megaMenuBanners = extractMegaMenuBanners(
    megaMenuBannersData?.megaMenuBanners
  );

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
    megaMenuBanners: megaMenuBanners as any,
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
              megaMenuBanners={data.megaMenuBanners || []}
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