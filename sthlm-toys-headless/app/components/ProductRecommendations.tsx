// FILE: app/components/ProductRecommendations.tsx
// ✅ CONVERSION-OPTIMIZED: "You might also like" recommendations section using ProductItem

import {useState, useRef} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {ProductItem} from '~/components/ProductItem';
import {AddToCartButton} from './AddToCartButton';
import type {ProductFragment} from 'storefrontapi.generated';

interface ProductRecommendationsProps {
  productId: string;
  productCollections: Array<{
    id: string;
    title: string;
    handle: string;
  }>;
  recommendations: any; // The deferred recommendation data
}

interface RecommendationProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  featuredImage?: {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  selectedOrFirstAvailableVariant?: {
    id: string;
    availableForSale: boolean;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    };
  };
}

export function ProductRecommendations({
  productId,
  productCollections,
  recommendations,
}: ProductRecommendationsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Extract recommended products from the query result
  const getRecommendedProducts = (): RecommendationProduct[] => {
    if (!recommendations) return [];

    try {
      const data = recommendations;
      let products: RecommendationProduct[] = [];

      // First, try to get products from the same collections
      if (data.product?.collections?.nodes) {
        for (const collection of data.product.collections.nodes) {
          if (collection.products?.nodes) {
            const collectionProducts = collection.products.nodes
              .filter((p: RecommendationProduct) => p.id !== productId); // Exclude current product
            products.push(...collectionProducts);
          }
        }
      }

      // If we don't have enough products, add fallback products
      if (products.length < 4 && data.fallbackProducts?.nodes) {
        const fallbackProducts = data.fallbackProducts.nodes
          .filter((p: RecommendationProduct) => 
            p.id !== productId && 
            !products.some(existing => existing.id === p.id)
          );
        products.push(...fallbackProducts);
      }

      // Remove duplicates and limit to 8 products
      const uniqueProducts = products.filter((product, index, array) => 
        array.findIndex(p => p.id === product.id) === index
      );

      return uniqueProducts.slice(0, 8);
    } catch (error) {
      console.error('Error processing recommendations:', error);
      return [];
    }
  };

  const recommendedProducts = getRecommendedProducts();

  // Don't render if no recommendations
  if (recommendedProducts.length === 0) {
    return null;
  }

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    
    const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({left: -300, behavior: 'smooth'});
    setTimeout(checkScrollPosition, 300);
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({left: 300, behavior: 'smooth'});
    setTimeout(checkScrollPosition, 300);
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          You Might Also Like
        </h2>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border ${
              canScrollLeft
                ? 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            } transition-colors`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border ${
              canScrollRight
                ? 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            } transition-colors`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ✅ UPDATED: Products Grid/Carousel using ProductItem */}
      <div 
        ref={scrollRef}
        className="flex lg:overflow-x-auto lg:space-x-4 lg:pb-4 lg:scrollbar-hide grid grid-cols-2 lg:grid-cols-none gap-4 lg:gap-0"
        onScroll={checkScrollPosition}
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
      >
        {recommendedProducts.map((product, index) => (
          <div key={product.id} className="lg:flex-shrink-0 lg:w-64">
            <ProductItem
              product={product}
              loading={index < 4 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* View All Link */}
      {productCollections.length > 0 && (
        <div className="text-center mt-6">
          <Link
            to={`/collections/${productCollections[0].handle}`}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            View All in {productCollections[0].title}
          </Link>
        </div>
      )}
    </section>
  );
}