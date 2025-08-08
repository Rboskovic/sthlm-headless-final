import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

// Category colors matching the Smyths theme
const categoryColors: Record<string, string> = {
  'leksaker': '#FF6B6B',
  'pussel': '#4ECDC4', 
  'brädspel': '#45B7D1',
  'utomhusleksaker': '#96CEB4',
  'babyleksaker': '#FFEAA7',
  'kreativt': '#DDA0DD',
  'fordon': '#98D8C8',
  'actionfigurer': '#F7DC6F',
  'dockor': '#F8C471',
  'default': '#6B7280',
};

// Fallback static categories for testing
const fallbackCategories = [
  {
    id: 'cat-1',
    title: 'Leksaker',
    handle: 'leksaker',
    image: {url: '', altText: 'Leksaker'},
    backgroundColor: categoryColors['leksaker'],
  },
  {
    id: 'cat-2', 
    title: 'Pussel',
    handle: 'pussel',
    image: {url: '', altText: 'Pussel'},
    backgroundColor: categoryColors['pussel'],
  },
  {
    id: 'cat-3',
    title: 'Brädspel',
    handle: 'bradspel',
    image: {url: '', altText: 'Brädspel'},
    backgroundColor: categoryColors['brädspel'],
  },
  {
    id: 'cat-4',
    title: 'Utomhusleksaker',
    handle: 'utomhusleksaker',
    image: {url: '', altText: 'Utomhusleksaker'},
    backgroundColor: categoryColors['utomhusleksaker'],
  },
  {
    id: 'cat-5',
    title: 'Babyleksaker',
    handle: 'babyleksaker',
    image: {url: '', altText: 'Babyleksaker'},
    backgroundColor: categoryColors['babyleksaker'],
  },
  {
    id: 'cat-6',
    title: 'Kreativt',
    handle: 'kreativt',
    image: {url: '', altText: 'Kreativt'},
    backgroundColor: categoryColors['kreativt'],
  },
];

interface CategoryWithColor extends FeaturedCollectionFragment {
  backgroundColor?: string;
}

interface TopCategoriesProps {
  collections: FeaturedCollectionFragment[];
}

export function TopCategories({collections}: TopCategoriesProps) {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  
  // ✅ FIXED: Improved drag detection with threshold
  const [isDragging, setIsDragging] = useState(false);
  const [hasActuallyDragged, setHasActuallyDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Drag threshold in pixels - only disable pointer events after this distance
  const DRAG_THRESHOLD = 10;

  // Helper function to extract metafield values
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string}> | null,
    key: string,
  ): string | null => {
    if (!metafields) return null;
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

  // ✅ FIXED: Improved mouse drag handlers with threshold
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mobileScrollRef.current) return;
    setIsDragging(true);
    setHasActuallyDragged(false); // Reset the actual drag flag
    setStartX(e.pageX - mobileScrollRef.current.offsetLeft);
    setScrollLeft(mobileScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mobileScrollRef.current) return;
    e.preventDefault();
    
    const x = e.pageX - mobileScrollRef.current.offsetLeft;
    const dragDistance = Math.abs(x - startX);
    
    // Only set hasActuallyDragged after threshold is exceeded
    if (dragDistance > DRAG_THRESHOLD) {
      setHasActuallyDragged(true);
      const walk = (x - startX) * 2; // Scroll speed multiplier
      mobileScrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setHasActuallyDragged(false);
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
          paddingTop: '32px',
          paddingBottom: '16px',
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Header with centered title and right-aligned Shop All link */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <h2
                className="text-black font-semibold"
                style={{
                  fontSize: '36px',
                  fontWeight: 600,
                  lineHeight: '42px',
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: 'rgb(33, 36, 39)',
                  textAlign: 'center',
                }}
              >
                Handla efter kategori
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              <Link
                to="/collections"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: '#3B82F6',
                  textDecoration: 'none',
                  alignSelf: 'center',
                }}
              >
                Visa alla kategorier
              </Link>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="grid grid-cols-6 gap-6">
            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                to={`/collections/${category.handle}`}
                className="group text-center"
              >
                <div
                  className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200 mb-4"
                  style={{
                    width: '192px',
                    height: '192px',
                    borderRadius: '12px',
                  }}
                >
                  {category.image?.url ? (
                    <Image
                      data={category.image}
                      alt={category.image.altText || category.title}
                      className="w-full h-full object-cover"
                      sizes="192px"
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
                          fontSize: '18px',
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
                <h3
                  className="text-black font-medium group-hover:text-blue-600 transition-colors duration-200"
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontFamily:
                      "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  {category.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Mobile Title */}
          <h2
            className="text-black font-semibold text-center mb-6"
            style={{
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: '28px',
              fontFamily:
                "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              color: 'rgb(33, 36, 39)',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            Handla efter kategori
          </h2>

          {/* Mobile Horizontal Scroll Container */}
          <div
            ref={mobileScrollRef}
            className="overflow-x-auto mb-6 pb-2"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
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
                    // ✅ FIXED: Only disable pointer events when actually dragging
                    pointerEvents: hasActuallyDragged ? 'none' : 'auto',
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