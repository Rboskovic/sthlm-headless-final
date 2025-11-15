// FILE: app/components/TopCategories.tsx
// ✅ METAOBJECTS: Now loads from metaobject instead of collection metafields
// ✅ DYNAMIC TITLE: Section title comes from metaobject "ime" field
// ✅ PERFORMANCE OPTIMIZED: Better responsive images
// ✅ FIXED: Proper reference/value ordering in getFieldValue

import {Link} from 'react-router';
import {useState, useRef} from 'react';

// ✅ TYPESCRIPT FIX: Create proper interface
interface CollectionFragment {
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

interface CategoryWithColor extends CollectionFragment {
  backgroundColor?: string;
}

interface TopCategoriesProps {
  metaobjects: any[]; // Metaobject entries from Shopify
}

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

export function TopCategories({metaobjects}: TopCategoriesProps) {
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
    ? getFieldValue(activeEntry.fields, 'ime') || 'Shoppa efter tema'
    : 'Shoppa efter tema';

  // Extract collections from "kolekcija" field
  const themes: CollectionFragment[] = activeEntry
    ? (getFieldValue(activeEntry.fields, 'kolekcija') || [])
    : [];

  const shopifyThemes = themes.length > 0 ? themes : [];
  
  const displayCategories: CategoryWithColor[] =
    shopifyThemes.length > 0 ? shopifyThemes : fallbackCategories;

  const visibleCategories = displayCategories.slice(0, 6);

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
          paddingTop: '8px',
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
                to="/themes"
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
                    <img
                      src={getOptimizedImageUrl(category.image.url, 192)}
                      srcSet={generateSrcSet(category.image.url, 192)}
                      sizes="192px"
                      alt={category.image.altText || category.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          category.backgroundColor || categoryColors['default'],
                      }}
                    >
                      <span className="text-white text-lg font-medium">
                        {category.title}
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
                  {category.title}
                </h3>
              </Link>
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
                      <img
                        src={getOptimizedImageUrl(category.image.url, 144)}
                        srcSet={generateSrcSet(category.image.url, 144)}
                        sizes="144px"
                        alt={category.image.altText || category.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            category.backgroundColor || categoryColors['default'],
                        }}
                      >
                        <span className="text-white text-sm font-medium">
                          {category.title}
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
                    {category.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Link
              to="/themes"
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