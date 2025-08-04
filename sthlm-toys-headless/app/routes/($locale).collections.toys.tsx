import {
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {CollectionPage} from '~/components/CollectionPage';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: `${data?.collection?.title || 'Collection'} | STHLM Toys & Games`},
  {
    name: 'description',
    content:
      data?.collection?.description ||
      'Discover amazing products in this collection.',
  },
];

export async function loader({context, request, params}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {handle} = params;
  const pagination = getPaginationVariables(request, {pageBy: 24});

  if (!handle) {
    throw new Response('Collection handle required', {status: 400});
  }

  // Skip Level 1 collections - they have their own specific routes
  const level1Collections = ['toys', 'brands', 'characters', 'rea'];
  if (level1Collections.includes(handle)) {
    throw new Response('Use specific Level 1 route', {status: 404});
  }

  try {
    const [collectionResult, mainProductsResult, possibleSubcollectionsResult] =
      await Promise.all([
        // 1. Get main collection info
        storefront.query(
          `#graphql
        query Collection($handle: String!, $country: CountryCode, $language: LanguageCode)
          @inContext(country: $country, language: $language) {
          collection(handle: $handle) {
            id
            title
            handle
            description
            image { id url altText width height }
          }
        }
      `,
          {
            variables: {
              handle,
              country: storefront.i18n?.country,
              language: storefront.i18n?.language,
            },
          },
        ),

        // 2. Get products from main collection
        storefront.query(
          `#graphql
        fragment CollectionProductItem on Product {
          id
          handle
          title
          featuredImage { id altText url width height }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          vendor
          productType
        }
        query CollectionProducts(
          $handle: String!
          $country: CountryCode
          $language: LanguageCode
          $first: Int
          $last: Int
          $startCursor: String
          $endCursor: String
        ) @inContext(country: $country, language: $language) {
          collection(handle: $handle) {
            products(
              first: $first,
              last: $last,
              before: $startCursor,
              after: $endCursor
            ) {
              nodes { ...CollectionProductItem }
              pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
            }
          }
        }
      `,
          {
            variables: {
              handle,
              country: storefront.i18n?.country,
              language: storefront.i18n?.language,
              ...pagination,
            },
          },
        ),

        // 3. Look for possible subcollections by searching for collections that start with this handle
        // This will find LEGO City, LEGO Friends, etc. when on LEGO collection
        storefront.query(
          `#graphql
        query PossibleSubcollections($searchTerm: String!, $country: CountryCode, $language: LanguageCode)
          @inContext(country: $country, language: $language) {
          collections(first: 50, query: $searchTerm) {
            nodes {
              id
              title
              handle
              image { id url altText width height }
            }
          }
        }
      `,
          {
            variables: {
              searchTerm: `title:${handle}*`, // Search for collections starting with handle
              country: storefront.i18n?.country,
              language: storefront.i18n?.language,
            },
          },
        ),
      ]);

    const collection = collectionResult.collection;

    if (!collection) {
      throw new Response('Collection not found', {status: 404});
    }

    const mainProducts = mainProductsResult.collection?.products.nodes || [];

    // Filter subcollections - exclude the main collection itself and find actual subcollections
    const allFoundCollections =
      possibleSubcollectionsResult.collections.nodes || [];
    const subcollections = allFoundCollections.filter(
      (coll) =>
        coll.handle !== handle && // Exclude self
        coll.handle.startsWith(handle + '-'), // Only include actual subcollections (lego-city, lego-friends)
    );

    let allProducts = [...mainProducts];

    // If we found subcollections, this is a Level 2 collection - get products from subcollections too
    if (subcollections.length > 0) {
      console.log(
        `Level 2 collection detected: ${handle} with ${subcollections.length} subcollections`,
      );

      // Get products from all subcollections
      const subcollectionProductQueries = await Promise.all(
        subcollections.slice(0, 10).map(
          (
            subcollection, // Limit to 10 subcollections for performance
          ) =>
            storefront.query(
              `#graphql
            fragment SubCollectionProductItem on Product {
              id
              handle
              title
              featuredImage { id altText url width height }
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              vendor
              productType
            }
            query SubCollectionProducts($handle: String!, $country: CountryCode, $language: LanguageCode)
              @inContext(country: $country, language: $language) {
              collection(handle: $handle) {
                products(first: 50) {
                  nodes { ...SubCollectionProductItem }
                }
              }
            }
          `,
              {
                variables: {
                  handle: subcollection.handle,
                  country: storefront.i18n?.country,
                  language: storefront.i18n?.language,
                },
              },
            ),
        ),
      );

      // Combine all subcollection products
      const subProducts = subcollectionProductQueries.flatMap(
        (result) => result.collection?.products.nodes || [],
      );

      // Add subcollection products to main products
      allProducts = [...mainProducts, ...subProducts];
    } else {
      console.log(
        `Level 3 collection detected: ${handle} - showing only direct products`,
      );
    }

    // Remove duplicates (products might be in multiple collections)
    const uniqueProductsMap = new Map();
    allProducts.forEach((product) => {
      uniqueProductsMap.set(product.id, product);
    });
    const uniqueProducts = Array.from(uniqueProductsMap.values());

    // Create combined products object
    const combinedProducts = {
      nodes: uniqueProducts,
      pageInfo: mainProductsResult.collection?.products.pageInfo || {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };

    return {
      collection,
      products: combinedProducts,
      relatedCollections: subcollections.length > 0 ? subcollections : null,
    };
  } catch (error) {
    console.error('Error loading collection:', error);
    throw new Response('Error loading collection', {status: 500});
  }
}

export default function GenericCollection() {
  const {collection, products, relatedCollections} =
    useLoaderData<typeof loader>();

  return (
    <CollectionPage
      collection={collection}
      productsData={products}
      relatedCollections={relatedCollections}
    />
  );
}
