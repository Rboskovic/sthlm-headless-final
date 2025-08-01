// app/components/Header/MegaMenu.tsx (NEW)
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
    ? menu?.items?.find((item: any) => item.id === activeMenu)
    : null;

  const hasSubItems = activeMenuItem?.items && activeMenuItem.items.length > 0;
  const isGiftFinder = activeMenuItem?.title?.toLowerCase().includes('gift');
  const isBrands =
    activeMenuItem?.title?.toLowerCase().includes('brands') ||
    activeMenuItem?.title?.toLowerCase().includes('varumärken');

  // Don't show mega menu for gift finder or if no active menu
  if (!activeMenuItem || !hasSubItems || isGiftFinder) {
    return null;
  }

  return (
    <div
      className="absolute bg-white z-50 shadow-2xl rounded-b-lg"
      style={{
        width: '1272px',
        left: 0,
        right: 0,
        margin: '0 auto',
        top: '100%',
        fontFamily:
          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
      }}
    >
      <div
        className="flex gap-6 items-start p-6 bg-white text-black"
        style={{
          height: isBrands ? '461.875px' : '424.094px',
          width: '1272px',
        }}
      >
        {/* Main Categories Grid */}
        <div
          className="grid grid-cols-4 gap-6 flex-grow"
          style={{
            width: isBrands ? '720px' : '864px',
          }}
        >
          {activeMenuItem.items?.map((subItem: any) => (
            <div key={subItem.id} className="flex flex-col gap-3">
              <Link
                to={getUrl(subItem.url)}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-base leading-tight"
              >
                {subItem.title}
              </Link>

              {/* Sub-sub items */}
              {subItem.items && subItem.items.length > 0 && (
                <div className="flex flex-col gap-2">
                  {subItem.items.slice(0, 6).map((subSubItem: any) => (
                    <Link
                      key={subSubItem.id}
                      to={getUrl(subSubItem.url)}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors leading-relaxed"
                    >
                      {subSubItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trending Section */}
        <div
          className="flex flex-col gap-4"
          style={{
            width: isBrands ? '528px' : '384px',
          }}
        >
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2">
            Trending
          </h3>
          <div className="flex flex-col gap-3">
            {trendingItems.map((trendingItem, index) => (
              <Link
                key={index}
                to={trendingItem.url}
                className={`${trendingItem.bgColor} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
                style={{
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div className="font-medium text-white text-sm leading-tight">
                  {trendingItem.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
