// app/components/Header/DesktopNav.tsx - Updated with megaMenuBanners support
import {useState} from 'react';
import {Link} from 'react-router';
import {MegaMenu} from './MegaMenu';
import type {DesktopNavProps} from './types';

export function DesktopNav({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
  megaMenuBanners = [],
}: DesktopNavProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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

  const handleMenuHover = (itemId: string, hasSubItems: boolean) => {
    // Set activeMenu to itemId only if item has sub-items, otherwise clear it
    setActiveMenu(hasSubItems ? itemId : null);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  // Return early if no menu data - Shopify default behavior
  if (!menu?.items || menu.items.length === 0) {
    return null;
  }

  // Use actual Shopify menu data - NO hardcoded fallbacks
  const menuItems = menu.items;

  return (
    <div
      className="hidden lg:block w-full bg-blue-900 relative"
      onMouseLeave={handleMenuLeave}
      style={{background: '#2171e1'}}
    >
      <nav className="mx-auto relative" style={{maxWidth: '1272px'}}>
        <ul
          className="flex items-center justify-center"
          style={{
            height: '56px',
            gap: '0px',
          }}
        >
          {menuItems.map((item: any, index: number) => {
            const hasSubItems = item.items && item.items.length > 0;
            const isGiftFinder =
              item.title?.toLowerCase().includes('gift') ||
              item.title?.toLowerCase().includes('presentguide');

            // Calculate adaptive padding based on number of items
            const basePadding = 32;
            const itemCount = menuItems.length;
            const adaptivePadding = Math.max(20, Math.min(50, basePadding * (7 - itemCount) / 6));
            const finalPadding = Math.round(adaptivePadding * 1.1);

            return (
              <li
                key={item.id}
                className="relative flex items-center h-full"
                onMouseEnter={() => handleMenuHover(item.id, hasSubItems)}
              >
                <Link
                  to={getUrl(item.url)}
                  className="flex items-center justify-center h-full hover:bg-white/10 transition-colors font-medium text-white"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '21.6px',
                    paddingLeft: `${finalPadding}px`,
                    paddingRight: `${finalPadding}px`,
                    backgroundColor: 'transparent',
                    color: isGiftFinder ? '#FFD42B' : 'white',
                    textDecoration: 'none',
                  }}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Dynamic Mega Menu - only show if activeMenu has sub-items */}
        {activeMenu && (
          <div className="absolute top-full left-0 w-full z-50">
            <MegaMenu
              menu={menu}
              activeMenu={activeMenu}
              primaryDomainUrl={primaryDomainUrl}
              publicStoreDomain={publicStoreDomain}
              megaMenuBanners={megaMenuBanners}
            />
          </div>
        )}
      </nav>
    </div>
  );
}