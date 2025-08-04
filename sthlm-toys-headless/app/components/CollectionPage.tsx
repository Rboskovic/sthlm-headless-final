import {Analytics} from '@shopify/hydrogen';
import {CategorySEOSection} from '~/components/CategorySEOSection';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {Link} from 'react-router';
import {ChevronRight, Home} from 'lucide-react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface CollectionPageProps {
  // Main collection data
  collection: Collection;

  // All products (from main collection + subcollections if Level 2)
  productsData?: any | null;

  // Related collections (subcollections for Level 2, or siblings for Level 3)
  relatedCollections?: Collection[] | null;
}

export function CollectionPage({
  collection,
  productsData,
  relatedCollections,
}: CollectionPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div
          className="mx-auto"
          style={{
            width: '1272px',
            maxWidth: '100%',
            paddingLeft: '12px',
            paddingRight: '12px',
          }}
        >
          <div className="flex items-center py-4 space-x-2 text-sm">
            <Link
              to="/"
              className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
            >
              <Home size={16} className="mr-1" />
              Hem
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">
              {collection.title}
            </span>
          </div>
        </div>
      </nav>

      {/* Collection Header - NO category cards */}
      <div className="bg-white py-8">
        <div
          className="mx-auto text-center"
          style={{
            width: '1272px',
            maxWidth: '100%',
            paddingLeft: '12px',
            paddingRight: '12px',
          }}
        >
          {/* Collection Image (if available) */}
          {collection.image && (
            <div className="mb-6">
              <img
                src={collection.image.url}
                alt={collection.image.altText || collection.title}
                className="mx-auto rounded-lg shadow-md"
                style={{maxHeight: '160px', width: 'auto'}}
              />
            </div>
          )}

          {/* Collection Title */}
          <h1
            className="text-gray-900 font-bold mb-4"
            style={{
              fontSize: '32px',
              fontWeight: 700,
              lineHeight: '40px',
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            {collection.title}
          </h1>

          {/* Collection Description */}
          {collection.description && (
            <div
              className="text-gray-600 max-w-2xl mx-auto"
              style={{
                fontSize: '16px',
                lineHeight: '24px',
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
              dangerouslySetInnerHTML={{__html: collection.description}}
            />
          )}

          {/* Related Collections Navigation (subcollections or siblings) */}
          {relatedCollections && relatedCollections.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap justify-center gap-2">
                {relatedCollections.map((relatedCollection) => (
                  <Link
                    key={relatedCollection.id}
                    to={`/collections/${relatedCollection.handle}`}
                    className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-full transition-colors duration-200"
                    style={{
                      fontSize: '14px',
                      fontFamily:
                        "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    }}
                  >
                    {relatedCollection.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      {productsData && productsData.nodes && productsData.nodes.length > 0 ? (
        <div className="bg-white py-8">
          <div
            className="mx-auto"
            style={{
              width: '1272px',
              maxWidth: '100%',
              paddingLeft: '12px',
              paddingRight: '12px',
            }}
          >
            {/* Product Count & Simple Sorting */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 font-medium">
                {productsData.nodes.length}{' '}
                {productsData.nodes.length === 1 ? 'product' : 'products'}
              </p>

              {/* Simple Sort Dropdown */}
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A-Z</option>
                <option value="name-z-a">Name: Z-A</option>
                <option value="date-new-old">Newest First</option>
              </select>
            </div>

            {/* Products Grid */}
            <PaginatedResourceSection
              connection={productsData}
              resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6"
            >
              {({node: product, index}) => (
                <div key={product.id} className="group relative">
                  <ProductItem
                    product={product}
                    loading={index < 8 ? 'eager' : undefined}
                  />
                </div>
              )}
            </PaginatedResourceSection>
          </div>
        </div>
      ) : (
        /* No Products Message */
        <div className="bg-white py-16">
          <div
            className="mx-auto text-center"
            style={{
              width: '1272px',
              maxWidth: '100%',
              paddingLeft: '12px',
              paddingRight: '12px',
            }}
          >
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                This collection doesn't have any products yet, or they may be
                out of stock.
              </p>
              <Link
                to="/collections/toys"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Browse All Toys
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SEO Section */}
      <CategorySEOSection
        title={`About ${collection.title}`}
        content={
          collection.description ||
          `<p>Discover amazing ${collection.title} products for all ages.</p>`
        }
      />

      {/* Analytics */}
      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </div>
  );
}
