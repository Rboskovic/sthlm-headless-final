// FILE: app/components/FeaturedProducts.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: FIXED - Correct SectionHeading props

import { Link } from 'react-router';
import { ProductGrid } from '~/components/ui/ProductCard';
import { SectionHeading } from '~/components/ui/SectionHeading';
import { Star } from 'lucide-react';
import type { ProductFragment } from 'storefrontapi.generated';

interface FeaturedProductsProps {
  products: ProductFragment[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  className?: string;
}

/**
 * FeaturedProducts Component
 * Displays curated featured products from the featured-homepage-products collection
 * 
 * @example
 * <FeaturedProducts 
 *   products={featuredProducts}
 *   title="Featured Products"
 *   subtitle="Hand-picked favorites our customers love"
 *   showViewAll={true}
 * />
 */
export function FeaturedProducts({
  products,
  title = "Featured Products",
  subtitle = "Discover our hand-picked favorites",
  showViewAll = true,
  className = "",
}: FeaturedProductsProps) {
  // Early return if no products
  if (!products?.length) {
    console.log('⚠️ FeaturedProducts: No products provided');
    return null;
  }

  // ✅ DEFENSIVE: Ensure title is always a string
  const safeTitle = title || "Featured Products";
  const safeSubtitle = subtitle || "Discover our hand-picked favorites";

  return (
    <section className={`py-12 lg:py-16 ${className}`}>
      <div className="mx-auto" style={{ maxWidth: '1272px', paddingLeft: '16px', paddingRight: '16px' }}>
        
        {/* Section Header with Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            Featured
          </span>
        </div>
        
        {/* ✅ FIXED: Use correct SectionHeading props */}
        <SectionHeading
          title={safeTitle}
          subtitle={safeSubtitle}
          alignment="left"
          size="large"
          className="mb-8 lg:mb-12"
        />
        
        {/* View All Link - positioned after heading */}
        {showViewAll && (
          <div className="flex justify-end mb-6">
            <Link
              to="/collections/featured-homepage-products"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:underline"
            >
              View All Featured Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid
          products={products}
          columns={4}
          variant="default"
          showQuickAdd={true}
          className="gap-4 lg:gap-6"
        />

        {/* Featured Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>{products.length} featured items</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Hand-picked by our team</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Customer favorites</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * FeaturedProductsSkeleton Component
 * Loading state for featured products section
 */
export function FeaturedProductsSkeleton() {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto" style={{ maxWidth: '1272px', paddingLeft: '16px', paddingRight: '16px' }}>
        
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 lg:mb-12">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="hidden sm:block h-10 w-36 bg-gray-200 rounded"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Featured Badge Skeleton */}
              <div className="relative">
                <div className="aspect-square bg-gray-200"></div>
                <div className="absolute top-2 left-2 h-6 w-16 bg-gray-300 rounded-full"></div>
              </div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}