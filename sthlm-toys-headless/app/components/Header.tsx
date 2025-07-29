import {Suspense, useState} from 'react';
import {Await, Link, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
  Image,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  User,
  FileText,
  HelpCircle,
  Truck,
  Clock,
  Smartphone,
} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

// Logo Component
function Logo({shop}: {shop: HeaderQuery['shop']}) {
  const logoUrl = shop?.brand?.logo?.image?.url;
  const shopName = shop?.name || 'STHLM Toys & Games';

  if (logoUrl) {
    return (
      <Link to="/" className="flex-shrink-0">
        <div
          className="flex items-center justify-center"
          style={{
            height: '46px',
            width: '130px',
          }}
        >
          <Image
            data={{
              url: logoUrl,
              altText: `${shopName} logo`,
              width: 130,
              height: 46,
            }}
            sizes="130px"
            className="object-contain w-full h-full"
            style={{
              maxWidth: '130px',
              maxHeight: '46px',
            }}
          />
        </div>
      </Link>
    );
  }

  // Fallback to text logo if no image is set in Shopify
  return (
    <Link to="/" className="flex-shrink-0">
      <div
        className="flex items-center justify-center bg-red-500 text-white rounded-lg font-bold border-2 border-yellow-400 shadow-lg"
        style={{
          height: '46px',
          width: '130px',
          fontSize: '18px',
        }}
      >
        {shopName.length > 8 ? shopName.substring(0, 8) : shopName}
      </div>
    </Link>
  );
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  return (
    <header
      className="relative z-50"
      style={{
        background: 'linear-gradient(to bottom, #1f96f4, #2171e1)',
      }}
    >
      {/* Top Utility Bar */}
      <div
        className="hidden lg:flex justify-end items-center self-stretch"
        style={{
          height: '52px',
          width: '1272px',
          margin: '0 auto',
          paddingTop: '8px',
          paddingRight: '12px',
          paddingBottom: '4px',
          paddingLeft: '12px',
        }}
      >
        {/* Right side - Utility links */}
        <div className="flex" style={{gap: '1.25rem'}}>
          <Suspense fallback={null}>
            <Await resolve={isLoggedIn}>
              {(isLoggedIn) => (
                <button
                  className="flex items-center rounded-full text-white hover:bg-gray-900/[.08] transition-colors"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '18.9px',
                    gap: '8px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                  }}
                >
                  <User size={16} className="text-white" />
                  <span>{isLoggedIn ? 'Konto' : 'Logga in'}</span>
                </button>
              )}
            </Await>
          </Suspense>
          <button
            className="flex items-center rounded-full text-white hover:bg-gray-900/[.08] transition-colors"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '18.9px',
              gap: '8px',
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
            }}
          >
            <FileText size={16} className="text-white" />
            <span>Mina beställningar</span>
          </button>
          <button
            className="flex items-center rounded-full text-white hover:bg-gray-900/[.08] transition-colors"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '18.9px',
              gap: '8px',
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
            }}
          >
            <HelpCircle size={16} className="text-white" />
            <span>Hjälp</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div
        className="hidden lg:flex lg:items-center lg:self-stretch"
        style={{
          width: '1272px',
          height: '48px',
          margin: '12px auto 0px',
          paddingLeft: '12px',
          paddingRight: '12px',
          gap: '40px',
        }}
      >
        {/* Logo - Now using the Logo component */}
        <Logo shop={shop} />

        {/* Search Bar */}
        <div className="flex-1">
          <div
            className="relative flex overflow-hidden bg-white"
            style={{
              height: '48px',
              borderRadius: '9999px',
            }}
          >
            <input
              type="text"
              placeholder="Sök efter produkt eller varumärke"
              className="flex-1 bg-white border-0 outline-none placeholder:text-gray-600 text-gray-900"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '24px',
                padding: '12px 0px 12px 24px',
                border: 'none',
                outline: 'none',
              }}
            />
            <button
              className="flex items-center justify-center"
              style={{
                height: '48px',
                width: '48px',
                backgroundColor: 'rgb(255, 212, 43)',
                borderTopRightRadius: '9999px',
                borderBottomRightRadius: '9999px',
              }}
            >
              <Search size={24} />
            </button>
          </div>
        </div>

        {/* Wishlist & Basket */}
        <div
          className="flex items-center"
          style={{
            width: '267px',
            height: '48px',
            gap: '12px',
          }}
        >
          <button
            className="flex items-center justify-center rounded-full text-white hover:bg-gray-900/[.08] transition-colors relative"
            style={{
              minHeight: '42px',
              gap: '8px',
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '8px',
              paddingBottom: '8px',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '21.6px',
            }}
          >
            <Heart size={32} className="text-white" />
            <span className="hidden lg:inline text-white">Önskelista</span>
          </button>
          <CartToggle cart={cart} />
          <MobileMenuToggle />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div
        className="lg:hidden"
        style={{
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '16px',
        }}
      >
        <div className="flex w-full rounded-full overflow-hidden shadow-lg bg-white">
          <input
            type="text"
            placeholder="Sök efter produkt eller varumärke"
            className="flex-1 text-gray-700 bg-white border-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            style={{
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
            }}
          />
          <button
            className="bg-yellow-400 hover:bg-yellow-500 font-semibold text-black flex items-center justify-center"
            style={{
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingTop: '12px',
              paddingBottom: '12px',
            }}
          >
            <Search size={16} />
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
      <div
        className="bg-gray-100 text-black"
        style={{paddingTop: '8px', paddingBottom: '8px'}}
      >
        <div
          className="mx-auto flex justify-center text-sm font-medium"
          style={{
            width: '1272px',
            paddingLeft: '12px',
            paddingRight: '12px',
          }}
        >
          <div className="flex items-center" style={{gap: '8px'}}>
            <Truck size={16} className="text-blue-600" />
            <span>FRI FRAKT PÅ BESTÄLLNINGAR ÖVER €20</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// Rest of the component functions remain the same...
