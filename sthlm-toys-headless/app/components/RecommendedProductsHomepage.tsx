// FILE: app/components/RecommendedProductsHomepage.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Homepage recommended products section with inline show more

import { useState } from 'react';
import { ProductItem } from '~/components/ProductItem';
import type { ProductFragment } from 'storefrontapi.generated';

interface RecommendedProductsHomepageProps {
  products: ProductFragment[];
  title?: string;
  subtitle?: string;
}

export function RecommendedProductsHomepage({ 
  products, 
  title = "Rekommenderade produkter",
  subtitle = "Handplockade favoriter bara för dig"
}: RecommendedProductsHomepageProps) {
  const [displayCount, setDisplayCount] = useState(8);
  
  const showMore = () => {
    setDisplayCount(prev => Math.min(prev + 8, products.length));
  };
  
  const currentProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  return (
    <section className="w-full bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2
            className="text-black font-semibold mb-2"
            style={{
              fontSize: '32px',
              fontWeight: 600,
              lineHeight: '36px',
              fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              color: 'rgb(33, 36, 39)',
            }}
          >
            {title}
          </h2>
          <p className="text-gray-600 text-lg">
            {subtitle}
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {currentProducts.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 4 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        {/* Mobile Grid */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {currentProducts.slice(0, Math.min(displayCount, 4)).map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        {/* Show More Button - Inline loading */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={showMore}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'white',
              }}
            >
              Visa fler produkter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}