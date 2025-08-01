import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface ShopByBrandProps {
  brands?: Collection[] | null;
}

interface BrandWithColor extends Collection {
  backgroundColor?: string;
}

// Brand color mapping for fallbacks (matching Smyths design)
const brandColors: Record<string, string> = {
  'toys-r-us': '#0066CC',
  barbie: '#E91E63',
  lego: '#FFEB3B',
  disney: '#1976D2',
  'fisher-price': '#00BCD4',
  crayola: '#FFC107',
  minecraft: '#4CAF50',
  sonic: '#2196F3',
};

// Fallback brands (matching Smyths exactly)
const fallbackBrands: BrandWithColor[] = [
  {
    id: 'toys-r-us',
    title: 'Toys"R"Us',
    handle: 'toys-r-us',
    backgroundColor: '#4CAF50',
    image: null,
  },
  {
    id: 'barbie',
    title: 'Barbie',
    handle: 'barbie',
    backgroundColor: '#E91E63',
    image: null,
  },
  {
    id: 'lego',
    title: 'LEGO',
    handle: 'lego',
    backgroundColor: '#FFC107',
    image: null,
  },
  {
    id: 'disney',
    title: 'Disney',
    handle: 'disney',
    backgroundColor: '#1976D2',
    image: null,
  },
  {
    id: 'fisher-price',
    title: 'Fisher-Price',
    handle: 'fisher-price',
    backgroundColor: '#00BCD4',
    image: null,
  },
  {
    id: 'crayola',
    title: 'Crayola',
    handle: 'crayola',
    backgroundColor: '#FFC107',
    image: null,
  },
];

