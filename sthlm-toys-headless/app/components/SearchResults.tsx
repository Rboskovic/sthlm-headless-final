// app/components/SearchResults.tsx - Complete Shopify Search Results Implementation
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
      <h2 className="text-2xl font-bold mb-4">Articles</h2>
      <div className="grid gap-4">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item border-b pb-4" key={article.id}>
              <Link 
                prefetch="intent" 
                to={articleUrl}
                className="text-blue-600 hover:text-blue-800 text-lg font-medium"
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
      <h2 className="text-2xl font-bold mb-4">Pages</h2>
      <div className="grid gap-4">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item border-b pb-4" key={page.id}>
              <Link 
                prefetch="intent" 
                to={pageUrl}
                className="text-blue-600 hover:text-blue-800 text-lg font-medium"
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
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.nodes?.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term,
          });

          const selectedVariant = product.selectedOrFirstAvailableVariant;

          return (
            <div className="search-results-item border rounded-lg p-4 hover:shadow-lg transition-shadow" key={product.id}>
              <Link prefetch="intent" to={productUrl}>
                {selectedVariant?.image && (
                  <div className="aspect-square mb-3">
                    <Image
                      alt={selectedVariant.image.altText || product.title}
                      src={selectedVariant.image.url}
                      className="w-full h-full object-cover rounded"
                      sizes="(min-width: 768px) 25vw, 50vw"
                    />
                  </div>
                )}
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>
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
                {product.vendor && (
                  <p className="text-sm text-gray-600 mt-1">{product.vendor}</p>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Pagination for products */}
      <div className="mt-8">
        <Pagination connection={products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => {
            return (
              <div className="flex justify-center items-center gap-4">
                <PreviousLink className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">
                  {isLoading ? 'Loading...' : 'Previous'}
                </PreviousLink>
                <span className="text-sm text-gray-600">
                  Showing {nodes.length} products
                </span>
                <NextLink className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">
                  {isLoading ? 'Loading...' : 'Next'}
                </NextLink>
              </div>
            );
          }}
        </Pagination>
      </div>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">No results found</h2>
      <p className="text-gray-600 mb-8">
        Try adjusting your search or browse our categories.
      </p>
      <Link 
        to="/collections"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Browse All Products
      </Link>
    </div>
  );
}