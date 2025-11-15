// FILE: app/components/ShopByAge.tsx
// ✅ METAOBJECTS: Now loads from metaobject instead of collection metafields
// ✅ DYNAMIC TITLE: Section title comes from metaobject "ime" field
// ✅ PERFORMANCE OPTIMIZED: Better responsive images
// ✅ FIXED: Proper reference/value ordering in getFieldValue

import {Link} from 'react-router';
import {useState, useRef} from 'react';

// ✅ TYPESCRIPT FIX: Create proper interface with metafields
interface CollectionFragment {
  id: string;
  title: string;
  handle: string;
  image?: {
    url: string;
    altText?: string;
  } | null;
}

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

interface ShopByAgeProps {
  metaobjects: any[]; // Metaobject entries from Shopify
}

// ✅ PERFORMANCE: Helper function to generate responsive image URLs
const getOptimizedImageUrl = (url: string, width: number): string => {
  if (!url) return url;
  return url.includes('?') 
    ? url.split('?')[0] + `?width=${width}` 
    : `${url}?width=${width}`;
};

// ✅ PERFORMANCE: Generate srcset for responsive images
const generateSrcSet = (url: string, displaySize: number): string => {
  if (!url) return '';
  const baseUrl = url.split('?')[0];
  return [
    `${baseUrl}?width=${displaySize} ${displaySize}w`,
    `${baseUrl}?width=${displaySize * 2} ${displaySize * 2}w`,
  ].join(', ');
};

export function ShopByAge({metaobjects}: ShopByAgeProps) {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [hasActuallyDragged, setHasActuallyDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const DRAG_THRESHOLD = 10;

  // ✅ FIXED: Extract data from metaobject - prioritize reference/references over value
  const getFieldValue = (fields: any[], key: string): any => {
    const field = fields?.find((f: any) => f.key === key);
    // For reference types, return the dereferenced object/array, not the GID string value
    return field?.references?.nodes || field?.reference || field?.value || null;
  };

  // Get the FIRST active metaobject entry
  const activeEntry = metaobjects?.[0];
  
  // ✅ DYNAMIC: Extract section title from "ime" field
  const sectionTitle = activeEntry 
    ? getFieldValue(activeEntry.fields, 'ime') || 'Handla efter ålder'
    : 'Handla efter ålder';

  // Extract collections from "kolekcija" field
  const brands: CollectionFragment[] = activeEntry
    ? (getFieldValue(activeEntry.fields, 'kolekcija') || [])
    : [];

  const shopifyAgeGroups = brands.length > 0 ? brands : [];
  const placeholdersNeeded = Math.max(0, 6 - shopifyAgeGroups.length);
  
  const displayAgeGroups: AgeGroupWithColor[] = [
    ...shopifyAgeGroups,
    ...fallbackAgeGroups.slice(-placeholdersNeeded),
  ].slice(0, 6);

  const visibleAgeGroups = displayAgeGroups;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mobileScrollRef.current) return;
    setIsDragging(true);
    setHasActuallyDragged(false);
    setStartX(e.pageX - mobileScrollRef.current.offsetLeft);
    setScrollLeft(mobileScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mobileScrollRef.current) return;
    e.preventDefault();
    
    const x = e.pageX - mobileScrollRef.current.offsetLeft;
    const dragDistance = Math.abs(x - startX);
    
    if (dragDistance > DRAG_THRESHOLD) {
      setHasActuallyDragged(true);
      const walk = (x - startX) * 2;
      mobileScrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setHasActuallyDragged(false);
  };

  return (
    <section className="w-full bg-white">
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
                {sectionTitle}
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              <Link
                to="/ages"
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
                Visa alla
              </Link>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="grid grid-cols-6 gap-6">
            {visibleAgeGroups.map((ageGroup) => (
              <div key={ageGroup.id} className="text-center">
                {ageGroup.handle === '#' ? (
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
                        <img
                          src={getOptimizedImageUrl(ageGroup.image.url, 192)}
                          srcSet={generateSrcSet(ageGroup.image.url, 192)}
                          sizes="192px"
                          alt={ageGroup.image.altText || ageGroup.title}
                          className="w-full h-full object-cover"
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
                        <img
                          src={getOptimizedImageUrl(ageGroup.image.url, 192)}
                          srcSet={generateSrcSet(ageGroup.image.url, 192)}
                          sizes="192px"
                          alt={ageGroup.image.altText || ageGroup.title}
                          className="w-full h-full object-cover"
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
            {sectionTitle}
          </h2>

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
                          <img
                            src={getOptimizedImageUrl(ageGroup.image.url, 144)}
                            srcSet={generateSrcSet(ageGroup.image.url, 144)}
                            sizes="144px"
                            alt={ageGroup.image.altText || ageGroup.title}
                            className="w-full h-full object-cover"
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
                    <Link
                      to={`/collections/${ageGroup.handle}`}
                      className="group"
                      style={{
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
                          <img
                            src={getOptimizedImageUrl(ageGroup.image.url, 144)}
                            srcSet={generateSrcSet(ageGroup.image.url, 144)}
                            sizes="144px"
                            alt={ageGroup.image.altText || ageGroup.title}
                            className="w-full h-full object-cover"
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

          <div className="flex justify-center mt-4">
            <Link
              to="/ages"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-full transition-colors duration-200"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                fontFamily:
                  "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'white',
              }}
            >
              Visa alla
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}