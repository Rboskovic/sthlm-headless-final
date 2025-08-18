// app/components/SearchResults.tsx - Enhanced Search Results with Add to Cart
import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

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
  const {open} = useAside();
  
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
              {/* Product Grid */}
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
                      <div className="block h-full flex flex-col">
                        {/* Product Image */}
                        <Link prefetch="intent" to={productUrl}>
                          {selectedVariant?.image && (
                            <div className="aspect-square mb-4">
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
                          <div className="flex-1 flex flex-col">
                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[3rem] leading-tight">
                              {product.title}
                            </h3>
                            
                            {/* Brand */}
                            {product.vendor && (
                              <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
                            )}
                            
                            {/* Price */}
                            {selectedVariant?.price && (
                              <div className="flex items-center gap-2 mb-4">
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
                          </div>
                        </Link>

                        {/* Add to Cart Button */}
                        {selectedVariant && (
                          <AddToCartButton
                            disabled={!selectedVariant.availableForSale}
                            onClick={() => {
                              open('cart');
                            }}
                            lines={[
                              {
                                merchandiseId: selectedVariant.id,
                                quantity: 1,
                              },
                            ]}
                            analytics={{
                              products: [
                                {
                                  productGid: product.id,
                                  variantGid: selectedVariant.id,
                                  name: product.title,
                                  variantName: selectedVariant.title || product.title,
                                  brand: product.vendor,
                                  price: selectedVariant.price.amount,
                                  quantity: 1,
                                },
                              ],
                            }}
                            variant="addToCart"
                            size="md"
                            className="w-full mt-auto"
                          >
                            {selectedVariant.availableForSale ? 'Lägg i kundvagn' : 'Slutsåld'}
                          </AddToCartButton>
                        )}
                      </div>
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

function SearchResultsEmpty({popularCollections}: {popularCollections?: any[]}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="text-center py-16">
        <div className="mb-8">
          <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">No results found</h2>
        <p className="text-gray-600 mb-12 max-w-md mx-auto text-center">
          We couldn't find any products matching your search. Try different keywords or browse our categories.
        </p>

        {/* Popular Categories Section */}
        <div className="max-w-lg mx-auto">
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 text-center">Popular Categories</h4>
          </div>
          
          {/* Popular Categories Grid */}
          <PopularCategoriesGrid collections={popularCollections} />
        </div>
      </div>
    </div>
  );
}

/**
 * Popular Categories Grid Component - Same as mobile menu and cart
 */
function PopularCategoriesGrid({
  collections,
}: {
  collections?: any[];
}) {
  // Helper functions
  const getMetafieldValue = (metafields: any[], key: string) => {
    const metafield = metafields?.find(
      (field) =>
        field?.namespace === 'custom' &&
        field?.key === key &&
        field?.value
    );
    return metafield ? metafield.value : null;
  };

  const isTrueValue = (value: string | null): boolean => {
    if (!value) return false;
    const normalizedValue = value.toLowerCase().trim();
    return (
      normalizedValue === 'true' ||
      normalizedValue === '1' ||
      normalizedValue === 'yes'
    );
  };

  // Get featured collections from metafields
  const featuredCollections =
    collections
      ?.filter((collection) => {
        const featuredValue = getMetafieldValue(
          collection.metafields,
          'mobile_menu_featured',
        );
        return isTrueValue(featuredValue);
      })
      ?.slice(0, 9) || [];

  // Fallback items
  const fallbackItems = [
    {id: 'deals', title: 'Erbjudanden', image: null, handle: 'rea'},
    {id: 'new', title: 'Nytt & Populärt', image: null, handle: 'new'},
    {id: 'all-toys', title: 'Alla Leksaker', image: null, handle: 'toys'},
    {id: 'lego', title: 'LEGO', image: null, handle: 'lego'},
    {id: 'minecraft', title: 'Minecraft', image: null, handle: 'minecraft'},
    {id: 'sonic', title: 'Sonic', image: null, handle: 'sonic'},
    {id: 'spiderman', title: 'Spiderman', image: null, handle: 'spiderman'},
    {id: 'disney', title: 'Disney', image: null, handle: 'disney'},
    {id: 'outdoor', title: 'Utomhus', image: null, handle: 'outdoor'},
  ];

  const displayItems =
    featuredCollections.length > 0 ? featuredCollections : fallbackItems;

  return (
    <div className="grid grid-cols-3 gap-4 justify-items-center">
      {displayItems.map((item) => (
        <Link
          key={item.id}
          to={`/collections/${item.handle}`}
          className="flex flex-col items-center text-center w-20"
        >
          <div
            className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden mb-2"
            style={{
              backgroundColor: item.image?.url ? 'transparent' : '#f3f4f6',
            }}
          >
            {item.image?.url ? (
              <img
                src={item.image.url}
                alt={item.image.altText || item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            )}
          </div>
          <h3
            className="text-xs font-medium text-gray-700 leading-tight"
            style={{
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '1.2',
              whiteSpace: 'normal',
              textAlign: 'center',
              maxWidth: '80px',
            }}
          >
            {item.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}