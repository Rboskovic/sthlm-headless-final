// FILE: app/components/SaleProducts.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Final fixes - mobile buttons, styled links, animations

import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { Percent, Clock } from 'lucide-react';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import type { ProductFragment } from 'storefrontapi.generated';

interface SaleProductsProps {
  products: ProductFragment[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  showTimer?: boolean;
  className?: string;
}

export function SaleProducts({
  products,
  title = "Rea Produkter",
  subtitle,
  showViewAll = true,
  showTimer = false,
  className = "",
}: SaleProductsProps) {
  // Early return if no products
  if (!products?.length) {
    console.log('⚠️ SaleProducts: No products provided');
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

  // Count products with actual discounts
  const productsOnSale = products.filter(product => {
    const variant = product.selectedOrFirstAvailableVariant;
    return variant?.compareAtPrice && 
           parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount);
  });

  return (
    <section className={className}>
      {/* Sale Background - Subtle gradient */}
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
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
                {/* Sale Badge and Timer */}
                <div className="flex items-center gap-2 mb-4">
                  <Percent className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-bold text-red-600 uppercase tracking-wide">
                    Rea
                  </span>
                  <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                    UPP TILL 50% RABATT
                  </div>
                  {showTimer && (
                    <div className="flex items-center gap-2 text-sm text-red-700 ml-4">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Rean slutar om 3 dagar</span>
                    </div>
                  )}
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
                    to="/collections/alla-erbjudanden"
                    className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                    style={{
                      fontSize: '16px',
                      fontFamily:
                        "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    }}
                  >
                    Visa alla rea
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            {/* Desktop Grid - 4 products max */}
            <div className="grid grid-cols-4 gap-6">
              {displayProducts.slice(0, 4).map((product) => (
                <SaleProductCard
                  key={product.id}
                  product={product}
                  variant="desktop"
                />
              ))}
            </div>

            {/* Sale Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{products.length} rea produkter</span>
              </div>
              {productsOnSale.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>{productsOnSale.length} med rabatt</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden">
            {/* Mobile Title with Sale Badge */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Percent className="h-4 w-4 text-red-600" />
                <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                  Rea
                </span>
                <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  UPP TILL 50% RABATT
                </div>
              </div>
              <h2
                className="text-black font-semibold"
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: '28px',
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: 'rgb(33, 36, 39)',
                  textAlign: 'center',
                }}
              >
                {title}
              </h2>
            </div>

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
                  .mobile-sale-scroll::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              <div
                className="flex space-x-3 mobile-sale-scroll"
                style={{
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  width: 'max-content',
                }}
              >
                {displayProducts.map((product) => (
                  <SaleProductCard
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
                  to="/collections/sale-homepage-products"
                  className="inline-flex items-center justify-center px-6 py-3 bg-red-600 !text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                  style={{
                    fontSize: '16px',
                    fontFamily:
                      "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  }}
                >
                  Visa alla rea
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Product Card Component
function SaleProductCard({
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

  // Calculate discount percentage
  const discountPercentage = isOnSale && firstVariant?.compareAtPrice
    ? Math.round(
        ((parseFloat(firstVariant.compareAtPrice.amount) - parseFloat(firstVariant.price.amount)) /
          parseFloat(firstVariant.compareAtPrice.amount)) *
          100
      )
    : 0;

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

          {/* Sale Badge */}
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            Rea
          </div>

          {/* Discount Percentage */}
          {isOnSale && discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </div>
          )}
        </Link>

        {/* ✅ FIXED: Product Info with flex-grow to fill remaining space */}
        <div className="p-4 flex flex-col flex-grow">
          {/* ✅ FIXED: Only title wrapped in Link */}
          <Link to={`/products/${product.handle}`}>
            <h3 
              className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors"
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
                className="font-semibold text-red-600"
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
export function SaleProductsSkeleton() {
  return (
    <section>
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
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
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-10 w-48 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden h-96">
                  <div className="aspect-square bg-gray-200 relative">
                    <div className="absolute top-2 left-2 h-6 w-12 bg-gray-300 rounded-full"></div>
                    <div className="absolute top-2 right-2 h-6 w-12 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
                    <div className="flex-grow"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Skeleton */}
          <div className="block md:hidden">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-3 w-8 bg-gray-200 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-7 w-48 bg-gray-200 rounded mx-auto"></div>
            </div>
            <div className="flex space-x-3 overflow-x-hidden pb-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-48 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-200 relative">
                    <div className="absolute top-2 left-2 h-5 w-10 bg-gray-300 rounded-full"></div>
                  </div>
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
      </div>
    </section>
  );
}