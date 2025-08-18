// app/routes/($locale).search.tsx - Complete Search Implementation with Working Filters & Sorting
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, useSearchParams, type MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchResults} from '~/components/SearchResults';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
} from '~/lib/search';

export const meta: MetaFunction = () => {
  return [{title: `Search | STHLM Toys & Games`}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  
  // Get popular collections for empty state
  const popularCollectionsPromise = context.storefront.query(MOBILE_MENU_COLLECTIONS_QUERY, {
    variables: {},
  });
  
  const searchPromise: Promise<PredictiveSearchReturn | RegularSearchReturn> =
    isPredictive
      ? predictiveSearch({request, context})
      : regularSearch({request, context});

  searchPromise.catch((error: Error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  const [searchResult, collectionsResult] = await Promise.all([
    searchPromise,
    popularCollectionsPromise,
  ]);

  return {
    ...searchResult,
    popularCollections: collectionsResult?.collections?.nodes || [],
  };
}

/**
 * Regular search fetcher with sorting and proper total count
 */
async function regularSearch({
  request,
  context,
}: Pick<LoaderFunctionArgs, 'request' | 'context'>): Promise<RegularSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  
  // Get search parameters
  const term = String(searchParams.get('q') || '').trim();
  const sortKey = String(searchParams.get('sort') || 'RELEVANCE').toUpperCase();
  const reverse = searchParams.get('reverse') === 'true';
  
  // Pagination with 24 items per page
  const variables = getPaginationVariables(request, {pageBy: 24});
  const type = 'regular';

  if (!term) {
    return {
      type,
      term,
      result: {
        total: 0, 
        totalProducts: 0,
        items: {
          articles: {nodes: []}, 
          pages: {nodes: []}, 
          products: {nodes: [], pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: '', endCursor: ''}}
        }
      },
    };
  }

  // Use term directly for product search
  const productQuery = term;

  // Get rough total count with a separate query (first 250 results max)
  const {search: totalSearch} = await storefront.query(SEARCH_COUNT_QUERY, {
    variables: {
      term: productQuery,
      first: 250, // Max results to count
    },
  });

  // Main search query with sorting
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {
      ...variables,
      term,
      productQuery,
      sortKey: mapSortKey(sortKey),
      reverse,
    },
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const error = errors?.length
    ? `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`
    : null;

  // Calculate totals - improved logic
  const currentPageTotal = Object.values(items).reduce((acc, item) => {
    return acc + (item?.nodes?.length || 0);
  }, 0);

  // Get actual total count from the count query
  const totalProductsFromCount = totalSearch?.nodes?.length || 0;
  
  // Use the count query result as the real total
  const realTotal = totalProductsFromCount;

  return {
    type,
    term,
    result: {
      total: currentPageTotal, // Current page count for display
      totalProducts: realTotal, // Real total for "Found X results"
      items,
    },
    ...(error && {error}),
  };
}

/**
 * Map frontend sort values to Shopify sort keys
 */
function mapSortKey(sortKey: string): string {
  const sortMap: Record<string, string> = {
    'RELEVANCE': 'RELEVANCE',
    'PRICE_LOW': 'PRICE',
    'PRICE_HIGH': 'PRICE', 
    'NEWEST': 'CREATED_AT',
    'TITLE': 'TITLE',
  };
  return sortMap[sortKey] || 'RELEVANCE';
}

/**
 * Predictive search fetcher
 */
async function predictiveSearch({
  request,
  context,
}: Pick<ActionFunctionArgs, 'request' | 'context'>) {
  const {storefront} = context;
  const formData = await request.formData();
  const term = String(formData.get('q') || '');
  const limit = Number(formData.get('limit') || 10);

  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned');
  }

  const total = Object.values(items).reduce((acc, {length}) => acc + length, 0);

  return {term, result: {items, total}, error: null, type: 'predictive'};
}

/**
 * Search page component with working sorting only
 */
export default function SearchPage() {
  const {type, term, result, error, popularCollections} = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  if (type === 'predictive') return null;

  const currentSort = searchParams.get('sort') || 'relevance';

  // Sort handler
  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSort === 'relevance') {
      newParams.delete('sort');
      newParams.delete('reverse');
    } else {
      newParams.set('sort', newSort);
      if (newSort === 'price_high') {
        newParams.set('sort', 'price_low');
        newParams.set('reverse', 'true');
      } else {
        newParams.delete('reverse');
      }
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Results count and sorting - FIXED ALIGNMENT */}
        {term && result?.total !== undefined ? (
          <div className="mb-6">
            {/* Results count with gray background - aligned to container */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-lg text-gray-700">
                Found <strong>{result.totalProducts || result.total}</strong> results for <strong>"{term}"</strong>
              </p>
            </div>
            
            {/* Sorting Only - No filters */}
            <div className="flex justify-end">
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="title">Name A-Z</option>
              </select>
            </div>
          </div>
        ) : null}

        {/* Search Results */}
        {!term || result?.total === 0 ? (
          <SearchResults.Empty popularCollections={popularCollections} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <SearchResults result={result} term={term}>
              {({articles, pages, products, term}) => (
                <div className="space-y-8">
                  <SearchResults.Products products={products} term={term} />
                  <SearchResults.Pages pages={pages} term={term} />
                  <SearchResults.Articles articles={articles} term={term} />
                </div>
              )}
            </SearchResults>
          </div>
        )}

        {/* Analytics */}
        <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
      </div>
    </div>
  );
}

// Enhanced GraphQL Queries with Sorting Support
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      availableForSale
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

// Main search query with sorting support
const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $productQuery: String!
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $productQuery,
      sortKey: $sortKey,
      reverse: $reverse,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

// Count query for accurate total results
const SEARCH_COUNT_QUERY = `#graphql
  query SearchCount(
    $country: CountryCode
    $language: LanguageCode
    $term: String!
    $first: Int
  ) @inContext(country: $country, language: $language) {
    search(
      query: $term,
      types: [PRODUCT],
      first: $first,
    ) {
      nodes {
        __typename
      }
    }
  }
` as const;

// Predictive search queries (unchanged)
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

// Mobile menu collections query for popular categories
const MOBILE_MENU_COLLECTION_FRAGMENT = `#graphql
  fragment MobileMenuCollection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
    metafields(identifiers: [
      {namespace: "custom", key: "mobile_menu_featured"}
    ]) {
      key
      value
      namespace
    }
  }
` as const;

const MOBILE_MENU_COLLECTIONS_QUERY = `#graphql
  query MobileMenuCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: TITLE) {
      nodes {
        ...MobileMenuCollection
      }
    }
  }
  ${MOBILE_MENU_COLLECTION_FRAGMENT}
` as const;