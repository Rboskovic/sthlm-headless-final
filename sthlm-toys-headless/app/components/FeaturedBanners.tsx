// app/components/FeaturedBanners.tsx - ✅ SHOPIFY STANDARD: Updated to use ShopButton consistently
import {ShopButton} from '~/components/ui/ShopButton';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ShopButton} from '~/components/ui/ShopButton';

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
          if (!collection?.metafields) return false;
          const featuredValue = getMetafieldValue(
            collection.metafields,
            'featured-banner',
          );
          return isTrueValue(featuredValue);
        })
      : fallbackBanners;

  if (!featuredBanners || featuredBanners.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full bg-white"
      style={{paddingTop: '48px', paddingBottom: '48px'}}
    >
      <div
        className="mx-auto"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
        }}
      >
        {/* Section Title */}
        <h2
          className="font-bold text-gray-900 mb-8"
          style={{
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '43.2px',
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
          }}
        >
          {title}
        </h2>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredBanners.map((banner) => {
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
              <div
                key={banner.id}
                className="group relative overflow-hidden rounded-lg"
                style={{
                  borderRadius: '12px',
                  aspectRatio: '5/3',
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

                {/* Content Overlay - Using flex for proper CTA positioning */}
                <div className="absolute inset-0 flex flex-col justify-end items-start p-8 text-white">
                  <div className="mb-4">
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
                  </div>

                  {/* ✅ FIXED: CTA Button using ShopButton */}
                  <Link to={`/collections/${banner.handle}`}>
                    <ShopButton 
                      variant="cta" 
                      size="md"
                      className="group-hover:scale-105 transition-transform duration-200"
                    >
                      {buttonText}
                    </ShopButton>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}