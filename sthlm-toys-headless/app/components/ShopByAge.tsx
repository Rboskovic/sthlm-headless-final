import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';
import type {CollectionFragment} from 'storefrontapi.generated';

// Age-based colors for the fallback placeholders
const ageColors: Record<string, string> = {
  'alder-1-5': '#A8E6CF',   // Light mint green
  'alder-13': '#C8B5E8',    // Light purple  
  'alder-4': '#F5C99B',     // Light orange/peach
  'alder-6': '#A8C8EC',     // Light blue
  'alder-9': '#F5B2C4',     // Light pink
  'placeholder': '#E5E7EB', // Light gray for placeholders
  'default': '#6B7280',
};

// Fallback age groups for testing with placeholders
const fallbackAgeGroups = [
  {
    id: 'age-1',
    title: 'Ålder 1,5+',
    handle: 'alder-1-5',
    image: {url: '', altText: 'Ålder 1,5+'},
    backgroundColor: ageColors['alder-1-5'],
  },
  {
    id: 'age-2',
    title: 'Ålder 13+', 
    handle: 'alder-13',
    image: {url: '', altText: 'Ålder 13+'},
    backgroundColor: ageColors['alder-13'],
  },
  {
    id: 'age-3',
    title: 'Ålder 4+',
    handle: 'alder-4', 
    image: {url: '', altText: 'Ålder 4+'},
    backgroundColor: ageColors['alder-4'],
  },
  {
    id: 'age-4',
    title: 'Ålder 6+',
    handle: 'alder-6',
    image: {url: '', altText: 'Ålder 6+'},
    backgroundColor: ageColors['alder-6'],
  },
  {
    id: 'age-5',
    title: 'Ålder 9+',
    handle: 'alder-9',
    image: {url: '', altText: 'Ålder 9+'},
    backgroundColor: ageColors['alder-9'],
  },
  {
    id: 'age-placeholder',
    title: 'Kommer snart',
    handle: '#',
    image: {url: '', altText: 'Kommer snart'},
    backgroundColor: ageColors['placeholder'],
  },
];

interface AgeGroupWithColor extends CollectionFragment {
  backgroundColor?: string;
}

interface ShopByBrandProps {
  brands: CollectionFragment[];
}

