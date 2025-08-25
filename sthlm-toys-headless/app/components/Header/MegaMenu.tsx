// app/components/Header/MegaMenu.tsx - Fixed for flexible number of sections
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

  // Show all Level 2 items (no limit)
  const level2Items = activeMenuItem.items || [];

  // Real LEGO promotional banners
  const trendingBanners = [
    {
      id: 'duplo-characters',
      title: 'LEGO DUPLO Characters',
      image: 'https://cdn.shopify.com/s/files/1/0900/8811/2507/files/MTO_NO_DUPLO_Email_Automation_1HY25_Section1_Disney_Alicia_PeppaPig_Portrait_1080x1350_cbeeeba0-4361-4320-8f4e-3346977a638e.jpg?v=1756080334',
      link: '/collections/lego-duplo',
    }
  ];

  const displayBanners = trendingBanners.slice(0, 1);

  // Group Level 2 items that have Level 3 children vs those that don't
  const sectionsWithChildren: { [key: string]: any[] } = {};
  const directItems: any[] = [];

  level2Items.forEach((item) => {
    const level3Items = item.items || [];
    if (level3Items.length > 0) {
      sectionsWithChildren[item.title] = level3Items.slice(0, 8);
    } else {
      directItems.push(item);
    }
  });

  // If we have no sections with children, treat all items as one section
  if (Object.keys(sectionsWithChildren).length === 0 && directItems.length > 0) {
    sectionsWithChildren[activeMenuItem.title] = directItems;
  }

  const sectionEntries = Object.entries(sectionsWithChildren);
  const numberOfSections = sectionEntries.length;

  // Dynamic grid based on number of sections (max 4 content + 1 trending = 5 total)
  const getGridCols = (sections: number) => {
    if (sections === 1) return 'grid-cols-2'; // 1 content + 1 trending
    if (sections === 2) return 'grid-cols-3'; // 2 content + 1 trending  
    if (sections === 3) return 'grid-cols-4'; // 3 content + 1 trending
    return 'grid-cols-5'; // 4 content + 1 trending
  };

  return (
    <div
      className="absolute bg-white z-50 shadow-2xl"
      style={{
        width: '100vw',
        maxWidth: '1400px',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '100%',
        fontFamily: "system-ui, -apple-system, sans-serif",
        borderTop: '3px solid #e5e7eb',
      }}
    >
      <div 
        className="bg-white text-black"
        style={{
          padding: '32px 40px',
          minHeight: '320px',
        }}
      >
        {/* Dynamic Grid Layout */}
        <div className={`grid ${getGridCols(numberOfSections)} gap-8`}>
          
          {/* Content Sections */}
          {sectionEntries.map(([sectionTitle, sectionItems]) => (
            <div key={sectionTitle} className="flex flex-col space-y-8">
              <div className="flex flex-col">
                
                {/* Level 1 Header with Underline */}
                <h3 
                  className="font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600"
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '1.2',
                    color: '#1f2937',
                    borderBottomColor: '#2563eb',
                    borderBottomWidth: '2px',
                  }}
                >
                  {sectionTitle}
                </h3>

                {/* Level 2/3 Items List */}
                <div className="flex flex-col space-y-2 mb-4">
                  {sectionItems.map((item: any) => (
                    <Link
                      key={item.id}
                      to={getUrl(item.url)}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '1.5',
                        color: '#6b7280',
                        textDecoration: 'none',
                      }}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                {/* Shop Full Range Button */}
                <Link
                  to={getUrl(
                    level2Items.find(item => item.title === sectionTitle)?.url || 
                    activeMenuItem.url
                  )}
                  className="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm border-b border-blue-600 hover:border-blue-800 pb-1 transition-colors"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#2563eb',
                    borderBottomWidth: '1px',
                    borderBottomColor: '#2563eb',
                    paddingBottom: '2px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    width: 'fit-content',
                  }}
                >
                  Visa alla →
                </Link>
              </div>
            </div>
          ))}

          {/* Trending Column */}
          <div className="flex flex-col space-y-6">
            <h3 
              className="font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600"
              style={{
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '1.2',
                color: '#1f2937',
                borderBottomColor: '#2563eb',
                borderBottomWidth: '2px',
              }}
            >
              Trending
            </h3>

            {/* LEGO Banner */}
            <div className="space-y-4">
              {displayBanners.map((banner) => (
                <Link
                  key={banner.id}
                  to={banner.link}
                  className="block group"
                >
                  <div
                    className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                    style={{
                      backgroundColor: '#f8fafc',
                      aspectRatio: '1/1',
                      width: '100%',
                      maxWidth: '280px',
                    }}
                  >
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-contain"
                      style={{
                        objectFit: 'contain',
                        objectPosition: 'center',
                        backgroundColor: '#f8fafc',
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }
                      }}
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                    
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
                        <svg className="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}