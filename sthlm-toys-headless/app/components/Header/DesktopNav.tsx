// app/components/Header/DesktopNav.tsx - Fixed font size, spacing, and Presentguide styling
import {useState} from 'react';
import {Link} from 'react-router';
import {MegaMenu} from './MegaMenu';
import type {DesktopNavProps} from './types';

export function DesktopNav({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
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

  const handleMenuHover = (itemId: string) => {
    setActiveMenu(itemId);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  // Use actual menu or fallback
  const menuItems = menu?.items || [
    {id: '1', title: 'Leksaker', url: '/collections/leksaker', items: []},
    {id: '2', title: 'Märken', url: '/collections/marken', items: []},
    {id: '3', title: 'REA', url: '/collections/rea', items: []},
    {
      id: '4',
      title: 'Presentguide',
      url: '/collections/presentguide',
      items: [],
    },
  ];

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
            gap: '0px', // We'll handle gap with padding on individual items
          }}
        >
          {menuItems.map((item: any, index: number) => {
            const hasSubItems = item.items && item.items.length > 0;
            const isGiftFinder =
              item.title?.toLowerCase().includes('gift') ||
              item.title?.toLowerCase().includes('presentguide');

            // Calculate padding - increased by 10% as requested
            const basePadding = 32; // 32px base
            const increasedPadding = Math.round(basePadding * 1.1); // 10% increase = ~35px

            return (
              <li
                key={item.id}
                className="relative flex items-center h-full"
                onMouseEnter={() => handleMenuHover(item.id)}
              >
                <Link
                  to={getUrl(item.url)}
                  className="flex items-center justify-center h-full hover:bg-white/10 transition-colors font-medium text-white"
                  style={{
                    // Increased font size to 16px as requested
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '21.6px',
                    // Increased padding by 10%
                    paddingLeft: `${increasedPadding}px`,
                    paddingRight: `${increasedPadding}px`,
                    // Special styling for Presentguide - removed background, added FFD42B color
                    backgroundColor: 'transparent', // Removed background
                    color: isGiftFinder ? '#FFD42B' : 'white', // FFD42B for Presentguide, white for others
                    textDecoration: 'none',
                  }}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mega Menu */}
        {activeMenu && (
          <div className="absolute top-full left-0 w-full z-50">
            <MegaMenu
              menu={menu}
              activeMenu={activeMenu}
              primaryDomainUrl={primaryDomainUrl}
              publicStoreDomain={publicStoreDomain}
            />
          </div>
        )}
      </nav>
    </div>
  );
}
