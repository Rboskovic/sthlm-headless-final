// FILE: app/components/ProductRecommendations.tsx
// ✅ CONVERSION-OPTIMIZED: "You might also like" recommendations section

import {useState, useRef} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {ChevronLeft, ChevronRight} from 'lucide-react';
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

      {/* Products Grid/Carousel */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        onScroll={checkScrollPosition}
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
      >
        {recommendedProducts.map((product) => (
          <RecommendationCard key={product.id} product={product} />
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

function RecommendationCard({product}: {product: RecommendationProduct}) {
  const variant = product.selectedOrFirstAvailableVariant;
  const price = variant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = variant?.compareAtPrice;

  return (
    <div className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <Link to={`/products/${product.handle}`} className="block">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {product.featuredImage ? (
            <Image
              data={product.featuredImage}
              aspectRatio="1/1"
              sizes="256px"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.vendor && (
          <p className="text-xs text-gray-500 mb-1">{product.vendor}</p>
        )}

        {/* Title */}
        <Link to={`/products/${product.handle}`}>
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <Money data={price} className="text-lg font-semibold text-gray-900" />
          {compareAtPrice && (
            <Money 
              data={compareAtPrice} 
              className="text-sm text-gray-500 line-through" 
            />
          )}
        </div>

        {/* Add to Cart Button */}
        {variant && (
          <AddToCartButton
            lines={[{merchandiseId: variant.id, quantity: 1}]}
            variant="secondary"
            size="small"
            disabled={!variant.availableForSale}
            className="w-full"
          >
            {variant.availableForSale ? 'Quick Add' : 'Out of Stock'}
          </AddToCartButton>
        )}
      </div>
    </div>
  );
}