function MegaMenuNavigation({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
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
    if (!url) return '/';

    if (
      url.includes('myshopify.com') ||
      url.includes(publicStoreDomain) ||
      url.includes(primaryDomainUrl)
    ) {
      return new URL(url).pathname;
    }
    return url;
  };

  // Trending data - Updated with Swedish translations
  const trendingItems = [
    {
      title: 'NYHET: WWE SummerSlam Elite',
      url: '/collections/wwe',
      image: 'wwe-image.jpg',
      bgColor: 'bg-red-600',
    },
    {
      title: '15 % rabatt på alla superhjältar',
      url: '/collections/superheroes',
      image: 'superhero-image.jpg',
      bgColor: 'bg-red-600',
    },
  ];

  const activeMenuItem = activeMenu
    ? menu?.items.find((item) => item.id === activeMenu)
    : null;
  const hasSubItems = activeMenuItem?.items && activeMenuItem.items.length > 0;
  const isBrands = activeMenuItem?.title?.toLowerCase().includes('brand');

  return (
    <div className="hidden lg:block relative" onMouseLeave={handleMenuLeave}>
      <nav className="border-t border-blue-400/30 relative">
        <ul
          className="flex relative w-full justify-center"
          style={{
            width: '1272px',
            height: '45.5938px',
            margin: '0 auto',
            paddingLeft: '80px',
            paddingRight: '80px',
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
          }}
        >
          {(menu?.items || []).map((item) => {
            const isGiftFinder = item.title?.toLowerCase().includes('gift');

            return (
              <li
                key={item.id}
                className="relative group flex-1 flex justify-center"
                onMouseEnter={() => handleMenuHover(item.id)}
              >
                <Link
                  to={getUrl(item.url)}
                  className="cursor-pointer relative block h-full"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '21.6px',
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: isGiftFinder
                      ? 'rgb(250, 211, 0)'
                      : 'rgb(255, 255, 255)',
                    width: isGiftFinder ? '240.797px' : 'auto',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: '21.6px',
                      margin: 0,
                      color: isGiftFinder
                        ? 'rgb(250, 211, 0)'
                        : 'rgb(255, 255, 255)',
                    }}
                  >
                    {item.title}
                  </h3>
                </Link>

                {/* Yellow Underline on Hover - Stays in <li> */}
                {activeMenu === item.id && !isGiftFinder && (
                  <div
                    className="absolute bottom-0 left-0 w-full border-yellow-400"
                    style={{borderBottomWidth: '4px'}}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Mega Menu Dropdown */}
        {activeMenuItem &&
          hasSubItems &&
          !activeMenuItem.title?.toLowerCase().includes('gift') && (
            <div
              className="absolute bg-white z-50"
              style={{
                width: '1272px',
                left: 0,
                right: 0,
                margin: '0 auto',
                top: '100%',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                boxShadow: 'rgba(32, 34, 35, 0.25) 0px 24px 48px -12px',
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
            >
              <div
                className="flex shadow-2xl gap-6 items-start self-stretch rounded-b-lg p-6 bg-white text-black"
                style={{
                  gap: '24px',
                  padding: '24px',
                  height: isBrands ? '461.875px' : '424.094px',
                  width: '1272px',
                }}
              >
                {/* Main Categories Grid */}
                <div
                  className={`grid ${
                    isBrands ? 'grid-cols-4' : 'grid-cols-4'
                  } gap-6 flex-grow`}
                  style={{
                    width: isBrands ? '1005px' : '810px',
                    gap: '24px',
                  }}
                >
                  {activeMenuItem.items?.map((subItem) => (
                    <div
                      key={subItem.id}
                      className="flex flex-col items-start"
                      style={{width: '233.25px'}}
                    >
                      <Link
                        to={getUrl(subItem.url)}
                        className="cursor-pointer hover:underline block"
                        style={{
                          fontSize: '16px',
                          fontWeight: 500,
                          lineHeight: '21.6px',
                          color: 'rgb(32, 34, 35)',
                          textAlign: 'left',
                          textDecoration: 'underline',
                          marginBottom: '8px',
                        }}
                      >
                        {subItem.title}
                      </Link>

                      {subItem.items && subItem.items.length > 0 && (
                        <ul
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            width: '100%',
                          }}
                        >
                          {subItem.items.slice(0, 6).map((subSubItem) => (
                            <li
                              key={subSubItem.id}
                              style={{
                                paddingTop: '2px',
                                paddingBottom: '2px',
                                marginBottom: '2px',
                              }}
                            >
                              <Link
                                to={getUrl(subSubItem.url)}
                                className="cursor-pointer hover:underline block"
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 400,
                                  lineHeight: '18.9px',
                                  color: 'rgb(49, 53, 56)',
                                  textAlign: 'left',
                                }}
                              >
                                {subSubItem.title}
                              </Link>
                            </li>
                          ))}
                          {/* Shop Full Range Link */}
                          <li
                            style={{
                              marginTop: '8px',
                            }}
                          >
                            <Link
                              to={getUrl(subItem.url)}
                              className="cursor-pointer underline block"
                              style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '18.9px',
                                color: 'rgb(33, 113, 225)',
                                textDecoration: 'underline',
                              }}
                            >
                              Shop Full Range
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {/* Trending Section - Only show for non-Brands menu */}
                {!isBrands && (
                  <div
                    className="shrink-0"
                    style={{
                      width: '195px',
                      paddingRight: '40px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: '21.6px',
                        color: 'rgb(32, 34, 35)',
                        textAlign: 'left',
                        marginBottom: '8px',
                      }}
                    >
                      Trendigt
                    </h3>
                    <div className="flex flex-col gap-4">
                      {trendingItems.map((trendingItem, idx) => (
                        <Link
                          key={idx}
                          to={trendingItem.url}
                          className={`${trendingItem.bgColor} text-white p-3 rounded text-sm block hover:opacity-90 transition-opacity`}
                        >
                          <div className="font-medium text-white text-sm leading-tight">
                            {trendingItem.title}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const getUrl = (url: string | null | undefined): string => {
    if (!url) return '/';

    if (
      url.includes('myshopify.com') ||
      url.includes(publicStoreDomain) ||
      url.includes(primaryDomainUrl)
    ) {
      return new URL(url).pathname;
    }
    return url;
  };

  if (viewport === 'mobile') {
    return (
      <nav className="lg:hidden border-t border-blue-400">
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
          style={{paddingLeft: `${level * 16}px`}}
        >
          {item.title}
        </Link>
        {hasSubItems && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-yellow-300 px-2 transition-colors"
          >
            {isOpen ? '−' : '+'}
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

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
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
    <button
      className="flex items-center justify-center rounded-full text-white"
      style={{
        minHeight: '42px',
        gap: '8px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '8px',
        paddingBottom: '8px',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '21.6px',
      }}
    >
      <ShoppingCart size={32} className="text-white" />
      <span className="hidden lg:inline text-white">Kundvagn</span>
    </button>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const {open} = useAside();

  return (
    <button
      onClick={() => open('cart')}
      className="flex items-center justify-center rounded-full text-white hover:bg-gray-900/[.08] transition-colors relative"
      style={{
        minHeight: '42px',
        gap: '8px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '8px',
        paddingBottom: '8px',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '21.6px',
      }}
    >
      <ShoppingCart size={32} className="text-white" />
      <span className="hidden lg:inline text-white">Kundvagn</span>
      {cart?.totalQuantity && cart.totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
          {cart.totalQuantity}
        </span>
      )}
    </button>
  );
}

function MobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      className="lg:hidden text-white hover:text-yellow-300 transition-colors"
      onClick={() => open('mobile')}
    >
      <Menu size={32} className="text-white" />
    </button>
  );
}
