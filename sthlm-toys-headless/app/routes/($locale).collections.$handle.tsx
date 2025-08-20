// FILE: app/routes/($locale).collections.$handle.tsx
// ✅ SHOPIFY STANDARD: Clean server-side filtering using Search & Discovery

import { type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';
import { getPaginationVariables } from '@shopify/hydrogen';
import { CollectionPage } from '~/components/CollectionPage';

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.collection?.title || 'Collection'} | STHLM Toys & Games` },
  {
    name: 'description',
    content:
      data?.collection?.description ||
      'Discover amazing products in this collection.',
  },
];

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
  
  // ✅ CLEAN: Build Shopify filters from URL parameters
  const filters: any[] = [];
  
  // Parse all filter parameters and convert to Shopify filter format
  searchParams.forEach((value, key) => {
    switch (key) {
      case 'themes':
        filters.push({
          productMetafield: {
            namespace: 'custom',
            key: 'themes',
            value: value
          }
        });
        break;
      case 'age_group':
        filters.push({
          productMetafield: {
            namespace: 'custom',
            key: 'age_group', 
            value: value
          }
        });
        break;
      case 'piece_count_range':
        // Handle piece count ranges with proper price-like filtering
        switch (value) {
          case 'under_100':
            // For metafield ranges, we'll need to use available values from S&D
            break;
          case '101_250':
            break;
          // etc - these will be handled by S&D filter values
        }
        break;
      case 'price_range':
        // Handle price ranges
        switch (value) {
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
        break;
      case 'available':
        if (value === 'true') {
          filters.push({ available: true });
        } else if (value === 'false') {
          filters.push({ available: false });
        }
        break;
    }
  });

  try {
    // Step 1: Get collection info
    const collectionResponse = await storefront.query(COLLECTION_INFO_QUERY, {
      variables: { handle },
    });

    if (!collectionResponse.collection) {
      throw new Response(`Collection ${handle} not found`, { status: 404 });
    }

    const collection = collectionResponse.collection;

    console.log(`🐛 Collection ${handle} - Loading products with filters:`, filters);

    // Step 2: Get total count (unfiltered)
    const countResponse = await storefront.query(COLLECTION_COUNT_QUERY, {
      variables: { handle },
    });

    const totalProductCount = countResponse.collection?.products?.nodes?.length || 0;

    // Step 3: Get filtered products with Shopify filtering
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

    console.log(`🐛 Collection ${handle} - Products loaded:`, products.nodes?.length || 0);
    console.log(`🐛 Collection ${handle} - Available filters:`, products.filters?.length || 0);

    return {
      collection,
      products,
      totalProductCount,
      appliedFilters: Object.fromEntries(searchParams.entries()),
      sortKey: cleanSortKey,
    };
  } catch (error) {
    console.error('Error loading collection:', error);
    throw new Response('Error loading collection', { status: 500 });
  }
}

export default function Collection() {
  const { collection, products, totalProductCount, appliedFilters, sortKey } = useLoaderData<typeof loader>();

  return (
    <CollectionPage
      collection={collection}
      products={products}
      totalProductCount={totalProductCount}
      appliedFilters={appliedFilters}
      sortKey={sortKey}
    />
  );
}

// ✅ CLEAN: Simple collection info query
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