import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface ShopByDiscountProps {
  discounts?: Collection[] | null;
}

interface DiscountWithColor extends Collection {
  backgroundColor?: string;
}

// Discount color mapping for fallbacks (matching discount themes)
const discountColors: Record<string, string> = {
  'summer-sale': '#FF5722',
  'under-20': '#4CAF50',
  'clearance': '#E91E63',
  'black-friday': '#212121',
  'holiday-deals': '#F44336',
  'weekly-offers': '#2196F3',
};

// Fallback discounts (popular discount categories)
const fallbackDiscounts: DiscountWithColor[] = [
  {
    id: 'summer-sale',
    title: 'Sommarera',
    handle: 'summer-sale',
    backgroundColor: '#FF5722',
    image: null,
  },
  {
    id: 'under-20',
    title: 'Under €20',
    handle: 'under-20',
    backgroundColor: '#4CAF50',
    image: null,
  },
  {
    id: 'clearance',
    title: 'Rensning',
    handle: 'clearance',
    backgroundColor: '#E91E63',
    image: null,
  },
  {
    id: 'weekly-offers',
    title: 'Veckans erbjudanden',
    handle: 'weekly-offers',
    backgroundColor: '#2196F3',
    image: null,
  },
  {
    id: 'holiday-deals',
    title: 'Semesterrea',
    handle: 'holiday-deals',
    backgroundColor: '#F44336',
    image: null,
  },
  {
    id: 'black-friday',
    title: 'Black Friday',
    handle: 'black-friday',
    backgroundColor: '#212121',
    image: null,
  },
];

export function ShopByDiscount({discounts}: ShopByDiscountProps) {
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

  // Filter featured discounts from Shopify data
  const featuredDiscounts =
    discounts && discounts.length > 0
      ? discounts.filter((discount) => {
          const featuredDiscountValue =
            getMetafieldValue(discount.metafields, 'featured-discount') ||
            getMetafieldValue(discount.metafields, 'featured_discount');
          const isFeatured = isTrueValue(featuredDiscountValue);
          return isFeatured && discount.image?.url;
        })
      : [];

  // Use Shopify discounts or fallback
  const displayDiscounts: DiscountWithColor[] =
    featuredDiscounts.length > 0 ? featuredDiscounts : fallbackDiscounts;

  // Desktop: Show only first 6 discounts (no scrolling/pagination)
  const visibleDiscounts = displayDiscounts.slice(0, 6);

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
                className="text-black font-bold text-center"
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  lineHeight: '36px',
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              >
                Handla på rea
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              <Link
                to="/collections/rea"
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
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
                Handla alla erbjudanden
              </Link>
            </div>
          </div>

          {/* Desktop Discounts Grid - No Navigation */}
          <div className="relative">
            <div className="grid grid-cols-6 gap-4 justify-center">
              {visibleDiscounts.map((discount) => (
                <Link
                  key={discount.id}
                  to={`/collections/${discount.handle}`}
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
                    {discount.image?.url ? (
                      <Image
                        data={discount.image}
                        alt={discount.image.altText || discount.title}
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
                            discount.backgroundColor ||
                            discountColors[discount.handle] ||
                            '#6B7280',
                        }}
                      >
                        <span
                          className="text-white font-bold text-center px-2"
                          style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            lineHeight: '20px',
                            fontFamily:
                              "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          }}
                        >
                          {discount.title}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Mobile Header */}
          <div className="text-center mb-6">
            <h2
              className="text-black font-bold"
              style={{
                fontSize: '24px',
                fontWeight: 700,
                lineHeight: '32.4px',
                fontFamily:
                  "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
            >
              Handla på rea
            </h2>
          </div>

          {/* Mobile Scrollable Container */}
          <div
            ref={mobileScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{
              paddingLeft: '8px',
              paddingRight: '8px',
              scrollSnapType: 'x mandatory',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            {displayDiscounts.map((discount) => (
              <Link
                key={discount.id}
                to={`/collections/${discount.handle}`}
                className="group block flex-shrink-0"
                style={{scrollSnapAlign: 'start'}}
              >
                <div
                  className="relative overflow-hidden group-hover:shadow-lg transition-shadow duration-200"
                  style={{
                    width: '144px',
                    height: '144px',
                    borderRadius: '12px',
                  }}
                >
                  {discount.image?.url ? (
                    <Image
                      data={discount.image}
                      alt={discount.image.altText || discount.title}
                      style={{
                        height: '144px',
                        width: '144px',
                        overflow: 'clip',
                        cursor: 'pointer',
                        boxSizing: 'content-box',
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="144px"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          discount.backgroundColor ||
                          discountColors[discount.handle] ||
                          '#6B7280',
                      }}
                    >
                      <span
                        className="text-white font-bold text-center px-2"
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          lineHeight: '18px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        {discount.title}
                      </span>
                    </div>
                  )}
                </div>
                {/* Discount Name - Mobile */}
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
                    {discount.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Shop All Discounts Button */}
          <div className="flex justify-center mt-6">
            <Link
              to="/collections/rea"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-full transition-colors duration-200"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                fontFamily:
                  "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'white',
              }}
            >
              Handla alla erbjudanden
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
