// FILE: app/components/SimpleProductSection.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Simple 4-product grid matching existing design system

import React from 'react';
import { ProductItem } from '~/components/ProductItem';
import type { ProductFragment } from 'storefrontapi.generated';

interface SimpleProductSectionProps {
  products: ProductFragment[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllUrl?: string;
  className?: string;
}

export function SimpleProductSection({
  products,
  title,
  subtitle,
  showViewAll = false,
  viewAllUrl,
  className = '',
}: SimpleProductSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Show only 4 products on both desktop and mobile
  const displayProducts = products.slice(0, 4);

  return (
    <section className={`relative ${className}`}>
      {/* Container matching existing sections */}
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
          {/* Desktop Header - Exact "Handla efter pris" styling */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h2
                className="text-black font-semibold"
                style={{
                  fontSize: '36px',
                  fontWeight: 600,
                  lineHeight: '42px',
                  fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: 'rgb(33, 36, 39)',
                  textAlign: 'center',
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  className="text-center mt-2"
                  style={{
                    fontSize: '16px',
                    color: 'rgb(107, 114, 128)',
                    fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            
            {/* View All Link */}
            {showViewAll && viewAllUrl && (
              <a
                href={viewAllUrl}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 ml-4"
              >
                Se alla
              </a>
            )}
          </div>

          {/* Desktop Product Grid - Simple 2x2 */}
          <div className="grid grid-cols-4 gap-6">
            {displayProducts.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Mobile Header - Exact existing mobile styling */}
          <div className="text-center mb-6">
            <h2
              className="text-black font-semibold"
              style={{
                fontSize: '24px',
                fontWeight: 600,
                lineHeight: '28px',
                fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'rgb(33, 36, 39)',
                textAlign: 'center',
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="mt-2"
                style={{
                  fontSize: '14px',
                  color: 'rgb(107, 114, 128)',
                  fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  textAlign: 'center',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Mobile Product Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-4">
            {displayProducts.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
            ))}
          </div>

          {/* Mobile View All Button */}
          {showViewAll && viewAllUrl && (
            <div className="text-center mt-6">
              <a
                href={viewAllUrl}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
              >
                Se alla produkter
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Loading Skeleton for Simple Product Section
 */
export function SimpleProductSectionSkeleton({
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
        <div className="hidden md:block">
          <div className="flex items-center justify-center mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          
          {/* Desktop Grid Skeleton */}
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Skeleton */}
        <div className="block md:hidden">
          <div className="text-center mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          
          {/* Mobile Grid Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="w-full aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}