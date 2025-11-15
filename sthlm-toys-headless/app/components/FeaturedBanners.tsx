// FILE: app/components/FeaturedBanners.tsx
// ✅ METAOBJECTS: Now loads from metaobject instead of collection metafields
// ✅ PERFORMANCE OPTIMIZED: Better responsive images with proper srcset
// ✅ MAX 2 BANNERS: Only shows first 2 active entries
// ✅ FIXED: Using correct lowercase field keys

import {Link} from 'react-router';

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
}

interface CollectionWithBanner extends CollectionFragment {
  bannerImage?: {
    url: string | null;
    altText: string;
  };
}

interface FeaturedBannersProps {
  metaobjects: any[]; // Metaobject entries from Shopify
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

export function FeaturedBanners({metaobjects}: FeaturedBannersProps) {
  // ✅ DEBUG: Log metaobjects to see structure
  console.log('🎨 FeaturedBanners - Received metaobjects:', metaobjects);
  console.log('🎨 FeaturedBanners - First entry:', metaobjects?.[0]);
  console.log('🎨 FeaturedBanners - First entry fields:', JSON.stringify(metaobjects?.[0]?.fields, null, 2));

  // ✅ PERFORMANCE: Generate responsive image URLs with WebP format
  const getOptimizedImageUrl = (url: string, width: number): string => {
    if (!url) return url;
    // Check if it's a Shopify CDN URL
    if (!url.includes('cdn.shopify.com')) return url;
    
    const base = url.split('?')[0];
    return `${base}?width=${width}&format=webp`;
  };

  // ✅ PERFORMANCE: Generate srcset for responsive loading
  const getImageSrcSet = (url: string, sizes: number[]): string => {
    if (!url || !url.includes('cdn.shopify.com')) return '';
    
    const base = url.split('?')[0];
    return sizes
      .map(width => `${base}?width=${width}&format=webp ${width}w`)
      .join(', ');
  };

  // ✅ FIXED: Extract data from metaobject fields - prioritize reference over value for reference types
  const getFieldValue = (fields: any[], key: string): any => {
    const field = fields?.find((f: any) => f.key === key);
    // For reference types, return the reference object, not the GID string value
    return field?.reference || field?.value || null;
  };

  // ✅ FIXED: Process metaobjects into banner format with correct field keys
  const featuredBanners: CollectionWithBanner[] = metaobjects
    ?.slice(0, 2) // Only take first 2 entries (max 2 banners)
    ?.map((entry) => {
      const fields = entry.fields || [];
      console.log('🔍 Processing entry:', entry.id);
      console.log('🔍 Entry fields:', fields);
      
      // ✅ FIXED: Use lowercase 'kolekcija' instead of 'Kolekcija'
      const collection = getFieldValue(fields, 'kolekcija'); // Collection reference
      console.log('🔍 Collection found:', collection);
      
      // ✅ FIXED: Use lowercase 'banner_slika' 
      const bannerImageField = fields.find((f: any) => f.key === 'banner_slika');
      console.log('🔍 Banner image field:', bannerImageField);
      
      const bannerImage = bannerImageField?.reference?.image || null;
      console.log('🔍 Banner image:', bannerImage);
      
      return {
        id: entry.id,
        title: collection?.title || '',
        handle: collection?.handle || '',
        description: collection?.description || '',
        image: null,
        bannerImage: {
          url: bannerImage?.url || null,
          altText: `${collection?.title || 'Banner'} Banner`,
        },
      };
    })
    .filter((banner) => {
      const isValid = banner.handle && banner.bannerImage.url;
      console.log(`🔍 Banner ${banner.id} valid:`, isValid, {handle: banner.handle, hasImage: !!banner.bannerImage.url});
      return isValid;
    }) // Only show banners with both collection and image
    || [];

  console.log('✅ Final banners to display:', featuredBanners.length, featuredBanners);

  const displayBanners = featuredBanners.length > 0 ? featuredBanners : fallbackBanners;
  
  if (displayBanners.length === 0) return null;

  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-4">
            {displayBanners.slice(0, 2).map((banner) => {
              const imageUrl = banner.bannerImage?.url || banner.image?.url;
              const isShopifyImage = imageUrl && imageUrl.includes('cdn.shopify.com');

              return (
                <Link
                  key={banner.id}
                  to={`/collections/${banner.handle}`}
                  className="group block"
                >
                  <div
                    className="relative overflow-hidden rounded-2xl group-hover:shadow-lg transition-shadow duration-200"
                    style={{height: '400px'}}
                  >
                    {/* ✅ OPTIMIZED: Desktop images with explicit dimensions and srcset */}
                    {imageUrl ? (
                      isShopifyImage ? (
                        <img
                          src={getOptimizedImageUrl(imageUrl, 700)}
                          srcSet={getImageSrcSet(imageUrl, [400, 600, 700])}
                          sizes="(min-width: 1024px) 700px, 400px"
                          alt=""
                          role="presentation"
                          width="700"
                          height="400"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <img
                          src={imageUrl}
                          alt=""
                          role="presentation"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{backgroundColor: '#4CAF50'}}
                      >
                        <div className="text-white text-sm opacity-75">Ingen bild</div>
                      </div>
                    )}

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <div className="text-left">
                        <h3
                          className="text-white font-bold mb-2"
                          style={{
                            fontSize: '28px',
                            fontWeight: 700,
                            lineHeight: '32px',
                            fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                          }}
                        >
                          {banner.title}
                        </h3>
                        
                        {banner.description && (
                          <p
                            className="text-white mb-8"
                            style={{
                              fontSize: '16px',
                              fontWeight: 400,
                              lineHeight: '22px',
                              fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
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

                        <div
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200"
                          style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          }}
                        >
                          Handla nu
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="space-y-4">
            {displayBanners.slice(0, 2).map((banner) => {
              const imageUrl = banner.bannerImage?.url || banner.image?.url;
              const isShopifyImage = imageUrl && imageUrl.includes('cdn.shopify.com');

              return (
                <Link
                  key={banner.id}
                  to={`/collections/${banner.handle}`}
                  className="group block"
                >
                  <div
                    className="relative overflow-hidden rounded-xl group-hover:shadow-lg transition-shadow duration-200"
                    style={{height: '200px'}}
                  >
                    {/* ✅ OPTIMIZED: Mobile images with explicit dimensions and srcset */}
                    {imageUrl ? (
                      isShopifyImage ? (
                        <img
                          src={getOptimizedImageUrl(imageUrl, 400)}
                          srcSet={getImageSrcSet(imageUrl, [350, 400, 500])}
                          sizes="100vw"
                          alt=""
                          role="presentation"
                          width="400"
                          height="200"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <img
                          src={imageUrl}
                          alt=""
                          role="presentation"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{backgroundColor: '#4CAF50'}}
                      >
                        <div className="text-white text-xs opacity-75">Ingen bild</div>
                      </div>
                    )}

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <div className="text-left">
                        <h3
                          className="text-white font-bold mb-1"
                          style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            lineHeight: '24px',
                            fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                          }}
                        >
                          {banner.title}
                        </h3>
                        
                        {banner.description && (
                          <p
                            className="text-white mb-6"
                            style={{
                              fontSize: '14px',
                              fontWeight: 400,
                              lineHeight: '18px',
                              fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
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

                        <div
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          }}
                        >
                          Handla nu
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}