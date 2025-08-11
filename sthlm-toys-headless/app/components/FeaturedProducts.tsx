// FILE: app/components/FeaturedProducts.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Featured products section for homepage

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
        
        {/* ✅ FIXED: Use safe props for SectionHeading */}
        <SectionHeading
          title={safeTitle}
          subtitle={safeSubtitle}
          align="left"
          size="lg"
          action={showViewAll ? {
            label: "View All Featured",
            href: "/collections/featured-homepage-products"
          } : undefined}
          spacing="lg"
        />

        {/* Products Grid */}
        <ProductGrid
          products={products}
          columns={4}
          variant="default"
          showQuickAdd={true}
          className="gap-4 lg:gap-6"
        />

        {/* Product Count Badge */}
        <div className="text-center mt-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {products.length} featured products
          </span>
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
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="hidden sm:block h-10 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Button Skeleton */}
        <div className="block sm:hidden">
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </section>
  );
}

export type { FeaturedProductsProps };