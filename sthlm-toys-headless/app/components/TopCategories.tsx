import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface TopCategoriesProps {
  collections?: Collection[] | null;
  variant?: 'homepage' | 'collection';
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

export function TopCategories({
  collections,
  variant = 'homepage',
}: TopCategoriesProps) {
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
    featuredCategories.length > 0
      ? featuredCategories.map((category) => ({
          ...category,
          backgroundColor:
            categoryColors[category.handle.toLowerCase()] || '#6B7280',
        }))
      : fallbackCategories;

  // Mobile drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mobileScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - mobileScrollRef.current.offsetLeft);
    setScrollLeft(mobileScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mobileScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - mobileScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    mobileScrollRef.current.scrollLeft = scrollLeft - walk;
  };

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
          ...(variant === 'collection'
            ? {paddingTop: '32px', paddingBottom: '32px'}
            : {paddingTop: '64px', paddingBottom: '64px'}),
        }}
      >
        {/* Title and View All - Only show on homepage */}
        {variant === 'homepage' && (
          <div
            className="flex justify-between items-center mb-6"
            style={{
              marginBottom: '24px',
            }}
          >
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
                to="/collections/toys"
                style={{
                  fontFamily:
                    'Buenos Aires, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontWeight: 600,
                  letterSpacing: 'normal',
                  lineHeight: 'normal',
                  textDecoration: 'underline solid rgb(33, 36, 39)',
                  textAlign: 'center',
                  textIndent: '0px',
                  textTransform: 'none',
                  verticalAlign: 'baseline',
                  whiteSpace: 'normal',
                  wordSpacing: '0px',
                  color: 'rgb(33, 36, 39)',
                  border: '0px none rgb(33, 36, 39)',
                  margin: '0px 0px 0px 12px',
                  padding: '0px',
                  cursor: 'pointer',
                }}
              >
                Visa alla kategorier
              </Link>
            </div>
          </div>
        )}

        {/* Desktop Categories Grid */}
        <div className="hidden md:block">
          <div
            className="grid grid-cols-6 gap-6"
            style={{
              gap: '24px',
            }}
          >
            {displayCategories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/collections/${category.handle}`}
                className="group block"
              >
                <div
                  className="relative rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
                  style={{
                    width: '192px',
                    height: '144px',
                    borderRadius: '12px',
                  }}
                >
                  {/* Category Image or Colored Background */}
                  {category.image?.url ? (
                    <Image
                      data={category.image}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor: category.backgroundColor || '#6B7280',
                      }}
                    >
                      <span
                        className="text-white text-center font-medium px-2"
                        style={{
                          fontSize: '16px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        {category.title}
                      </span>
                    </div>
                  )}

                  {/* Category Name Overlay for Images */}
                  {category.image?.url && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <span
                        className="text-white text-center font-medium px-2"
                        style={{
                          fontSize: '16px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        {category.title}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Categories - Horizontal Scroll */}
        <div className="md:hidden">
          <div
            ref={mobileScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 cursor-grab"
            style={{
              gap: '12px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {displayCategories.map((category) => (
              <Link
                key={category.id}
                to={`/collections/${category.handle}`}
                className="group flex-shrink-0"
                style={{minWidth: '144px'}}
              >
                <div
                  className="relative rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
                  style={{
                    width: '144px',
                    height: '108px',
                    borderRadius: '12px',
                  }}
                >
                  {/* Category Image or Colored Background */}
                  {category.image?.url ? (
                    <Image
                      data={category.image}
                      className="w-full h-full object-cover"
                      sizes="144px"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor: category.backgroundColor || '#6B7280',
                      }}
                    >
                      <span
                        className="text-white text-center font-medium px-2"
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '18px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        {category.title}
                      </span>
                    </div>
                  )}

                  {/* Category Name Overlay for Images */}
                  {category.image?.url && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <span
                        className="text-white text-center font-medium px-2"
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '18px',
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

          {/* Mobile Shop All Categories Button - Only show on homepage */}
          {variant === 'homepage' && (
            <div className="flex justify-center">
              <Link
                to="/collections/toys"
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
          )}
        </div>
      </div>
    </section>
  );
}
