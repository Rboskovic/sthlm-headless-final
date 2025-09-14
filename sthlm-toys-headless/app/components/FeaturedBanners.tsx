// FILE: app/components/FeaturedBanners.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Updated with homepage_banner_image approach
// ✅ FIXED: Mobile scaling - adjusted height to match 1.75:1 image ratio
// ✅ FIXED: TypeScript using ShopByAge pattern - NO IMAGE COMPONENT, NO IMPORT ISSUES

import {Link} from 'react-router';

// ✅ TYPESCRIPT FIX: Create proper interface with metafields (same pattern as ShopByAge.tsx)
// NOTE: Not importing from storefrontapi.generated - defining our own interface
interface CollectionFragment {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: {
    url: string;
    altText?: string;
    id?: string;
    width?: number;
    height?: number;
  } | null;
  metafields?: Array<{key: string; value: string; namespace: string}>;
}

// Enhanced collection with banner image
interface CollectionWithBanner extends CollectionFragment {
  bannerImage?: {
    url: string | null;
    altText: string;
  };
}

interface FeaturedBannersProps {
  collections: CollectionFragment[];
}

// Fallback banners for testing/development
const fallbackBanners: CollectionWithBanner[] = [
  {
    id: 'fallback-1',
    title: 'MINECRAFT',
    handle: 'minecraft',
    description: 'Bygg din värld med oändliga möjligheter',
    image: {
      url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      altText: 'Minecraft Collection',
      width: 800,
      height: 400,
    },
  },
  {
    id: 'fallback-2', 
    title: 'SONIC THE HEDGEHOG',
    handle: 'sonic',
    description: 'Snabbhetens ultimata äventyr väntar',
    image: {
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      altText: 'Sonic Collection', 
      width: 800,
      height: 400,
    },
  },
];

export function FeaturedBanners({collections}: FeaturedBannersProps) {
  // Helper function to extract metafield values (same pattern as ShopByAge.tsx)
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string}> | undefined,
    key: string,
  ): string | null => {
    if (!metafields) return null;
    const metafield = metafields.find((m) => m && m.key === key);
    return metafield ? metafield.value : null;
  };

  // ✅ NEW BANNER LOGIC: Filter collections that have homepage_banner_image metafield set
  const featuredBanners: CollectionWithBanner[] =
    collections && collections.length > 0
      ? collections.filter((collection) => {
          // Check if homepage_banner_image metafield exists and has a value
          const bannerImageUrl = getMetafieldValue(collection.metafields, 'homepage_banner_image');
          return bannerImageUrl && bannerImageUrl.trim().length > 0;
        })
        .map((collection): CollectionWithBanner => {
          // Add the custom banner image to the collection
          const bannerImageUrl = getMetafieldValue(collection.metafields, 'homepage_banner_image');
          return {
            ...collection,
            bannerImage: {
              url: bannerImageUrl,
              altText: `${collection.title} Banner`,
            },
          };
        })
      : [];

  // Use Shopify banners or fallback
  const displayBanners = featuredBanners.length > 0 ? featuredBanners : fallbackBanners;
  
  // Return null if no banners
  if (displayBanners.length === 0) return null;

  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Desktop Grid */}
          <div className="grid grid-cols-2 gap-4">
            {displayBanners.slice(0, 2).map((banner) => (
              <Link
                key={banner.id}
                to={`/collections/${banner.handle}`}
                className="group block"
              >
                <div
                  className="relative overflow-hidden rounded-2xl group-hover:shadow-lg transition-shadow duration-200"
                  style={{
                    height: '400px',
                  }}
                >
                  {/* ✅ FIXED: All images use regular img tags - NO SHOPIFY IMAGE COMPONENT */}
                  {banner.bannerImage?.url ? (
                    <img
                      src={banner.bannerImage.url}
                      alt={banner.bannerImage.altText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : banner.image?.url ? (
                    <img
                      src={banner.image.url}
                      alt={banner.image.altText || banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    /* Fallback colored background */
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{backgroundColor: '#4CAF50'}}
                    >
                      <div className="text-white text-sm opacity-75">No Image</div>
                    </div>
                  )}

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="text-left">
                      {/* Collection Title */}
                      <h3
                        className="text-white font-bold mb-2"
                        style={{
                          fontSize: '28px',
                          fontWeight: 700,
                          lineHeight: '32px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                      >
                        {banner.title}
                      </h3>
                      
                      {/* Collection Description */}
                      {banner.description && (
                        <p
                          className="text-white mb-8"
                          style={{
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: '22px',
                            fontFamily:
                              "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                            marginBottom: '32px',
                            textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                          }}
                          dangerouslySetInnerHTML={{ 
                            __html: typeof banner.description === 'string' 
                              ? banner.description 
                              : String(banner.description || '')
                          }}
                        />
                      )}

                      {/* CTA Button */}
                      <div
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200"
                        style={{
                          fontSize: '16px',
                          fontWeight: 500,
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        Handla nu
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Mobile Stack */}
          <div className="space-y-4">
            {displayBanners.slice(0, 2).map((banner) => (
              <Link
                key={banner.id}
                to={`/collections/${banner.handle}`}
                className="group block"
              >
                <div
                  className="relative overflow-hidden rounded-xl group-hover:shadow-lg transition-shadow duration-200"
                  style={{
                    height: '200px', // ✅ FIXED: Changed from 250px to 200px to match 1.75:1 ratio (~350×200)
                  }}
                >
                  {/* ✅ FIXED: All images use regular img tags - NO SHOPIFY IMAGE COMPONENT */}
                  {banner.bannerImage?.url ? (
                    <img
                      src={banner.bannerImage.url}
                      alt={banner.bannerImage.altText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : banner.image?.url ? (
                    <img
                      src={banner.image.url}
                      alt={banner.image.altText || banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    /* Fallback colored background */
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{backgroundColor: '#4CAF50'}}
                    >
                      <div className="text-white text-xs opacity-75">No Image</div>
                    </div>
                  )}

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="text-left">
                      {/* Collection Title */}
                      <h3
                        className="text-white font-bold mb-1"
                        style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          lineHeight: '24px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                      >
                        {banner.title}
                      </h3>
                      
                      {/* Collection Description */}
                      {banner.description && (
                        <p
                          className="text-white mb-6"
                          style={{
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '18px',
                            fontFamily:
                              "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                            textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                            marginBottom: '24px',
                          }}
                          dangerouslySetInnerHTML={{ 
                            __html: typeof banner.description === 'string' 
                              ? banner.description 
                              : String(banner.description || '')
                          }}
                        />
                      )}

                      {/* CTA Button */}
                      <div
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        Handla nu
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}