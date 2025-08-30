// app/root.tsx - Fixed with handleAuthStatus for customer session persistence
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
  CUSTOMER_DETAILS_QUERY,
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

export function links() {
  return [
    { rel: "preconnect", href: "https://cdn.shopify.com" },
    { rel: "preconnect", href: "https://shop.app" },
    { rel: "icon", type: "image/svg+xml", href: favicon },
    { rel: "stylesheet", href: designSystemStyles },
  ];
}

// ✅ Updated loader with handleAuthStatus fix
export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, env, customerAccount, cart } = context;

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

  // --- Customer data with handleAuthStatus fix ---
  const isLoggedIn = await customerAccount.isLoggedIn();
  let customer = null;

  if (isLoggedIn) {
    try {
      // ✅ CRITICAL FIX: Call handleAuthStatus to maintain session
      await customerAccount.handleAuthStatus();
      
      const { data } = await customerAccount.query(CUSTOMER_DETAILS_QUERY);
      customer = data?.customer;
    } catch (error) {
      console.error("Failed to load customer details:", error);
    }
  }

  return {
    header,
    popularCollections: mobileMenuCollections?.collections?.nodes || [],
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
    // ✅ Customer fields
    isLoggedIn,
    customer,
  };
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>("root");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss} />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
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

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
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