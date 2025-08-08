import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

// Brand colors matching the Smyths theme
const brandColors: Record<string, string> = {
  'lego': '#FFD700',
  'barbie': '#FF69B4', 
  'playmobil': '#4169E1',
  'nerf': '#FF4500',
  'pokemon': '#FFFF00',
  'disney': '#1E90FF',
  'marvel': '#FF0000',
  'star-wars': '#000000',
  'default': '#6B7280',
};

// Fallback static brands for testing  
const fallbackBrands = [
  {
    id: 'brand-1',
    title: 'LEGO',
    handle: 'lego',
    image: {url: '', altText: 'LEGO'},
    backgroundColor: brandColors['lego'],
  },
  {
    id: 'brand-2',
    title: 'Barbie', 
    handle: 'barbie',
    image: {url: '', altText: 'Barbie'},
    backgroundColor: brandColors['barbie'],
  },
  {
    id: 'brand-3',
    title: 'Playmobil',
    handle: 'playmobil', 
    image: {url: '', altText: 'Playmobil'},
    backgroundColor: brandColors['playmobil'],
  },
  {
    id: 'brand-4',
    title: 'Nerf',
    handle: 'nerf',
    image: {url: '', altText: 'Nerf'},
    backgroundColor: brandColors['nerf'],
  },
  {
    id: 'brand-5',
    title: 'Pokemon',
    handle: 'pokemon',
    image: {url: '', altText: 'Pokemon'},
    backgroundColor: brandColors['pokemon'],
  },
  {
    id: 'brand-6',
    title: 'Disney',
    handle: 'disney',
    image: {url: '', altText: 'Disney'},
    backgroundColor: brandColors['disney'],
  },
];

interface BrandWithColor extends FeaturedCollectionFragment {
  backgroundColor?: string;
}

interface ShopByBrandProps {
  brands: FeaturedCollectionFragment[];
}

export function ShopByBrand({brands}: ShopByBrandProps) {
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
                Handla efter märke
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              <Link
                to="/collections/brands"
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
                Handla alla märken
              </Link>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="grid grid-cols-6 gap-6">
            {visibleBrands.map((brand) => (
              <Link
                key={brand.id}
                to={`/collections/${brand.handle}`}
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
                  {brand.image?.url ? (
                    <Image
                      data={brand.image}
                      alt={brand.image.altText || brand.title}
                      className="w-full h-full object-cover"
                      sizes="192px"
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
                  {brand.title}
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
            Handla efter märke
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