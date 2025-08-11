// FILE: app/components/SaleProducts.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Sale products section for homepage

import { Link } from 'react-router';
import { ProductGrid } from '~/components/ui/ProductCard';
import { SectionHeading } from '~/components/ui/SectionHeading';
import { Percent, Clock } from 'lucide-react';
import type { ProductFragment } from 'storefrontapi.generated';

interface SaleProductsProps {
  products: ProductFragment[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  className?: string;
  showTimer?: boolean;
}

/**
 * SaleProducts Component
 * Displays sale products from the sale-homepage-products collection
 * 
 * @example
 * <SaleProducts 
 *   products={saleProducts}
 *   title="Sale Products"
 *   subtitle="Limited time offers you don't want to miss"
 *   showViewAll={true}
 *   showTimer={true}
 * />
 */
export function SaleProducts({
  products,
  title = "Sale Products",
  subtitle = "Limited time offers you don't want to miss",
  showViewAll = true,
  className = "",
  showTimer = false,
}: SaleProductsProps) {
  // Early return if no products
  if (!products?.length) {
    console.log('⚠️ SaleProducts: No products provided');
    return null;
  }

  // ✅ DEFENSIVE: Ensure title is always a string
  const safeTitle = title || "Sale Products";
  const safeSubtitle = subtitle || "Limited time offers you don't want to miss";

  // Count products with actual discounts
  const productsOnSale = products.filter(product => {
    const variant = product.selectedOrFirstAvailableVariant;
    return variant?.compareAtPrice && 
           parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount);
  });

  return (
    <section className={`py-12 lg:py-16 ${className}`}>
      {/* Sale Background - Subtle gradient */}
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="mx-auto" style={{ maxWidth: '1272px', paddingLeft: '16px', paddingRight: '16px' }}>
          
          {/* Section Header */}
          <div className="pt-12">
            {/* Sale Badge and Timer */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-red-600" />
                <span className="text-sm font-bold text-red-600 uppercase tracking-wide">
                  Sale
                </span>
                {/* Sale Badge */}
                <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  UP TO 50% OFF
                </div>
              </div>
              
              {/* Optional Timer Display */}
              {showTimer && (
                <div className="flex items-center gap-2 text-sm text-red-700 ml-4">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Sale ends in 3 days</span>
                </div>
              )}
            </div>
            
            {/* ✅ FIXED: Use safe props for SectionHeading */}
            <SectionHeading
              title={safeTitle}
              subtitle={safeSubtitle}
              align="left"
              size="lg"
              action={showViewAll ? {
                label: "View All Sale Items",
                href: "/collections/sale-homepage-products"
              } : undefined}
              spacing="lg"
            />
          </div>

          {/* Products Grid */}
          <ProductGrid
            products={products}
            columns={4}
            variant="default"
            showQuickAdd={true}
            className="gap-4 lg:gap-6"
          />

          {/* Sale Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{products.length} sale items</span>
            </div>
            {productsOnSale.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>{productsOnSale.length} with discounts</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free shipping on orders over $50</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * SaleProductsSkeleton Component
 * Loading state for sale products section
 */
export function SaleProductsSkeleton() {
  return (
    <section className="py-12 lg:py-16">
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="mx-auto" style={{ maxWidth: '1272px', paddingLeft: '16px', paddingRight: '16px' }}>
          
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 lg:mb-12 pt-12">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
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
                {/* Sale Badge Skeleton */}
                <div className="relative">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="absolute top-2 left-2 h-6 w-12 bg-red-200 rounded"></div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Skeleton */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Mobile Button Skeleton */}
          <div className="block sm:hidden pb-12">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { SaleProductsProps };