// app/components/SearchResults.tsx - Enhanced Search Results with Improved Pagination
import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Articles</h2>
      <div className="grid gap-6">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item border-b border-gray-200 pb-6" key={article.id}>
              <Link 
                prefetch="intent" 
                to={articleUrl}
                className="text-blue-600 hover:text-blue-800 text-lg font-medium block hover:underline transition-colors"
              >
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Pages</h2>
      <div className="grid gap-6">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item border-b border-gray-200 pb-6" key={page.id}>
              <Link 
                prefetch="intent" 
                to={pageUrl}
                className="text-blue-600 hover:text-blue-800 text-lg font-medium block hover:underline transition-colors"
              >
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Products</h2>
      
      {/* Products with Pagination */}
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          return (
            <>
              {/* Product Grid - Back to original responsive layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {nodes.map((product) => {
                  const productUrl = urlWithTrackingParams({
                    baseUrl: `/products/${product.handle}`,
                    trackingParams: product.trackingParameters,
                    term,
                  });

                  const selectedVariant = product.selectedOrFirstAvailableVariant;

                  return (
                    <div className="search-results-item border rounded-lg p-4 hover:shadow-lg transition-shadow" key={product.id}>
                      <Link prefetch="intent" to={productUrl} className="block">
                        {/* Product Image */}
                        {selectedVariant?.image && (
                          <div className="aspect-square mb-3">
                            <Image
                              alt={selectedVariant.image.altText || product.title}
                              src={selectedVariant.image.url}
                              className="w-full h-full object-cover rounded"
                              sizes="(min-width: 768px) 25vw, 50vw"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Product Info */}
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        
                        {/* Price */}
                        {selectedVariant?.price && (
                          <div className="flex items-center gap-2">
                            <Money 
                              data={selectedVariant.price} 
                              className="text-lg font-semibold text-gray-900"
                            />
                            {selectedVariant?.compareAtPrice && (
                              <Money 
                                data={selectedVariant.compareAtPrice} 
                                className="text-sm text-gray-500 line-through"
                              />
                            )}
                          </div>
                        )}
                        
                        {/* Brand */}
                        {product.vendor && (
                          <p className="text-sm text-gray-600 mt-1">{product.vendor}</p>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Simple Pagination Controls */}
              <div className="flex justify-center items-center gap-4 py-8 border-t border-gray-200">
                <PreviousLink className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">
                  {isLoading ? 'Loading...' : 'Previous'}
                </PreviousLink>
                
                <NextLink className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">
                  {isLoading ? 'Loading...' : 'Next'}
                </NextLink>
              </div>
            </>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">No results found</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        We couldn't find any products matching your search. Try different keywords or browse our categories.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/collections"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Browse All Products
        </Link>
        <Link 
          to="/collections/lego"
          className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Shop LEGO
        </Link>
      </div>
    </div>
  );
}