export function ShopByBrand({brands}: ShopByBrandProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Helper function to get metafield value
  const getMetafieldValue = (metafields: any, key: string): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;
    const metafield = metafields.find((field: any) => field?.key === key);
    return metafield?.value ? metafield.value : null;
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

  // Filter featured brands from Shopify data
  const featuredBrands =
    brands && brands.length > 0
      ? brands.filter((brand) => {
          const featuredBrandValue =
            getMetafieldValue(brand.metafields, 'featured-brand') ||
            getMetafieldValue(brand.metafields, 'featured_brand');
          const isFeatured = isTrueValue(featuredBrandValue);
          return isFeatured && brand.image?.url;
        })
      : [];

  // Use Shopify brands or fallback
  const displayBrands: BrandWithColor[] =
    featuredBrands.length > 0 ? featuredBrands : fallbackBrands;

  // Desktop: Show only first 6 brands (no scrolling/pagination)
  const visibleBrands = displayBrands.slice(0, 6);

  // Mouse drag handlers for mobile scroll container
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mobileScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - mobileScrollRef.current.offsetLeft);
    setScrollLeft(mobileScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mobileScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - mobileScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    mobileScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="w-full bg-white">
      {/* Container matching Smyths layout */}
      <div
        className="mx-auto relative"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '64px',
          paddingBottom: '32px',
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Header with centered title and right-aligned Shop All link */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <h2
                style={{
                  fontFamily:
                    'Buenos Aires, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif',
                  fontSize: '35px',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontWeight: 600,
                  letterSpacing: 'normal',
                  lineHeight: 'normal',
                  textDecoration: 'none solid rgb(33, 36, 39)',
                  textAlign: 'center',
                  textIndent: '0px',
                  textTransform: 'none',
                  verticalAlign: 'baseline',
                  whiteSpace: 'normal',
                  wordSpacing: '0px',
                  color: 'rgb(33, 36, 39)',
                  border: '0px none rgb(33, 36, 39)',
                  margin: '0px',
                  padding: '0px',
                }}
              >
                Handla efter märke
              </h2>
            </div>

            <div className="flex-1 flex justify-end items-center">
              <Link
                to="/collections/brands"
                style={{
                  fontFamily:
                    'Buenos Aires, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontWeight: 600,
                  letterSpacing: 'normal',
                  lineHeight: 'normal',
                  textDecoration: 'underline solid rgb(0, 78, 188)',
                  textAlign: 'right',
                  textIndent: '0px',
                  textTransform: 'none',
                  verticalAlign: 'baseline',
                  whiteSpace: 'normal',
                  wordSpacing: '0px',
                  color: 'rgb(0, 78, 188)',
                  border: '0px none rgb(33, 36, 39)',
                  margin: '0px',
                  padding: '0px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:opacity-80"
              >
                Handla alla märken
              </Link>
            </div>
          </div>

          {/* Desktop Brands Grid - No Navigation */}
          <div className="relative">
            <div className="grid grid-cols-6 gap-4 justify-center">
              {visibleBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/collections/${brand.handle}`}
                  className="group block"
                >
                  <div
                    className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '12px',
                    }}
                  >
                    {brand.image?.url ? (
                      <Image
                        data={brand.image}
                        alt={brand.image.altText || brand.title}
                        style={{
                          height: '200px',
                          width: '200px',
                          overflow: 'clip',
                          cursor: 'pointer',
                          boxSizing: 'content-box',
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="200px"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            brand.backgroundColor ||
                            brandColors[brand.handle] ||
                            '#6B7280',
                        }}
                      >
                        <span
                          className="text-white font-bold text-center px-2"
                          style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            lineHeight: '24px',
                            fontFamily:
                              "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          }}
                        >
                          {brand.title}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Brand Name - Desktop */}
                  <div className="mt-3 text-center">
                    <h3
                      className="text-black font-medium group-hover:text-blue-600 transition-colors duration-200"
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '18.9px',
                        fontFamily:
                          "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        wordWrap: 'break-word',
                        hyphens: 'auto',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        maxWidth: '200px',
                      }}
                    >
                      {brand.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Mobile Title */}
          <h2
            className="text-black font-semibold text-center mb-8"
            style={{
              fontSize: '30px',
              fontWeight: 600,
              lineHeight: 'normal',
              fontFamily:
                "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            Handla efter märke
          </h2>

          {/* Mobile Horizontal Scroll - Left padding, right edge-to-edge */}
          <div
            ref={mobileScrollRef}
            className="overflow-x-auto mb-8 pb-2 -ml-3"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            <style>
              {`
                .mobile-brand-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div
              className="flex space-x-2 mobile-brand-scroll"
              style={{
                paddingLeft: '12px',
                paddingRight: '0px',
                width: 'max-content',
              }}
            >
              {displayBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/collections/${brand.handle}`}
                  className="group flex-shrink-0"
                  style={{
                    scrollSnapAlign: 'start',
                    pointerEvents: isDragging ? 'none' : 'auto',
                  }}
                >
                  <div
                    className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200"
                    style={{
                      width: '144px',
                      height: '144px',
                      borderRadius: '12px',
                    }}
                  >
                    {brand.image?.url ? (
                      <Image
                        data={brand.image}
                        alt={brand.image.altText || brand.title}
                        className="w-full h-full object-cover"
                        sizes="144px"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            brand.backgroundColor ||
                            brandColors[brand.handle] ||
                            '#6B7280',
                        }}
                      >
                        <span
                          className="text-white font-bold text-center px-2"
                          style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            lineHeight: '19px',
                            fontFamily:
                              "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          }}
                        >
                          {brand.title}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Brand Name - Mobile */}
                  <div className="mt-2 text-center px-1">
                    <h3
                      className="text-black font-medium group-hover:text-blue-600 transition-colors duration-200"
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: '16.2px',
                        fontFamily:
                          "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        wordWrap: 'break-word',
                        hyphens: 'auto',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        maxWidth: '144px',
                      }}
                    >
                      {brand.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Shop All Brands Button - Slightly bigger with proper spacing */}
          <div className="flex justify-center">
            <Link
              to="/collections/brands"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-full transition-colors duration-200"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                fontFamily:
                  "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'white',
              }}
            >
              Handla alla märken
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
