// FILE: app/routes/($locale).collections.$handle.tsx
// ✅ FIXED: Multiple filters now work correctly together

import { type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';
import { getPaginationVariables } from '@shopify/hydrogen';
import { CollectionPage } from '~/components/CollectionPage';
import {getCanonicalUrlForPath} from '~/lib/canonical';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  // Add collection-specific keywords
  const collectionTitle = data?.collection?.title || 'Kollektion';
  const productCount = data?.filteredTotalCount || data?.totalProductCount || 0;
  
  return [
    { title: `${collectionTitle} | Klosslabbet` },
    {
      name: 'description',
      content: data?.collection?.description 
        ? `${data?.collection?.description} ✓ ${productCount}+ produkter ✓ Fri frakt till ombud över 1299 kr ✓ Säker betalning`
        : `Upptäck ${collectionTitle} med ${productCount}+ produkter. ✓ Fri frakt till ombud över 1299 kr ✓ 14 dagars öppet köp ✓ Snabb leverans`,
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getCanonicalUrlForPath(`/collections/${data?.collection?.handle}`),
    },
  ];
};

export async function loader({ context, request, params }: LoaderFunctionArgs) {
  const { storefront } = context;
  const { handle } = params;
  
  if (!handle) {
    throw new Response('Collection handle required', { status: 400 });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const paginationVariables = getPaginationVariables(request, { pageBy: 24 });
  
  // Parse sorting
  const sortKey = searchParams.get('sort_by') || 'BEST_SELLING';
  const reverse = sortKey.includes('REVERSE');
  const cleanSortKey = sortKey.replace('_REVERSE', '');
  
  // ✅ FIXED: Better filter building logic for multiple filters
  const filters: any[] = [];
  
  // ✅ FIXED: Parse each filter type individually and ensure they all get added
  const themes = searchParams.get('themes');
  if (themes) {
    filters.push({
      productMetafield: {
        namespace: 'custom',
        key: 'themes',
        value: themes
      }
    });
  }

  const ageGroup = searchParams.get('age_group');
  if (ageGroup) {
    filters.push({
      productMetafield: {
        namespace: 'custom',
        key: 'age_group',
        value: ageGroup
      }
    });
  }

  const pieceCount = searchParams.get('piece_count');
  if (pieceCount) {
    filters.push({
      productMetafield: {
        namespace: 'custom',
        key: 'piece_count',
        value: pieceCount
      }
    });
  }

  const priceRange = searchParams.get('price_range');
  if (priceRange) {
    switch (priceRange) {
      case 'under_220':
        filters.push({ price: { max: 220 } });
        break;
      case '220_550':
        filters.push({ price: { min: 220, max: 550 } });
        break;
      case '500_1000':
        filters.push({ price: { min: 500, max: 1000 } });
        break;
      case 'over_1100':
        filters.push({ price: { min: 1100 } });
        break;
    }
  }

  const available = searchParams.get('available');
  if (available) {
    if (available === 'true') {
      filters.push({ available: true });
    } else if (available === 'false') {
      filters.push({ available: false });
    }
  }


  try {
    // Step 1: Get collection info
    const collectionResponse = await storefront.query(COLLECTION_INFO_QUERY, {
      variables: { handle },
    });

    if (!collectionResponse.collection) {
      throw new Response(`Collection ${handle} not found`, { status: 404 });
    }

    const collection = collectionResponse.collection;

    // Step 2: Get total count (unfiltered)
    const countResponse = await storefront.query(COLLECTION_COUNT_QUERY, {
      variables: { handle },
    });

    const totalProductCount = countResponse.collection?.products?.nodes?.length || 0;

    // ✅ FIXED: Get filtered total count with same filters (only if filters exist)
    let filteredTotalCount = totalProductCount; // Default to total if no filters

    if (filters.length > 0) {
      const filteredCountResponse = await storefront.query(COLLECTION_FILTERED_COUNT_QUERY, {
        variables: {
          handle,
          filters,
          country: storefront.i18n?.country,
          language: storefront.i18n?.language,
        },
      });
      
      filteredTotalCount = filteredCountResponse.collection?.products?.nodes?.length || 0;
    }

    // Step 3: Get paginated filtered products with Shopify filtering
    const productResponse = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
      variables: {
        handle,
        filters: filters.length > 0 ? filters : undefined,
        sortKey: cleanSortKey as any,
        reverse,
        ...paginationVariables,
        country: storefront.i18n?.country,
        language: storefront.i18n?.language,
      },
    });

    const products = productResponse.collection?.products || { 
      nodes: [], 
      pageInfo: {},
      filters: [] 
    };

    return {
      collection,
      products,
      totalProductCount,
      filteredTotalCount, // ✅ Pass the actual filtered total
      appliedFilters: Object.fromEntries(searchParams.entries()),
      sortKey: cleanSortKey,
    };
  } catch (error) {
    console.error('🚨 Error loading collection:', error);
    throw new Response('Error loading collection', { status: 500 });
  }
}

export default function Collection() {
  const { collection, products, totalProductCount, filteredTotalCount, appliedFilters, sortKey } = useLoaderData<typeof loader>();

  return (
    <CollectionPage
      collection={collection}
      products={products}
      totalProductCount={totalProductCount}
      filteredTotalCount={filteredTotalCount} // ✅ Pass filtered total
      appliedFilters={appliedFilters}
      sortKey={sortKey}
    />
  );
}

// ✅ FIXED: Collection info query with metafields to satisfy TypeScript
const COLLECTION_INFO_QUERY = `#graphql
  query CollectionInfo(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(first: 1) {
        nodes {
          id
        }
        edges {
          node {
            id
          }
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
      metafields(identifiers: [
        {namespace: "custom", key: "banner_image"},
        {namespace: "custom", key: "collection_color"},
        {namespace: "custom", key: "mobile_menu_featured"}
      ]) {
        id
        key
        value
        namespace
        type
      }
      updatedAt
    }
  }
` as const;

// ✅ CLEAN: Simple count query  
const COLLECTION_COUNT_QUERY = `#graphql
  query CollectionCount(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 250) {
        nodes {
          id
        }
      }
    }
  }
` as const;

// ✅ NEW: Filtered count query to get actual total with filters applied
const COLLECTION_FILTERED_COUNT_QUERY = `#graphql
  query CollectionFilteredCount(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(
        first: 250,
        filters: $filters
      ) {
        nodes {
          id
        }
      }
    }
  }
` as const;

// ✅ CLEAN: Product fragment with metafields
const COLLECTION_PRODUCT_FRAGMENT = `#graphql
  fragment CollectionProduct on Product {
    id
    handle
    title
    vendor
    productType
    tags
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      availableForSale
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      image {
        url
        altText
        width
        height
      }
      selectedOptions {
        name
        value
      }
      sku
      title
    }
    metafields(identifiers: [
      {namespace: "custom", key: "age_group"},
      {namespace: "custom", key: "piece_count"},
      {namespace: "custom", key: "themes"}
    ]) {
      key
      value
      namespace
    }
  }
` as const;

// ✅ CLEAN: Main products query with native Shopify filtering
const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $endCursor: String
    $first: Int
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      products(
        after: $endCursor,
        before: $startCursor,
        first: $first,
        last: $last,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...CollectionProduct
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${COLLECTION_PRODUCT_FRAGMENT}
` as const;