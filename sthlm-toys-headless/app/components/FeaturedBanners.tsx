import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

interface FeaturedBannersProps {
  collections: FeaturedCollectionFragment[];
}

// Fallback banners for testing/development
const fallbackBanners = [
  {
    id: 'fallback-1',
    title: 'MINECRAFT',
    handle: 'minecraft',
    description: 'Bygg din värld med oändliga möjligheter',
    image: {
      id: 'fallback-img-1',
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
      id: 'fallback-img-2',
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      altText: 'Sonic Collection', 
      width: 800,
      height: 400,
    },
  },
];

export function FeaturedBanners({collections}: FeaturedBannersProps) {
  // Helper function to extract metafield values (same pattern as other components)
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string}> | null,
    key: string,
  ): string | null => {
    if (!metafields) return null;
    const metafield = metafields.find((m) => m && m.key === key);
    return metafield ? metafield.value : null;
  };

  // Helper function to check if a value represents "true" (same as other components)
  const isTrueValue = (value: string | null): boolean => {
    if (!value) return false;
    const normalizedValue = value.toLowerCase().trim();
    return (
      normalizedValue === 'true' ||
      normalizedValue === '1' ||
      normalizedValue === 'yes'
    );
  };

  // Filter featured banners from Shopify data (same pattern as other components)
  const featuredBanners =
    collections && collections.length > 0
      ? collections.filter((collection) => {
          const featuredBannerValue =
            getMetafieldValue(collection.metafields, 'featured-banner') ||
            getMetafieldValue(collection.metafields, 'featured_banner');
          const isFeatured = isTrueValue(featuredBannerValue);
          return isFeatured;
        })
      : [];

  // Use Shopify banners or fallback
  const displayBanners = featuredBanners.length > 0 ? featuredBanners : fallbackBanners;

  return (
    <section className="w-full bg-white">
      {/* Container matching other sections */}
      <div
        className="mx-auto relative"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '16px', // Reduced from 32px to bring closer to age section
          paddingBottom: '16px',
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* REMOVED: Header with title - no title anymore for closer spacing */}

          {/* Desktop Grid - 2 columns for banners */}
          <div className="grid grid-cols-2 gap-6">
            {displayBanners.slice(0, 2).map((banner) => (
              <Link
                key={banner.id}
                to={`/collections/${banner.handle}`}
                className="group block"
              >
                <div
                  className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200"
                  style={{
                    height: '280px',
                    borderRadius: '12px',
                  }}
                >
                  {/* Banner Image */}
                  {banner.image?.url ? (
                    <>
                      <Image
                        data={banner.image}
                        alt={banner.image.altText || banner.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(min-width: 768px) 50vw, 100vw"
                        loading="lazy"
                      />
                      {/* TEMPORARILY REMOVED: Dark overlay for debugging */}
                      {/* <div className="absolute inset-0 bg-black bg-opacity-30" /> */}
                    </>
                  ) : (
                    /* Fallback colored background */
                    <>
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{backgroundColor: '#4CAF50'}}
                      >
                        <div className="text-white text-sm opacity-75">No Image</div>
                      </div>
                    </>
                  )}

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="text-left">
                      {/* Collection Title */}
                      <h3
                        className="text-black font-bold mb-2 bg-white bg-opacity-90 px-2 py-1 rounded"
                        style={{
                          fontSize: '28px',
                          fontWeight: 700,
                          lineHeight: '32px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        {banner.title}
                      </h3>
                      
                      {/* Collection Description */}
                      {banner.description && (
                        <p
                          className="text-black mb-8 bg-white bg-opacity-90 px-2 py-1 rounded"
                          style={{
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: '22px',
                            fontFamily:
                              "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                            marginBottom: '32px',
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
          {/* REMOVED: Mobile Title - no title anymore */}

          {/* Mobile Stack */}
          <div className="space-y-4">
            {displayBanners.slice(0, 2).map((banner) => (
              <Link
                key={banner.id}
                to={`/collections/${banner.handle}`}
                className="group block"
              >
                <div
                  className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200"
                  style={{
                    height: '200px',
                    borderRadius: '12px',
                  }}
                >
                  {/* Banner Image */}
                  {banner.image?.url ? (
                    <>
                      <Image
                        data={banner.image}
                        alt={banner.image.altText || banner.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="100vw"
                        loading="lazy"
                      />
                      {/* TEMPORARILY REMOVED: Dark overlay for debugging */}
                      {/* <div className="absolute inset-0 bg-black bg-opacity-30" /> */}
                    </>
                  ) : (
                    /* Fallback colored background */
                    <>
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{backgroundColor: '#4CAF50'}}
                      >
                        <div className="text-white text-xs opacity-75">No Image</div>
                      </div>
                    </>
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