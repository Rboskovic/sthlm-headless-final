// FILE: app/components/ShopByDiscount.tsx
// ✅ METAOBJECTS: Now loads from metaobject instead of collection metafields
// ✅ DYNAMIC TITLE: Section title comes from metaobject "ime" field
// ✅ PERFORMANCE OPTIMIZED: Better responsive images
// ✅ FIXED: Proper reference/value ordering in getFieldValue

import {Link} from 'react-router';
import {useState, useRef} from 'react';

// ✅ TYPESCRIPT FIX: Local interface matching the structure we need
interface DiscountCollection {
  id: string;
  title: string;
  handle: string;
  image?: {
    id?: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  } | null;
}

interface ShopByDiscountProps {
  metaobjects: any[]; // Metaobject entries from Shopify
  variant?: 'homepage' | 'collection';
}

// ✅ TYPESCRIPT FIX: Local interface for price ranges with color
interface PriceRangeWithColor {
  id: string;
  title: string;
  handle: string;
  image?: {
    id?: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  } | null;
  backgroundColor?: string;
}

// Price range color mapping for fallbacks
const priceColors: Record<string, string> = {
  'under-100': '#4CAF50',
  'under-250': '#2196F3',
  'under-500': '#FF9800',
  'under-1000': '#9C27B0',
  'over-1000': '#607D8B',
  'best-value': '#F44336',
};

// ✅ TYPESCRIPT FIX: Fallback price ranges with proper typing
const fallbackPriceRanges: PriceRangeWithColor[] = [
  {
    id: 'under-100',
    title: 'Under 100kr',
    handle: 'under-100',
    backgroundColor: priceColors['under-100'],
    image: null,
  },
  {
    id: 'under-250',
    title: 'Under 250kr',
    handle: 'under-250',
    backgroundColor: priceColors['under-250'],
    image: null,
  },
  {
    id: 'under-500',
    title: 'Under 500kr',
    handle: 'under-500',
    backgroundColor: priceColors['under-500'],
    image: null,
  },
  {
    id: 'under-1000',
    title: 'Under 1000kr',
    handle: 'under-1000',
    backgroundColor: priceColors['under-1000'],
    image: null,
  },
  {
    id: 'best-value',
    title: 'Bästa värde',
    handle: 'best-value',
    backgroundColor: priceColors['best-value'],
    image: null,
  },
  {
    id: 'over-1000',
    title: 'Premium',
    handle: 'over-1000',
    backgroundColor: priceColors['over-1000'],
    image: null,
  },
];

// ✅ PERFORMANCE: Helper functions for responsive images
const getOptimizedImageUrl = (url: string, width: number): string => {
  if (!url) return url;
  return url.includes('?') 
    ? url.split('?')[0] + `?width=${width}` 
    : `${url}?width=${width}`;
};

const generateSrcSet = (url: string, displaySize: number): string => {
  if (!url) return '';
  const baseUrl = url.split('?')[0];
  return [
    `${baseUrl}?width=${displaySize} ${displaySize}w`,
    `${baseUrl}?width=${displaySize * 2} ${displaySize * 2}w`,
  ].join(', ');
};

export function ShopByDiscount({
  metaobjects,
  variant = 'homepage',
}: ShopByDiscountProps) {
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
    ? getFieldValue(activeEntry.fields, 'ime') || 'Handla efter pris'
    : 'Handla efter pris';

  // Extract collections from "kolekcija" field
  const discounts: DiscountCollection[] = activeEntry
    ? (getFieldValue(activeEntry.fields, 'kolekcija') || [])
    : [];

  const shopifyDiscounts = discounts.length > 0 ? discounts : [];

  const displayPriceRanges: PriceRangeWithColor[] =
    shopifyDiscounts.length > 0 
      ? shopifyDiscounts.map((range): PriceRangeWithColor => ({
          id: range.id,
          title: range.title,
          handle: range.handle,
          image: range.image,
          backgroundColor: priceColors[range.handle] || priceColors['under-100'],
        }))
      : fallbackPriceRanges;

  const visiblePriceRanges = displayPriceRanges.slice(0, 6);

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
          ...(variant === 'collection'
            ? {paddingTop: '8px', paddingBottom: '8x'}
            : {paddingTop: '8px', paddingBottom: '8px'}),
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
                to="/handla-efter-pris"
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
            {visiblePriceRanges.map((priceRange) => (
              <Link
                key={priceRange.id}
                to={`/collections/${priceRange.handle}`}
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
                  {priceRange.image?.url ? (
                    <img
                      src={getOptimizedImageUrl(priceRange.image.url, 192)}
                      srcSet={generateSrcSet(priceRange.image.url, 192)}
                      sizes="192px"
                      alt={priceRange.image.altText || priceRange.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          priceRange.backgroundColor || priceColors['under-100'],
                      }}
                    >
                      <span className="text-white text-lg font-medium">
                        {priceRange.title}
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
                  {priceRange.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {variant === 'homepage' && (
            <div className="text-center mb-6">
              <h2
                className="text-black font-bold"
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: '28px',
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              >
                {sectionTitle}
              </h2>
            </div>
          )}

          <div
            ref={mobileScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            style={{
              paddingLeft: '8px',
              paddingRight: '8px',
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
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {displayPriceRanges.map((priceRange) => (
              <Link
                key={priceRange.id}
                to={`/collections/${priceRange.handle}`}
                className="group block flex-shrink-0"
                style={{
                  scrollSnapAlign: 'start',
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
                  {priceRange.image?.url ? (
                    <img
                      src={getOptimizedImageUrl(priceRange.image.url, 144)}
                      srcSet={generateSrcSet(priceRange.image.url, 144)}
                      sizes="144px"
                      alt={priceRange.image.altText || priceRange.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          priceRange.backgroundColor || priceColors['under-100'],
                      }}
                    >
                      <span className="text-white text-sm font-medium">
                        {priceRange.title}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <h3
                    className="text-black font-medium leading-tight"
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
                    {priceRange.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <Link
              to="/handla-efter-pris"
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