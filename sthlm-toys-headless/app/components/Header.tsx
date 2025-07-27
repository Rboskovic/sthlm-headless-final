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
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  User,
  FileText,
  HelpCircle,
  MapPin,
  Truck,
  Clock,
  Smartphone,
} from "lucide-react";

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
    <header
      className="relative z-50"
      style={{
        background: "linear-gradient(to right, #1f96f4, #2171e1)",
      }}
    >
      {/* Top Utility Bar */}
      <div className="py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Left side - Country selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs">🇬🇧</span>
              <span 
                className="text-white"
                style={{
                  fontSize: '.875rem',
                  fontWeight: 500,
                  lineHeight: '135%'
                }}
              >
                UK (£)
              </span>
            </div>

            {/* Right side - Utility links */}
            <div className="flex items-center space-x-6">
              <Suspense fallback={null}>
                <Await resolve={isLoggedIn}>
                  {(isLoggedIn) => (
                    <Link
                      to={isLoggedIn ? "/account" : "/account/login"}
                      className="flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors"
                    >
                      <User size={14} className="text-white" />
                      <span 
                        className="text-white"
                        style={{
                          fontSize: '.875rem',
                          fontWeight: 500,
                          lineHeight: '135%'
                        }}
                      >
                        {isLoggedIn ? "My Account" : "Log in / Sign up"}
                      </span>
                    </Link>
                  )}
                </Await>
              </Suspense>
              <Link
                to="/account/orders"
                className="flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors"
              >
                <FileText size={14} className="text-white" />
                <span 
                  className="text-white"
                  style={{
                    fontSize: '.875rem',
                    fontWeight: 500,
                    lineHeight: '135%'
                  }}
                >
                  My orders
                </span>
              </Link>
              <Link
                to="/help"
                className="flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors"
              >
                <HelpCircle size={14} className="text-white" />
                <span 
                  className="text-white"
                  style={{
                    fontSize: '.875rem',
                    fontWeight: 500,
                    lineHeight: '135%'
                  }}
                >
                  Help
                </span>
              </Link>
              <Link
                to="/store-finder"
                className="flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors"
              >
                <MapPin size={14} className="text-white" />
                <span 
                  className="text-white"
                  style={{
                    fontSize: '.875rem',
                    fontWeight: 500,
                    lineHeight: '135%'
                  }}
                >
                  Store finder
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-2xl border-2 border-yellow-400 shadow-lg">
              STHLM TOYS
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full rounded-full overflow-hidden shadow-lg bg-white">
              <input
                type="text"
                placeholder="Search for product or brand"
                className="flex-1 px-4 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 px-8 py-3 font-semibold text-black transition-colors flex items-center justify-center">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            <Link
              to="/wishlist"
              className="hidden md:flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors"
            >
              <Heart size={20} className="text-white" />
              <span className="font-medium text-white">Wishlist</span>
            </Link>
            <CartToggle cart={cart} />
            <MobileMenuToggle />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex w-full rounded-full overflow-hidden shadow-lg bg-white">
          <input
            type="text"
            placeholder="Search for product or brand"
            className="flex-1 px-4 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 font-semibold text-black flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Navigation with Mega Menu */}
      <MegaMenuNavigation
        menu={menu}
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />

      {/* Promotional Banner */}
      <div className="bg-gray-100 text-black py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 text-sm font-medium">
            <div className="flex items-center space-x-2">
              <Truck size={16} className="text-blue-600" />
              <span>FREE DELIVERY ON ORDERS OVER £20*</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Clock size={16} className="text-blue-600" />
              <span>ORDER BY 10PM FOR NEXT DAY DELIVERY*</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Smartphone size={16} className="text-blue-600" />
              <span>FREE CLICK & COLLECT WITHIN 2 HOURS*</span>
            </div>
          </div>
        </div>
      </div>
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
      <nav className="border-t border-blue-400/30 py-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-16">
            {(menu?.items || []).map((item, index) => {
              const hasSubItems = item.items && item.items.length > 0;
              const isGiftFinder = item.title?.toLowerCase().includes("gift");

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMenuHover(item.id)}
                >
                  <Link
                    to={getUrl(item.url)}
                    className={`flex items-center font-semibold text-lg px-6 py-4 transition-colors ${
                      isGiftFinder
                        ? "bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg"
                        : "text-white hover:text-yellow-300 hover:bg-white/10 rounded-lg"
                    }`}
                  >
                    {item.title}
                    {hasSubItems && !isGiftFinder && (
                      <span className="ml-2 text-xs text-white">▼</span>
                    )}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {hasSubItems && activeMenu === item.id && !isGiftFinder && (
                    <div className="absolute top-full left-0 w-screen bg-white shadow-xl border-t-4 border-yellow-400 z-50">
                      <div className="container mx-auto px-6 py-8">
                        <div className="grid grid-cols-4 gap-8">
                          {item.items?.slice(0, 4).map((subItem) => (
                            <div key={subItem.id} className="space-y-4">
                              <Link
                                to={getUrl(subItem.url)}
                                className="block text-lg font-bold text-gray-900 hover:text-blue-600 border-b border-gray-200 pb-2"
                              >
                                {subItem.title}
                              </Link>

                              {subItem.items && subItem.items.length > 0 && (
                                <ul className="space-y-2">
                                  {subItem.items
                                    .slice(0, 8)
                                    .map((subSubItem) => (
                                      <li key={subSubItem.id}>
                                        <Link
                                          to={getUrl(subSubItem.url)}
                                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                          {subSubItem.title}
                                        </Link>
                                      </li>
                                    ))}
                                  {subItem.items.length > 8 && (
                                    <li>
                                      <Link
                                        to={getUrl(subItem.url)}
                                        className="text-sm text-blue-600 font-medium hover:text-blue-800"
                                      >
                                        Shop Full Range →
                                      </Link>
                                    </li>
                                  )}
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

  if (viewport === "mobile") {
    return (
      <nav className="md:hidden border-t border-blue-400">
        <div className="px-4 py-2">
          {(menu?.items || []).map((item) => (
            <MobileMenuItem
              key={item.id}
              item={item}
              getUrl={getUrl}
              level={0}
            />
          ))}
        </div>
      </nav>
    );
  }

  return null;
}

function MobileMenuItem({
  item,
  getUrl,
  level = 0,
}: {
  item: any;
  getUrl: (url: string | null | undefined) => string;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.items && item.items.length > 0;

  // Prevent infinite recursion
  if (level > 2) return null;

  return (
    <div className="border-b border-blue-400/30 last:border-b-0">
      <div className="flex items-center justify-between py-3">
        <Link
          to={getUrl(item.url)}
          className="flex-1 text-white hover:text-yellow-300 font-medium transition-colors"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          {item.title}
        </Link>
        {hasSubItems && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-yellow-300 px-2 transition-colors"
          >
            {isOpen ? "−" : "+"}
          </button>
        )}
      </div>

      {hasSubItems && isOpen && (
        <div className="bg-blue-700/50">
          {item.items.map((subItem: any) => (
            <MobileMenuItem
              key={subItem.id}
              item={subItem}
              getUrl={getUrl}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CartToggle({ cart }: Pick<HeaderProps, "cart">) {
  return (
    <Suspense fallback={<CartFallback />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartFallback() {
  return (
    <div className="flex items-center space-x-2 text-white">
      <ShoppingCart size={20} className="text-white" />
      <span className="hidden md:inline font-medium text-white">Basket</span>
    </div>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const { open } = useAside();

  return (
    <button
      onClick={() => open("cart")}
      className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors relative"
    >
      <ShoppingCart size={20} className="text-white" />
      <span className="hidden md:inline font-medium text-white">Basket</span>
      {cart?.totalQuantity && cart.totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
          {cart.totalQuantity}
        </span>
      )}
    </button>
  );
}

function MobileMenuToggle() {
  const { open } = useAside();
  return (
    <button
      className="md:hidden text-white hover:text-yellow-300 transition-colors"
      onClick={() => open("mobile")}
    >
      <Menu size={24} className="text-white" />
    </button>
  );
}
