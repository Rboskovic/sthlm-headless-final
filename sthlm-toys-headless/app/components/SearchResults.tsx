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
                    <div className="search-results-item bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow shadow-sm" key={product.id}>
                      <Link prefetch="intent" to={productUrl} className="block h-full flex flex-col">
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

                        {/* Product Info - Fixed height container for alignment */}
                        <div className="flex-1 flex flex-col">
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[3rem] leading-tight">
                            {product.title}
                          </h3>
                          
                          {/* Spacer to push price to bottom */}
                          <div className="flex-1"></div>
                          
                          {/* Price - Always at bottom */}
                          {selectedVariant?.price && (
                            <div className="flex items-center gap-2 mt-auto">
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
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Blue "Show more" Button - Fixed white text */}
              <div className="flex justify-center py-8">
                <NextLink 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-full transition-colors duration-200"
                  style={{ color: 'white' }}
                >
                  {isLoading ? 'Loading...' : 'Show more'}
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
    <div className="bg-white rounded-lg shadow-sm p-8">
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
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-full transition-colors duration-200"
            style={{ color: 'white' }}
          >
            Browse All Products
          </Link>
          <Link 
            to="/collections/lego"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-10 rounded-full transition-colors duration-200"
          >
            Shop LEGO
          </Link>
        </div>
      </div>
    </div>
  );
}