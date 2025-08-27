// FILE: app/components/NetflixProductSection.tsx
// ✅ IMPORTANT: Save this file as NetflixProductSection.tsx (with .tsx extension)
// ✅ SHOPIFY HYDROGEN STANDARDS: Netflix-style horizontal scrolling product section

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductItem } from '~/components/ProductItem';
import { SectionHeading } from '~/components/ui/SectionHeading';
import type { ProductFragment } from 'storefrontapi.generated';

interface NetflixProductSectionProps {
  products: ProductFragment[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllUrl?: string;
  className?: string;
}

export function NetflixProductSection({
  products,
  title,
  subtitle,
  showViewAll = false,
  viewAllUrl,
  className = '',
}: NetflixProductSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update scroll button states
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of visible width
    
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (!products || products.length === 0) {
    return null;
  }

  // Show only 4 products on mobile, all 8 on desktop with scrolling
  const displayProducts = isMobile ? products.slice(0, 4) : products;
  const showScrollButtons = !isMobile && products.length > 4;

  return (
    <section className={`relative ${className}`}>
      {/* Container with fixed width and padding */}
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
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <SectionHeading
            title={title}
            subtitle={subtitle}
            size="medium"
            className="mb-0"
          />
          
          {/* View All Link */}
          {showViewAll && viewAllUrl && (
            <a
              href={viewAllUrl}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
            >
              Se alla
            </a>
          )}
        </div>

        {/* Product Container with Scroll Buttons */}
        <div className="relative group">
          {/* Left Scroll Button - Desktop Only */}
          {showScrollButtons && (
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`
                absolute left-0 top-1/2 -translate-y-1/2 z-10
                w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full
                flex items-center justify-center transition-all duration-200
                ${canScrollLeft 
                  ? 'opacity-0 group-hover:opacity-100 hover:scale-110' 
                  : 'opacity-0 cursor-not-allowed'}
                -ml-6
              `}
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Right Scroll Button - Desktop Only */}
          {showScrollButtons && (
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`
                absolute right-0 top-1/2 -translate-y-1/2 z-10
                w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full
                flex items-center justify-center transition-all duration-200
                ${canScrollRight 
                  ? 'opacity-0 group-hover:opacity-100 hover:scale-110' 
                  : 'opacity-0 cursor-not-allowed'}
                -mr-6
              `}
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Products Grid/Scroll Container */}
          {isMobile ? (
            // Mobile: 2x2 Grid Layout
            <div className="grid grid-cols-2 gap-4">
              {displayProducts.map((product, index) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          ) : (
            // Desktop: Horizontal Scrolling Layout
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mb-4"
              onScroll={updateScrollButtons}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {displayProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-none"
                  style={{ width: '280px' }} // Fixed width for consistent layout
                >
                  <ProductItem
                    product={product}
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `
      }} />
    </section>
  );
}

/**
 * ✅ Loading Skeleton for Netflix Product Section
 */
export function NetflixProductSectionSkeleton({
  title,
  className = '',
}: {
  title?: string;
  className?: string;
}) {
  return (
    <section className={`relative ${className}`}>
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
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            {title && <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />}
          </div>
        </div>

        {/* Products Skeleton */}
        <div className="grid grid-cols-2 md:flex md:gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className={`
                ${index >= 4 ? 'hidden md:block' : ''} 
                ${index >= 2 ? 'md:flex-none' : ''} 
                md:w-[280px]
              `}
            >
              {/* Product Card Skeleton */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="aspect-square bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4 mb-3" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}