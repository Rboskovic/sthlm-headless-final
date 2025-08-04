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
  
  // Price filter - Fixed format
  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  if (priceMin || priceMax) {
    const priceFilter: any = { price: {} };
    if (priceMin) priceFilter.price.min = parseFloat(priceMin);
    if (priceMax) priceFilter.price.max = parseFloat(priceMax);
    filters.push(priceFilter);
  }

  try {
    // Step 1: Find ALL related collections (subcollections) first
    const { collections: subcollections } = await storefront.query(
      SUBCOLLECTIONS_QUERY,
      {
        variables: {
          query: `title:*${handle}* OR handle:*${handle}*`,
          first: 50,
          country: storefront.i18n?.country,
          language: storefront.i18n?.language,
        },
      }
    );

    // Filter to get actual subcollections
    const relatedCollections = subcollections.nodes.filter(sub => 
      sub.handle !== handle && 
      (sub.handle.includes(handle) || sub.title.toLowerCase().includes(handle))
    );

    console.log(`Found ${relatedCollections.length} subcollections for ${handle}:`, 
      relatedCollections.map(c => c.handle)
    );

    // Step 2: Get main collection info
    const { collection } = await storefront.query(
      COLLECTION_INFO_QUERY,
      {
        variables: {
          handle,
          country: storefront.i18n?.country,
          language: storefront.i18n?.language,
        },
      }
    );

    if (!collection) {
      throw new Response('Collection not found', { status: 404 });
    }

    // Step 3: Determine which collections to query for products
    const selectedSubcollections = searchParams.getAll('subcollection');
    let collectionsToQuery: string[] = [];

    if (selectedSubcollections.length > 0) {
      // User has filtered - only show selected subcollections
      collectionsToQuery = selectedSubcollections;
      console.log(`User filtered - showing only: ${collectionsToQuery.join(', ')}`);
    } else {
      // Default state - show main collection + ALL subcollections
      collectionsToQuery = [handle, ...relatedCollections.map(c => c.handle)];
      console.log(`Default state - showing all: ${collectionsToQuery.join(', ')}`);
    }

    // Step 4: Get products from all relevant collections
    const productQueries = collectionsToQuery.map(collectionHandle =>
      storefront.query(
        COLLECTION_PRODUCTS_QUERY,
        {
          variables: {
            handle: collectionHandle,
            first: 50, // Get more products per collection
            filters: filters.length > 0 ? filters : undefined,
            sortKey: cleanSortKey as any,
            reverse,
            country: storefront.i18n?.country,
            language: storefront.i18n?.language,
          },
        }
      )
    );

    const productResults = await Promise.all(productQueries);
    
    // Step 5: Combine all products and get filters from main collection
    const allProducts: any[] = [];
    let combinedFilters: any[] = [];
    
    productResults.forEach((result, index) => {
      if (result.collection?.products?.nodes) {
        allProducts.push(...result.collection.products.nodes);
      }
      
      // Use filters from the main collection (first query if default, or first selected)
      if (index === 0 && result.collection?.products?.filters) {
        combinedFilters = result.collection.products.filters;
      }
    });

    // Remove duplicate products by ID
    const uniqueProductsMap = new Map();
    allProducts.forEach(product => {
      uniqueProductsMap.set(product.id, product);
    });
    const uniqueProducts = Array.from(uniqueProductsMap.values());

    // Step 6: Create final products object
    const finalProducts = {
      nodes: uniqueProducts,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      filters: combinedFilters,
    };

    console.log(`Final result: ${uniqueProducts.length} products from ${collectionsToQuery.length} collections`);

    return {
      collection,
      products: finalProducts,
      relatedCollections,
      appliedFilters: {
        sortKey,
        vendors,
        productTypes,
        tags,
        available,
        priceMin,
        priceMax,
        selectedSubcollections,
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

const COLLECTION_INFO_QUERY = `#graphql
  query CollectionInfo(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
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
` as const;

const COLLECTION_PRODUCTS_QUERY = `#graphql
  fragment ProductItem on Product {
    id
    handle
    title
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
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    vendor
    productType
    tags
    availableForSale
    variants(first: 1) {
      nodes {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }

  query CollectionProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      products(
        first: $first,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
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
      }
    }
  }
` as const;

const SUBCOLLECTIONS_QUERY = `#graphql
  query Subcollections(
    $query: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, query: $query) {
      nodes {
        id
        handle
        title
      }
    }
  }
` as const;