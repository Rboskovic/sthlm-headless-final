import { Suspense, useState } from "react";
import { Await, Link, useAsyncValue } from "react-router";
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from "@shopify/hydrogen";
import type {
  HeaderQuery,
  CartApiQueryFragment,
} from "storefrontapi.generated";
import { useAside } from "~/components/Aside";

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = "desktop" | "mobile";

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const { shop, menu } = header;

  return (
    <header className="bg-blue-600 text-white relative z-50">
      {/* Top Promotional Bar */}
      <div className="bg-blue-700 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <span className="text-sm font-medium">
              🚚 FREE DELIVERY ON ORDERS OVER £29
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="bg-red-500 text-white px-4 py-2 rounded font-bold text-xl border-2 border-yellow-400">
              STHLM TOYS
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search for product or brand"
                className="flex-1 px-4 py-3 text-black rounded-l-md"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-r-md">
                Search
              </button>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Link to="/account" className="text-white hover:text-yellow-400">
              Account
            </Link>
            <CartToggle cart={cart} />
            <MobileMenuToggle />
          </div>
        </div>
      </div>

      {/* Navigation with Mega Menu */}
      <MegaMenuNavigation
        menu={menu}
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
    </header>
  );
}

function MegaMenuNavigation({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderProps["header"]["menu"];
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMenuHover = (itemId: string) => {
    setActiveMenu(itemId);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  const getUrl = (url: string | null | undefined): string => {
    if (!url) return "/";

    if (
      url.includes("myshopify.com") ||
      url.includes(publicStoreDomain) ||
      url.includes(primaryDomainUrl)
    ) {
      return new URL(url).pathname;
    }
    return url;
  };

  return (
    <div className="hidden md:block relative" onMouseLeave={handleMenuLeave}>
      <nav className="bg-blue-700 border-t border-blue-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-3">
            {(menu?.items || []).map((item) => {
              const hasSubItems = item.items && item.items.length > 0;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMenuHover(item.id)}
                >
                  <Link
                    to={getUrl(item.url)}
                    className="flex items-center text-white hover:text-yellow-400 font-medium px-3 py-2"
                  >
                    {item.title}
                    {hasSubItems && <span className="ml-1">▼</span>}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {hasSubItems && activeMenu === item.id && (
                    <div className="absolute top-full left-0 w-screen bg-white shadow-lg border-t-4 border-yellow-400 z-50">
                      <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-4 gap-6">
                          {item.items?.map((subItem) => (
                            <div key={subItem.id} className="space-y-3">
                              <Link
                                to={getUrl(subItem.url)}
                                className="block text-lg font-bold text-gray-900 hover:text-blue-600"
                              >
                                {subItem.title}
                              </Link>

                              {subItem.items && subItem.items.length > 0 && (
                                <ul className="space-y-1">
                                  {subItem.items.map((subSubItem) => (
                                    <li key={subSubItem.id}>
                                      <Link
                                        to={getUrl(subSubItem.url)}
                                        className="text-sm text-gray-600 hover:text-blue-600"
                                      >
                                        {subSubItem.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps["header"]["menu"];
  primaryDomainUrl: HeaderProps["header"]["shop"]["primaryDomain"]["url"];
  viewport: Viewport;
  publicStoreDomain: HeaderProps["publicStoreDomain"];
}) {
  if (viewport === "mobile") {
    return (
      <nav className="md:hidden bg-blue-600 p-4">
        {(menu?.items || []).map((item) => (
          <div key={item.id} className="py-2">
            <Link
              to={item.url || "/"}
              className="block text-white hover:text-yellow-400"
            >
              {item.title}
            </Link>
            {item.items && item.items.length > 0 && (
              <div className="ml-4 mt-2 space-y-1">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.url || "/"}
                    className="block text-sm text-gray-300 hover:text-yellow-400"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return null;
}

function CartToggle({ cart }: Pick<HeaderProps, "cart">) {
  return (
    <Suspense fallback={<div>Cart</div>}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const { open } = useAside();

  return (
    <button
      onClick={() => open("cart")}
      className="text-white hover:text-yellow-400"
    >
      Cart ({cart?.totalQuantity ?? 0})
    </button>
  );
}

function MobileMenuToggle() {
  const { open } = useAside();
  return (
    <button
      className="md:hidden text-white hover:text-yellow-400"
      onClick={() => open("mobile")}
    >
      Menu
    </button>
  );
}
