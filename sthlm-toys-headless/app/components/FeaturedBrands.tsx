import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useState} from 'react';

interface FeaturedBrand {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  metafields?: Array<{
    key: string;
    value: string;
  } | null> | null;
  image?: {
    id: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
}

interface FeaturedBrandsProps {
  brands?: FeaturedBrand[];
}

// Fallback brands for development/testing
const fallbackBrands: (FeaturedBrand & {
  backgroundColor: string;
  isNew?: boolean;
})[] = [
  {
    id: 'fallback-1',
    title: 'LEGO',
    handle: 'lego',
    description: 'Build your imagination',
    metafields: [
      {key: 'featured-brand', value: 'true'},
      {key: 'new-brand', value: 'true'},
    ],
    backgroundColor: '#FFCC00', // LEGO Yellow
    isNew: true,
    image: {
      id: 'fallback-img-1',
      url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      altText: 'LEGO Collection',
      width: 800,
      height: 600,
    },
  },
  {
    id: 'fallback-2',
    title: 'MATTEL',
    handle: 'mattel',
    description: 'Imaginative play experiences',
    metafields: [
      {key: 'featured-brand', value: 'true'},
      {key: 'new-brand', value: 'true'},
    ],
    backgroundColor: '#E4002B', // Mattel Red
    isNew: true,
    image: {
      id: 'fallback-img-2',
      url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      altText: 'MATTEL Toys',
      width: 800,
      height: 600,
    },
  },
  {
    id: 'fallback-3',
    title: 'HASBRO',
    handle: 'hasbro',
    description: 'Fun for everyone',
    metafields: [
      {key: 'featured-brand', value: 'true'},
      {key: 'new-brand', value: 'true'},
    ],
    backgroundColor: '#0076CE', // Hasbro Blue
    isNew: true,
    image: {
      id: 'fallback-img-3',
      url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      altText: 'HASBRO Games',
      width: 800,
      height: 600,
    },
  },
];

// Brand background colors (you can customize these or use metafields later)
const brandColors: Record<string, string> = {
  lego: '#FFCC00', // LEGO Yellow
  mattel: '#E4002B', // Mattel Red
  hasbro: '#0076CE', // Hasbro Blue
  playmobil: '#0066CC', // Playmobil Blue
  'fisher-price': '#FFA500', // Orange
  // Add more brand handles and their colors here
};

export function FeaturedBrands({brands}: FeaturedBrandsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  console.log('FeaturedBrands received brands:', brands);

  // Filter brands that have featured-brand metafield set to "true"
  const featuredBrands =
    brands && brands.length > 0
      ? brands.filter((brand) => {
          // Check for featured-brand metafield (try both hyphen and underscore)
          const featuredBrandValue =
            getMetafieldValue(brand.metafields, 'featured-brand') ||
            getMetafieldValue(brand.metafields, 'featured_brand');
          const isFeatured = isTrueValue(featuredBrandValue);

          console.log(`Brand ${brand.title}:`, {
            metafields: brand.metafields,
            metafieldDetails: brand.metafields?.map((m) =>
              m ? `${m.namespace}:${m.key} = ${m.value}` : 'null',
            ),
            featuredBrandValue,
            isFeatured,
            hasImage: !!brand.image?.url,
            imageUrl: brand.image?.url,
          });

          return isFeatured;
        })
      : [];

  console.log('Filtered featured brands:', featuredBrands);

  // Process Shopify brands or use fallback
  const displayBrands =
    featuredBrands.length > 0
      ? featuredBrands.map((brand, index) => ({
          ...brand,
          backgroundColor: brandColors[brand.handle] || '#6B7280', // Default gray
          isNew:
            isTrueValue(getMetafieldValue(brand.metafields, 'new-brand')) ||
            isTrueValue(getMetafieldValue(brand.metafields, 'new_brand')), // Check both versions
        }))
      : fallbackBrands;

  console.log('Final display brands:', displayBrands);

  const itemsPerPage = 3;
  const maxIndex = Math.max(
    0,
    Math.ceil(displayBrands.length / itemsPerPage) - 1,
  );

  const visibleBrands = displayBrands.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage,
  );

  const goToPrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : maxIndex);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex < maxIndex ? currentIndex + 1 : 0);
  };

  const showNavigation = displayBrands.length > itemsPerPage;

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
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        {/* Title */}
        <h2
          className="text-black font-medium mb-6"
          style={{
            fontSize: '24px',
            fontWeight: 500,
            lineHeight: '32.4px',
            marginBottom: '24px',
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
          }}
        >
          Handla efter varumärke
        </h2>
        {/* Brands Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{
            gap: '24px',
          }}
        >
          {visibleBrands.map((brand) => (
            <div
              key={brand.id}
              className="group relative overflow-hidden rounded-lg"
              style={{
                borderRadius: '12px',
                height: '520px',
              }}
            >
              {/* NY Badge */}
              {brand.isNew && (
                <div
                  className="absolute top-4 left-4 z-20 bg-white text-black font-bold px-3 py-1 rounded"
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  }}
                >
                  NY
                </div>
              )}

              <Link
                to={`/collections/${brand.handle}`}
                className="block h-full"
              >
                {/* Image Section (Top 60%) - Clean logo display */}
                <div
                  className="relative overflow-hidden flex items-center justify-center bg-white"
                  style={{height: '312px'}} // 60% of 520px
                >
                  {brand.image?.url ? (
                    <Image
                      data={{
                        id: brand.image.id,
                        url: brand.image.url,
                        altText: brand.image.altText || brand.title,
                        width: brand.image.width || 400,
                        height: brand.image.height || 400,
                      }}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      style={{
                        maxWidth: '80%',
                        maxHeight: '80%',
                      }}
                    />
                  ) : (
                    // Fallback if no image
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{backgroundColor: brand.backgroundColor}}
                    >
                      <span className="text-white text-2xl font-bold">
                        {brand.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section (Bottom 40%) - Clean solid background */}
                <div
                  className="flex flex-col justify-between p-6 text-white"
                  style={{
                    height: '208px', // 40% of 520px
                    backgroundColor: brand.backgroundColor,
                    padding: '32px 24px',
                  }}
                >
                  {/* Brand Content */}
                  <div>
                    {/* Brand Title */}
                    <h3
                      className="text-white font-bold mb-3"
                      style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        lineHeight: '33.6px',
                        fontFamily:
                          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        marginBottom: '12px',
                      }}
                    >
                      {brand.title}
                    </h3>

                    {/* Brand Description */}
                    {brand.description && (
                      <p
                        className="text-white mb-6"
                        style={{
                          fontSize: '16px',
                          fontWeight: 400,
                          lineHeight: '21.6px',
                          fontFamily:
                            "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          marginBottom: '24px',
                        }}
                      >
                        {brand.description}
                      </p>
                    )}
                  </div>

                  {/* Shop Now Button */}
                  <button
                    className="self-start border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors duration-200 rounded-full px-6 py-2"
                    style={{
                      fontSize: '16px',
                      fontWeight: 500,
                      fontFamily:
                        "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                      paddingLeft: '32px',
                      paddingRight: '32px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                    }}
                  >
                    Handla nu
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showNavigation && (
          <>
            {/* Previous Arrow */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 z-10"
              style={{
                marginLeft: '-20px',
                width: '48px',
                height: '48px',
              }}
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 z-10"
              style={{
                marginRight: '-20px',
                width: '48px',
                height: '48px',
              }}
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