export function ShopByAge({brands}: ShopByBrandProps) {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  
  // ✅ FIXED: Improved drag detection with threshold
  const [isDragging, setIsDragging] = useState(false);
  const [hasActuallyDragged, setHasActuallyDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Drag threshold in pixels - only disable pointer events after this distance
  const DRAG_THRESHOLD = 10;

  // Helper function to extract metafield values (NAMESPACE-AWARE LIKE TOPCATEGORIES)
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string}> | null,
    key: string,
  ): string | null => {
    if (!metafields) return null;
    // Check both custom and app namespaces like TopCategories does
    const metafield = metafields.find((m) => 
      m && 
      m.key === key && 
      (m.namespace === 'custom' || m.namespace === 'app')
    );
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

  // Filter featured age groups from Shopify data (IMPROVED FILTERING + SORTING)
  const featuredAgeGroups =
    brands && brands.length > 0
      ? brands.filter((brand) => {
          // Check all possible metafield variations like TopCategories does
          const featuredBrandValue =
            getMetafieldValue(brand.metafields, 'featured-brand') ||
            getMetafieldValue(brand.metafields, 'featured_brand');
          const isFeatured = isTrueValue(featuredBrandValue);
          
          // DEBUG: Log each collection for troubleshooting (can be disabled)
          const DEBUG_LOGS = false; // Set to false to disable logs
          if (DEBUG_LOGS) {
            console.log(`🔍 Age Collection: ${brand.title}`, {
              metafields: brand.metafields,
              featuredBrandValue,
              isFeatured,
              hasImage: !!brand.image?.url
            });
          }
          
          return isFeatured; // Don't require image like TopCategories does
        })
        .sort((a, b) => {
          // Sort by sort_order metafield (underscore, not hyphen), then alphabetically as fallback
          const sortOrderA = parseInt(getMetafieldValue(a.metafields, 'sort_order') || '999');
          const sortOrderB = parseInt(getMetafieldValue(b.metafields, 'sort_order') || '999');
          
          if (sortOrderA !== sortOrderB) {
            return sortOrderA - sortOrderB; // Numeric sort
          }
          
          // Fallback to alphabetical if no sort_order
          return a.title.localeCompare(b.title);
        })
      : [];

  // Combine Shopify age groups with placeholders to always show 6 items
  const shopifyAgeGroups = featuredAgeGroups.length > 0 ? featuredAgeGroups : [];
  const placeholdersNeeded = Math.max(0, 6 - shopifyAgeGroups.length);
  
  const displayAgeGroups: AgeGroupWithColor[] = [
    ...shopifyAgeGroups,
    ...fallbackAgeGroups.slice(-placeholdersNeeded), // Add placeholders from end
  ].slice(0, 6); // Ensure exactly 6 items

  // Desktop: Show all 6 age groups (no scrolling/pagination)
  const visibleAgeGroups = displayAgeGroups;

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
          paddingTop: '16px',
          paddingBottom: '1px',
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Header with ONLY centered title - NO shop all button */}
          <div className="flex items-center justify-center mb-8">
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
              Hitta rätt LEGO® för varje ålder
            </h2>
          </div>

          {/* Desktop Grid */}
          <div className="grid grid-cols-6 gap-6">
            {visibleAgeGroups.map((ageGroup) => (
              <div key={ageGroup.id} className="text-center">
                {ageGroup.handle === '#' ? (
                  // Placeholder - not clickable
                  <div className="cursor-default">
                    <div
                      className="relative overflow-hidden mb-4 opacity-50"
                      style={{
                        width: '192px',
                        height: '192px',
                        borderRadius: '12px',
                      }}
                    >
                      {ageGroup.image?.url ? (
                        <Image
                          data={ageGroup.image}
                          className="w-full h-full object-cover"
                          sizes="192px"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            backgroundColor: ageGroup.backgroundColor || ageColors['placeholder'],
                          }}
                        >
                          <span className="text-gray-600 text-lg font-medium">
                            {ageGroup.title}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3
                      className="text-gray-500 font-medium leading-tight"
                      style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        fontFamily:
                          "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        maxWidth: '192px',
                      }}
                    >
                      {ageGroup.title}
                    </h3>
                  </div>
                ) : (
                  // Active age group - clickable
                  <Link
                    to={`/collections/${ageGroup.handle}`}
                    className="group"
                  >
                    <div
                      className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200 mb-4"
                      style={{
                        width: '192px',
                        height: '192px',
                        borderRadius: '12px',
                      }}
                    >
                      {ageGroup.image?.url ? (
                        <Image
                          data={ageGroup.image}
                          className="w-full h-full object-cover"
                          sizes="192px"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            backgroundColor: ageGroup.backgroundColor || ageColors['default'],
                          }}
                        >
                          <span className="text-white text-lg font-medium">
                            {ageGroup.title}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3
                      className="text-black font-medium leading-tight"
                      style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        fontFamily:
                          "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        color: 'rgb(33, 36, 39)',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        maxWidth: '192px',
                      }}
                    >
                      {ageGroup.title}
                    </h3>
                  </Link>
                )}
              </div>
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
            Hitta rätt LEGO® för varje ålder
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
                .mobile-age-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div
              className="flex space-x-2 mobile-age-scroll"
              style={{
                paddingLeft: '12px',
                paddingRight: '0px',
                width: 'max-content',
              }}
            >
              {displayAgeGroups.map((ageGroup) => (
                <div
                  key={ageGroup.id}
                  className="flex-shrink-0"
                  style={{
                    scrollSnapAlign: 'start',
                  }}
                >
                  {ageGroup.handle === '#' ? (
                    // Placeholder - not clickable
                    <div
                      className="cursor-default"
                      style={{
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        className="relative overflow-hidden opacity-50"
                        style={{
                          width: '144px',
                          height: '144px',
                          borderRadius: '12px',
                        }}
                      >
                        {ageGroup.image?.url ? (
                          <Image
                            data={ageGroup.image}
                            className="w-full h-full object-cover"
                            sizes="144px"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              backgroundColor: ageGroup.backgroundColor || ageColors['placeholder'],
                            }}
                          >
                            <span className="text-gray-600 text-sm font-medium">
                              {ageGroup.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Mobile Age Group Title */}
                      <h3
                        className="text-gray-500 font-medium leading-tight mt-2"
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '18px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          whiteSpace: 'normal',
                          textAlign: 'center',
                          maxWidth: '144px',
                        }}
                      >
                        {ageGroup.title}
                      </h3>
                    </div>
                  ) : (
                    // Active age group - clickable
                    <Link
                      to={`/collections/${ageGroup.handle}`}
                      className="group"
                      style={{
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
                        {ageGroup.image?.url ? (
                          <Image
                            data={ageGroup.image}
                            className="w-full h-full object-cover"
                            sizes="144px"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              backgroundColor: ageGroup.backgroundColor || ageColors['default'],
                            }}
                          >
                            <span className="text-white text-sm font-medium">
                              {ageGroup.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Mobile Age Group Title */}
                      <h3
                        className="text-black font-medium leading-tight mt-2"
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '18px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          color: 'rgb(33, 36, 39)',
                          whiteSpace: 'normal',
                          textAlign: 'center',
                          maxWidth: '144px',
                        }}
                      >
                        {ageGroup.title}
                      </h3>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* NO mobile shop all button - removed completely */}
        </div>
      </div>
    </section>
  );
}