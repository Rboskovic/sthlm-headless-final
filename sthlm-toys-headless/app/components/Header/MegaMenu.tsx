// app/components/Header/MegaMenu.tsx - Fixed: Removed non-working "browse all" text, clean layout
import {Link} from 'react-router';
import type {MegaMenuProps} from './types';

export function MegaMenu({
  menu,
  activeMenu,
  primaryDomainUrl,
  publicStoreDomain,
}: MegaMenuProps) {
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

  const activeMenuItem = activeMenu
    ? menu?.items?.find((item: any) => item.id === activeMenu)
    : null;

  const hasSubItems = activeMenuItem?.items && activeMenuItem.items.length > 0;
  const isGiftFinder = activeMenuItem?.title?.toLowerCase().includes('gift') ||
                      activeMenuItem?.title?.toLowerCase().includes('presentguide');

  // Don't show mega menu for gift finder or if no active menu or no sub-items
  if (!activeMenuItem || !hasSubItems || isGiftFinder) {
    return null;
  }

  // Apply Level 2 constraints - max 8 items
  const level2Items = activeMenuItem.items.slice(0, 8);

  // Calculate adaptive layout
  const getGridCols = (itemCount: number): string => {
    if (itemCount <= 2) return 'grid-cols-2';
    if (itemCount <= 3) return 'grid-cols-3';
    return 'grid-cols-4'; // 4+ items use 4 columns
  };

  const gridCols = getGridCols(level2Items.length);

  // Calculate container width - full width without trending section
  const containerWidth = '1272px';
  const contentPadding = '2.5rem'; // 40px

  return (
    <div
      className="absolute bg-white z-50 shadow-2xl rounded-b-lg"
      style={{
        width: containerWidth,
        left: 0,
        right: 0,
        margin: '0 auto',
        top: '100%',
        fontFamily:
          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
      }}
    >
      <div
        className="bg-white text-black"
        style={{
          padding: contentPadding,
          width: containerWidth,
          minHeight: '380px',
        }}
      >
        {/* Dynamic Grid Layout - Full Width */}
        <div className={`grid ${gridCols} gap-8 h-full`}>
          {level2Items.map((level2Item: any) => {
            // Apply Level 3 constraints - max 8 items
            const level3Items = level2Item.items ? level2Item.items.slice(0, 8) : [];
            
            return (
              <div key={level2Item.id} className="flex flex-col gap-4">
                {/* Level 2 Header - Clickable Category Header */}
                <Link
                  to={getUrl(level2Item.url)}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    lineHeight: '1.3',
                    marginBottom: '8px',
                  }}
                >
                  {level2Item.title}
                </Link>

                {/* Level 3 Items */}
                {level3Items.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {level3Items.map((level3Item: any) => (
                      <Link
                        key={level3Item.id}
                        to={getUrl(level3Item.url)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        style={{
                          fontSize: '15px',
                          fontWeight: 400,
                          lineHeight: '1.4',
                          display: 'block',
                          paddingTop: '2px',
                          paddingBottom: '2px',
                        }}
                      >
                        {level3Item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Fill empty columns for consistent layout */}
          {Array.from({length: Math.max(0, 4 - level2Items.length)}).map((_, index) => (
            <div key={`empty-${index}`} className="hidden lg:block" />
          ))}
        </div>
      </div>
    </div>
  );
}