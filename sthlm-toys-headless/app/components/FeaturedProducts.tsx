// FILE: app/components/FeaturedProducts.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Final fixes - mobile buttons, styled links, animations

import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { Star } from 'lucide-react';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import type { ProductFragment } from 'storefrontapi.generated';

interface FeaturedProductsProps {
  products: ProductFragment[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  className?: string;
}

export function FeaturedProducts({
  products,
  title = "Utvalda Produkter",
  subtitle,
  showViewAll = true,
  className = "",
}: FeaturedProductsProps) {
  // Early return if no products
  if (!products?.length) {
    console.log('⚠️ FeaturedProducts: No products provided');
    return null;
  }

  // Mobile scroll handling (same pattern as your other components)
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [hasActuallyDragged, setHasActuallyDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mobileScrollRef.current) return;
    setIsDragging(true);
    setHasActuallyDragged(false);
    setDragStart({
      x: e.pageX - mobileScrollRef.current.offsetLeft,
      scrollLeft: mobileScrollRef.current.scrollLeft,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mobileScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - mobileScrollRef.current.offsetLeft;
    const walk = (x - dragStart.x) * 2;
    const newScrollLeft = dragStart.scrollLeft - walk;
    
    if (Math.abs(walk) > 5) {
      setHasActuallyDragged(true);
    }
    
    mobileScrollRef.current.scrollLeft = newScrollLeft;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setTimeout(() => setHasActuallyDragged(false), 100);
  };

  // Show first 4 products on desktop, all on mobile scroll
  const displayProducts = products.slice(0, Math.max(4, products.length));

  return (
    <section className={className}>
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
          {/* Header with badge, title and Shop All link */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              {/* Featured Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                  Utvalda
                </span>
              </div>
            </div>
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
                {title}
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              {showViewAll && (
                <Link
                  to="/collections/featured-homepage-products"
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
                  Visa alla utvalda
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Grid - 4 products max */}
          <div className="grid grid-cols-4 gap-6">
            {displayProducts.slice(0, 4).map((product) => (
              <FeaturedProductCard
                key={product.id}
                product={product}
                variant="desktop"
              />
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
            {title}
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
                .mobile-featured-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div
              className="flex space-x-3 mobile-featured-scroll"
              style={{
                paddingLeft: '12px',
                paddingRight: '12px',
                width: 'max-content',
              }}
            >
              {displayProducts.map((product) => (
                <FeaturedProductCard
                  key={product.id}
                  product={product}
                  variant="mobile"
                  hasActuallyDragged={hasActuallyDragged}
                />
              ))}
            </div>
          </div>

          {/* Mobile Shop All Link */}
          {showViewAll && (
            <div className="text-center">
              <Link
                to="/collections/featured-homepage-products"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 !text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                style={{
                  fontSize: '16px',
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              >
                Visa alla utvalda
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Product Card Component
function FeaturedProductCard({
  product,
  variant,
  hasActuallyDragged = false,
}: {
  product: ProductFragment;
  variant: 'desktop' | 'mobile';
  hasActuallyDragged?: boolean;
}) {
  const { open } = useAside();
  const firstVariant = product.selectedOrFirstAvailableVariant;
  const isOnSale = firstVariant?.compareAtPrice && 
    parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount);

  const [isAdding, setIsAdding] = useState(false);

  const cardStyle = variant === 'desktop' 
    ? { width: '100%', minHeight: '420px' } // Increased for button space
    : { width: '200px', flexShrink: 0, scrollSnapAlign: 'start' as const, minHeight: '350px' }; // Increased mobile size

  const handleAddToCart = () => {
    setIsAdding(true);
    // Add animation feedback
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div
      className="group block"
      style={{
        ...cardStyle,
        pointerEvents: hasActuallyDragged ? 'none' : 'auto',
      }}
    >
      {/* ✅ FIXED: Flexbox layout for consistent card heights + Loading animation */}
      <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden group-hover:shadow-lg transition-all duration-200 h-full flex flex-col ${isAdding ? 'scale-105 shadow-xl' : ''}`}>
        {/* ✅ FIXED: Only image wrapped in Link - NOT the entire card */}
        <Link to={`/products/${product.handle}`} className="relative aspect-square bg-gray-50 flex-shrink-0 block">
          {firstVariant?.image?.url ? (
            <Image
              data={firstVariant.image}
              aspectRatio="1/1"
              sizes={variant === 'desktop' ? "(min-width: 768px) 25vw, 50vw" : "200px"}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
              style={{
                padding: '8px',
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Ingen bild</span>
            </div>
          )}

          {/* Featured Badge */}
          <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            Utvalda
          </div>

          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Rea
            </div>
          )}
        </Link>

        {/* ✅ FIXED: Product Info with flex-grow to fill remaining space */}
        <div className="p-4 flex flex-col flex-grow">
          {/* ✅ FIXED: Only title wrapped in Link */}
          <Link to={`/products/${product.handle}`}>
            <h3 
              className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
              style={{
                fontSize: variant === 'desktop' ? '16px' : '14px',
                lineHeight: variant === 'desktop' ? '20px' : '18px',
                fontFamily:
                  "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
            >
              {product.title}
            </h3>
          </Link>

          {/* Price */}
          {firstVariant?.price && (
            <div className="flex items-center gap-2 mb-3">
              <Money 
                data={firstVariant.price}
                className="font-semibold text-gray-900"
                style={{
                  fontSize: variant === 'desktop' ? '16px' : '14px',
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              />
              {isOnSale && firstVariant.compareAtPrice && (
                <Money 
                  data={firstVariant.compareAtPrice}
                  className="text-sm text-gray-500 line-through"
                />
              )}
            </div>
          )}

          {/* ✅ FIXED: Spacer to push button to bottom */}
          <div className="flex-grow"></div>

          {/* ✅ FIXED: Add to Cart Button - SEPARATE from Link */}
          {firstVariant && (
            <AddToCartButton
              disabled={!firstVariant.availableForSale}
              onClick={() => {
                handleAddToCart();
                open('cart');
              }}
              lines={[
                {
                  merchandiseId: firstVariant.id,
                  quantity: 1,
                },
              ]}
              analytics={{
                products: [
                  {
                    productGid: product.id,
                    variantGid: firstVariant.id,
                    name: product.title,
                    variantName: firstVariant.title || product.title,
                    brand: product.vendor,
                    price: firstVariant.price.amount,
                    quantity: 1,
                  },
                ],
              }}
              variant="addToCart"
              size={variant === 'desktop' ? 'md' : 'sm'}
              className="w-full"
            >
              {firstVariant.availableForSale ? 'Lägg i varukorg' : 'Slutsåld'}
            </AddToCartButton>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton component
export function FeaturedProductsSkeleton() {
  return (
    <section>
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
        {/* Desktop Skeleton */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="h-5 w-20 bg-gray-200 rounded mb-4"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="h-10 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex justify-end">
              <div className="h-12 w-36 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden h-96">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
                  <div className="flex-grow"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="block md:hidden">
          <div className="h-7 w-48 bg-gray-200 rounded mx-auto mb-6"></div>
          <div className="flex space-x-3 overflow-x-hidden pb-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-48 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3 flex flex-col">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 mb-3"></div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}