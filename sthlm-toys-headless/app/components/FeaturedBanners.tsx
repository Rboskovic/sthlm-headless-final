// app/components/FeaturedBanners.tsx - Fixed title consistency and CTA positioning
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

interface FeaturedBanner {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  metafields?: Array<{
    key: string;
    value: string;
    namespace?: string;
  } | null> | null;
  image?: {
    id: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
}

interface FeaturedBannersProps {
  collections?: FeaturedBanner[];
  title?: string;
}

// Fallback banners matching your current design
const fallbackBanners: (FeaturedBanner & {
  backgroundColor: string;
  buttonText?: string;
})[] = [
  {
    id: 'fallback-banner-1',
    title: 'MINECRAFT',
    handle: 'minecraft',
    description: 'Bygg din värld med oändliga möjligheter',
    metafields: [{key: 'featured-banner', value: 'true', namespace: 'custom'}],
    backgroundColor: '#4CAF50',
    buttonText: 'Handla nu',
    image: {
      id: 'fallback-banner-img-1',
      url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      altText: 'Minecraft Collection',
      width: 800,
      height: 400,
    },
  },
  {
    id: 'fallback-banner-2',
    title: 'SONIC THE HEDGEHOG',
    handle: 'sonic',
    description: 'Snabbhetens ultimata äventyr väntar',
    metafields: [{key: 'featured-banner', value: 'true', namespace: 'custom'}],
    backgroundColor: '#2196F3',
    buttonText: 'Handla nu',
    image: {
      id: 'fallback-banner-img-2',
      url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      altText: 'Sonic Collection',
      width: 800,
      height: 400,
    },
  },
];

export function FeaturedBanners({
  collections,
  title = 'Utvalda kollektioner',
}: FeaturedBannersProps) {
  // Helper function to get metafield value with proper null checks
  const getMetafieldValue = (
    metafields:
      | Array<{key: string; value: string; namespace?: string} | null>
      | null
      | undefined,
    key: string,
  ): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;

    const metafield = metafields.find((m) => m && m.key === key);
    return metafield ? metafield.value : null;
  };

  // Helper function to check if a value represents "true"
  const isTrueValue = (value: string | null): boolean => {
    if (!value) return false;
    const normalizedValue = value.toLowerCase().trim();
    return (
      normalizedValue === 'true' ||
      normalizedValue === '1' ||
      normalizedValue === 'yes'
    );
  };

  // Filter collections that have featured-banner metafield set to "true"
  const featuredBanners =
    collections && collections.length > 0
      ? collections.filter((collection) => {
          const featuredBannerValue =
            getMetafieldValue(collection.metafields, 'featured-banner') ||
            getMetafieldValue(collection.metafields, 'featured_banner') ||
            getMetafieldValue(collection.metafields, 'featuredBanner');

          const isFeatured = isTrueValue(featuredBannerValue);
          return isFeatured && collection.image?.url;
        })
      : [];

  // Use exactly 2 banners - either from Shopify data or fallback
  const displayBanners =
    featuredBanners.length >= 2 ? featuredBanners.slice(0, 2) : fallbackBanners;

  return (
    <section className="w-full bg-white">
      {/* Container matching header width */}
      <div
        className="mx-auto relative"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '32px',
          paddingBottom: '64px',
        }}
      >
        {/* Title - Made consistent with other titles as requested */}
        <h2
          className="text-black font-medium mb-6"
          style={{
            // Same as other component titles (reduced font size)
            fontSize: '22px', // Consistent with ShopByBrand
            fontWeight: 500,
            lineHeight: '29.7px',
            marginBottom: '24px',
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
          }}
        >
          {title}
        </h2>

        {/* Banners Grid - 2 columns */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          style={{gap: '24px'}}
        >
          {displayBanners.map((banner) => {
            // Get background color from metafield or use fallback
            const backgroundColor =
              'backgroundColor' in banner
                ? banner.backgroundColor
                : getMetafieldValue(banner.metafields, 'background-color') ||
                  '#4CAF50';

            const buttonText =
              'buttonText' in banner
                ? banner.buttonText
                : getMetafieldValue(banner.metafields, 'button-text') ||
                  'Handla nu';

            return (
              <Link
                key={banner.id}
                to={`/collections/${banner.handle}`}
                className="group relative overflow-hidden rounded-lg block"
                style={{
                  borderRadius: '12px',
                  aspectRatio: '5/3', // Landscape aspect ratio
                  backgroundColor,
                }}
              >
                {/* Background Image */}
                {banner.image?.url && (
                  <div className="absolute inset-0">
                    <Image
                      data={{
                        url: banner.image.url,
                        altText: banner.image.altText || banner.title,
                        width: banner.image.width || 800,
                        height: banner.image.height || 400,
                      }}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content Overlay - Moved down and CTA aligned to bottom */}
                <div className="absolute inset-0 flex flex-col justify-end items-start p-8 text-white">
                  {/* Title moved down by reducing top spacing */}
                  <h3
                    className="font-bold mb-2 text-white"
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      lineHeight: '32.4px',
                      fontFamily:
                        "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {banner.title}
                  </h3>

                  {banner.description && (
                    <p
                      className="mb-4 text-white/90"
                      style={{
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '21.6px',
                        fontFamily:
                          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      {banner.description}
                    </p>
                  )}

                  {/* CTA Button - Now at bottom with consistent styling */}
                  <span
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg group-hover:bg-blue-800 transition-colors duration-200"
                    style={{
                      fontSize: '16px', // Consistent with other CTA buttons
                      fontWeight: 600,
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      lineHeight: '21.6px',
                      borderRadius: '8px', // Consistent rounded corners
                      color: 'white', // Explicit white text
                    }}
                  >
                    {buttonText}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Layout Adjustments */}
        <style jsx={true}>{`
          @media (max-width: 768px) {
            .grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .group {
              aspect-ratio: 3/2;
            }

            .absolute .p-8 {
              padding: 24px;
            }

            h3 {
              font-size: 20px !important;
              line-height: 27px !important;
            }

            p {
              font-size: 14px !important;
              line-height: 18.9px !important;
            }

            h2 {
              font-size: 18px !important;
              line-height: 24.3px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
