import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface TopCategoriesProps {
  collections?: Collection[] | null;
}

interface CategoryWithColor extends Collection {
  backgroundColor?: string;
}

// Category color mapping for fallbacks (matching popular categories)
const categoryColors: Record<string, string> = {
  lego: '#FFEB3B',
  barbie: '#E91E63',
  cars: '#F44336',
  dolls: '#E91E63',
  puzzles: '#4CAF50',
  games: '#2196F3',
  outdoor: '#4CAF50',
  crafts: '#FF9800',
};

// Fallback categories (popular toy categories)
const fallbackCategories: CategoryWithColor[] = [
  {
    id: 'lego',
    title: 'LEGO',
    handle: 'lego',
    backgroundColor: '#FFEB3B',
    image: null,
  },
  {
    id: 'barbie',
    title: 'Dockor',
    handle: 'barbie',
    backgroundColor: '#E91E63',
    image: null,
  },
  {
    id: 'cars',
    title: 'Bilar',
    handle: 'cars',
    backgroundColor: '#F44336',
    image: null,
  },
  {
    id: 'puzzles',
    title: 'Pussel',
    handle: 'puzzles',
    backgroundColor: '#4CAF50',
    image: null,
  },
  {
    id: 'games',
    title: 'Spel',
    handle: 'games',
    backgroundColor: '#2196F3',
    image: null,
  },
  {
    id: 'crafts',
    title: 'Pyssel',
    handle: 'crafts',
    backgroundColor: '#FF9800',
    image: null,
  },
];

export function TopCategories({collections}: TopCategoriesProps) {
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

  // Filter featured categories from Shopify data
  const featuredCategories =
    collections && collections.length > 0
      ? collections.filter((category) => {
          const featuredCategoryValue =
            getMetafieldValue(category.metafields, 'featured-category') ||
            getMetafieldValue(category.metafields, 'featured_category');
          const isFeatured = isTrueValue(featuredCategoryValue);
          return isFeatured && category.image?.url;
        })
      : [];

  // Use Shopify categories or fallback
  const displayCategories: CategoryWithColor[] =
    featuredCategories.length > 0 ? featuredCategories : fallbackCategories;

  // Desktop: Show only first 6 categories (no scrolling/pagination)
  const visibleCategories = displayCategories.slice(0, 6);

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
                Populära kategorier
              </h2>
            </div>

            <div className="flex-1 flex justify-end items-center">
              <Link
                to="/collections"
                style={{
                  fontFamily:
                    'Buenos Aires, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif',
                  fontSize: 'clamp(14px, 1.5vw, 18px)',
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
                  border: '0px none rgb(0, 78, 188)',
                  margin: '0px',
                  padding: '0px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:opacity-80"
              >
                Visa alla kategorier
              </Link>
            </div>
          </div>

          {/* Desktop Categories Grid - No Navigation */}
          <div className="relative">
            <div className="grid grid-cols-6 gap-2 md:gap-3 lg:gap-4 justify-center">
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/collections/${category.handle}`}
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
                    {category.image?.url ? (
                      <Image
                        data={category.image}
                        alt={category.image.altText || category.title}
                        style={{
                          height: '200px',
                          width: '200px',
                          overflow: 'clip',
                          cursor: 'pointer',
                          boxSizing: 'content-box',
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="180px"
                        loading="eager"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            category.backgroundColor ||
                            categoryColors[category.handle] ||
                            '#6B7280',
                        }}
                      >
                        <span
                          className="text-white font-bold text-center px-2"
                          style={{
                            fontSize: 'clamp(14px, 1.5vw, 18px)',
                            fontWeight: 700,
                            lineHeight: '24px',
                            fontFamily:
                              "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          }}
                        >
                          {category.title}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Category Name - Desktop */}
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
                        maxWidth: '180px',
                      }}
                    >
                      {category.title}
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
            Populära kategorier
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
                .mobile-category-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div
              className="flex space-x-2 mobile-category-scroll"
              style={{
                paddingLeft: '12px',
                paddingRight: '0px',
                width: 'max-content',
              }}
            >
              {displayCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/collections/${category.handle}`}
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
                    {category.image?.url ? (
                      <Image
                        data={category.image}
                        alt={category.image.altText || category.title}
                        className="w-full h-full object-cover"
                        sizes="144px"
                        loading="eager"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            category.backgroundColor ||
                            categoryColors[category.handle] ||
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
                          {category.title}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Category Name - Mobile */}
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
                      {category.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Shop All Categories Button - Slightly bigger with proper spacing */}
          <div className="flex justify-center">
            <Link
              to="/collections"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-full transition-colors duration-200"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                fontFamily:
                  "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'white',
              }}
            >
              Visa alla kategorier
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
