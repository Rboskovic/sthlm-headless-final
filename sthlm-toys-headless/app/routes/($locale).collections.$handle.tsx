// FILE: app/routes/($locale).collections.$handle.tsx
// ✅ SHOPIFY STANDARD: Fixed collection route with proper product fragments

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
  
  // Build Shopify filters array using correct format
  const filters: any[] = [];
  
  // Vendor filters (Brand)
  const vendors = searchParams.getAll('vendor');
  vendors.forEach(vendor => {
    filters.push({ productVendor: vendor });
  });
  
  // Product type filters
  const productTypes = searchParams.getAll('product_type');
  productTypes.forEach(type => {
    filters.push({ productType: type });
  });
  
  // Tag filters
  const tags = searchParams.getAll('tag');
  tags.forEach(tag => {
    filters.push({ productTag: tag });
  });
  
  // Availability filter
  const available = searchParams.get('available');
  if (available !== null) {
    filters.push({ available: available === 'true' });
  }

  try {
    // Step 1: Get collection info and related collections
    const [collectionResponse, relatedCollectionsResponse] = await Promise.all([
      storefront.query(COLLECTION_INFO_QUERY, {
        variables: { handle },
      }),
      storefront.query(RELATED_COLLECTIONS_QUERY, {
        variables: { first: 10 },
      })
    ]);

    if (!collectionResponse.collection) {
      throw new Response(`Collection ${handle} not found`, { status: 404 });
    }

    const collection = collectionResponse.collection;
    const relatedCollections = relatedCollectionsResponse?.collections?.nodes || [];

    console.log(`🐛 Collection ${handle} - Loading products...`);

    // Step 2: Query for products in this collection
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

    const products = productResponse.collection?.products || { nodes: [], pageInfo: {}, filters: [] };

    console.log(`🐛 Collection ${handle} - Products loaded:`, products.nodes?.length || 0);

    return {
      collection,
      products,
      relatedCollections,
      appliedFilters: {
        sortKey,
        vendors,
        productTypes,
        tags,
        available,
      },
    };
  } catch (error) {
    console.error('Error loading collection:', error);
    throw new Response('Error loading collection', { status: 500 });
  }
}

export default function Collection() {
  const { collection, products, relatedCollections, appliedFilters } = useLoaderData<typeof loader>();

  return (
    <CollectionPage
      collection={collection}
      products={products}
      relatedCollections={relatedCollections}
      appliedFilters={appliedFilters}
      sortKey={appliedFilters.sortKey}
    />
  );
}

// ✅ FIXED: Updated collection queries with proper product fields
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

const COLLECTION_PRODUCT_FRAGMENT = `#graphql
  fragment CollectionProduct on Product {
    id
    handle
    title
    vendor
    productType
    tags
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
  }
` as const;

const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(
        filters: $filters
        sortKey: $sortKey
        reverse: $reverse
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
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

const RELATED_COLLECTIONS_QUERY = `#graphql
  query RelatedCollections(
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, sortKey: TITLE) {
      nodes {
        id
        title
        handle
        description
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;