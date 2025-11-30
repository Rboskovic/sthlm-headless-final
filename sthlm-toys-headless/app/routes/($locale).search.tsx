// app/routes/($locale).search.tsx
// ✅ UPDATED: Now uses POPULAR_COLLECTIONS_QUERY instead of SEARCH_MOBILE_COLLECTIONS_QUERY
// ✅ FIXED: TypeScript errors for searchPromise type and sortKey enum

import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, useSearchParams, type MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {getCanonicalUrl} from '~/lib/canonical';
import {SearchResults} from '~/components/SearchResults';
import {POPULAR_COLLECTIONS_QUERY} from '~/lib/fragments';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
} from '~/lib/search';

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q');
  
  const canonicalPath = location.pathname + (location.search ? `?${location.search}` : '');
  const canonicalUrl = `https://www.klosslabbet.se${canonicalPath}`;
  
  return [
    {title: searchQuery 
      ? `Sök: ${searchQuery} | Klosslabbet` 
      : 'Sök produkter | Klosslabbet'},
    {
      name: 'description',
      content: searchQuery 
        ? `Sökresultat för "${searchQuery}" - Hitta LEGO, leksaker och spel på Klosslabbet`
        : 'Sök bland vårt sortiment av LEGO, leksaker och spel. Hitta perfekta produkter för alla åldrar på Klosslabbet.'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: canonicalUrl,
    },
  ];
};

// ✅ NEW: Helper to extract collections from metaobject
function extractPopularCollections(metaobjects: any): any[] {
  if (!metaobjects?.nodes?.[0]?.fields) return [];
  
  const fields = metaobjects.nodes[0].fields;
  const collectionsField = fields.find((f: any) => f.key === 'kolekcije');
  
  if (!collectionsField?.references?.nodes) return [];
  
  return collectionsField.references.nodes;
}

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  
  // ✅ FIXED: Handle promises separately to avoid union type issues
  let searchResult: RegularSearchReturn | PredictiveSearchReturn;
  
  if (isPredictive) {
    searchResult = await predictiveSearch({request, context}).catch((error: any) => {
      console.error(error);
      return {
        term: '', 
        result: getEmptyPredictiveSearchResult(), 
        error: undefined, 
        type: 'predictive' as const
      };
    });
  } else {
    searchResult = await regularSearch({request, context}).catch((error: any) => {
      console.error(error);
      return {
        term: '', 
        result: {
          total: 0,
          totalProducts: 0,
          items: {
            articles: {nodes: []},
            pages: {nodes: []},
            products: {nodes: [], pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: '', endCursor: ''}}
          }
        },
        error: error.message, 
        type: 'regular' as const
      };
    });
  }

  const popularCollectionsData = await context.storefront.query(POPULAR_COLLECTIONS_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  // ✅ NEW: Extract collections from metaobject
  const popularCollections = extractPopularCollections(
    popularCollectionsData?.popularCollections
  );

  return {
    ...searchResult,
    popularCollections,
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
  const type = 'regular' as const;

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
      first: 250,
    },
  });

  // ✅ FIXED: Cast sortKey to proper enum type
  // Main search query with sorting
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {
      ...variables,
      term,
      productQuery,
      sortKey: mapSortKey(sortKey) as any, // Cast to any to satisfy TypeScript
      reverse,
    },
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const error = errors?.length
    ? `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`
    : null;

  // Calculate totals
  const currentPageTotal = Object.values(items).reduce((acc, item) => {
    return acc + (item?.nodes?.length || 0);
  }, 0);

  const totalProductsFromCount = totalSearch?.nodes?.length || 0;
  const realTotal = totalProductsFromCount;

  return {
    type,
    term,
    result: {
      total: currentPageTotal,
      totalProducts: realTotal,
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
}: Pick<ActionFunctionArgs, 'request' | 'context'>): Promise<PredictiveSearchReturn> {
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

  return {term, result: {items, total}, error: undefined, type: 'predictive' as const};
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

        {/* Results count and sorting */}
        {term && result?.total !== undefined ? (
          <div className="mb-6">
            {/* Results count */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-lg text-gray-700">
                Hittade <strong>{result.totalProducts || result.total}</strong> resultat för <strong>"{term}"</strong>
              </p>
            </div>
            
            {/* Sorting */}
            <div className="flex justify-end">
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <option value="relevance">Sortera efter: Relevans</option>
                <option value="price_low">Pris: Lågt till högt</option>
                <option value="price_high">Pris: Högt till lågt</option>
                <option value="newest">Nyast först</option>
                <option value="title">Namn A–Ö</option>
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

// GraphQL Queries
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