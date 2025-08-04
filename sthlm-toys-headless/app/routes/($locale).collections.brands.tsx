import {
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {CategoryLevel1} from '~/components/CategoryLevel1';

export const meta: MetaFunction = () => [
  {title: 'Märken | STHLM Toys & Games'},
  {
    name: 'description',
    content: 'Utforska produkter från alla dina favoritmärken.',
  },
];

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const pagination = getPaginationVariables(request, {pageBy: 24});

  // Get both brand collections AND ALL products
  const [brandCollectionsResult, allProductsResult] = await Promise.all([
    // Brand collections for cards
    storefront.query(
      `#graphql
      query BrandCollections($country: CountryCode, $language: LanguageCode)
        @inContext(country: $country, language: $language) {
        collections(first: 50, sortKey: TITLE) {
          nodes {
            id
            title
            handle
            image { id url altText width height }
            metafields(identifiers: [
              {namespace: "custom", key: "featured-brand"},
              {namespace: "custom", key: "featured_brand"},
              {namespace: "app", key: "featured-brand"},
              {namespace: "app", key: "featured_brand"}
            ]) { key value namespace }
          }
        }
      }
    `,
      {
        variables: {
          country: storefront.i18n?.country,
          language: storefront.i18n?.language,
        },
      },
    ),

    // ALL PRODUCTS - No filtering, show everything
    storefront.query(
      `#graphql
      fragment BrandProductItem on Product {
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
      query AllProducts(
        $country: CountryCode
        $language: LanguageCode
        $first: Int
        $last: Int
        $startCursor: String
        $endCursor: String
      ) @inContext(country: $country, language: $language) {
        products(
          first: $first,
          last: $last,
          before: $startCursor,
          after: $endCursor
        ) {
          nodes { ...BrandProductItem }
          pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
        }
      }
    `,
      {
        variables: {
          country: storefront.i18n?.country,
          language: storefront.i18n?.language,
          ...pagination,
        },
      },
    ),
  ]);

  return {
    collections: brandCollectionsResult.collections.nodes,
    products: allProductsResult.products || null,
  };
}

export default function BrandsCategory() {
  const {collections, products} = useLoaderData<typeof loader>();

  return (
    <CategoryLevel1
      categoryType="brands"
      title="Märken"
      description="Utforska produkter från alla dina favoritmärken. LEGO, Barbie, Hot Wheels, Disney och många fler."
      categoriesData={collections}
      productsData={products}
      seoTitle="Om våra märken"
      seoContent={`<p>Vi erbjuder produkter från världens mest älskade leksaksmärken.</p>`}
      analyticsData={{id: 'brands-category', handle: 'brands'}}
    />
  );
}
