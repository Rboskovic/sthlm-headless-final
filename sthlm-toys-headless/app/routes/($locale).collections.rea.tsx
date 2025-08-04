import {
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {useLoaderData} from 'react-router';
import {CategoryLevel1} from '~/components/CategoryLevel1';

export const meta: MetaFunction = () => [
  {title: 'Rea & Erbjudanden | STHLM Toys & Games'},
  {
    name: 'description',
    content: 'Upptäck fantastiska erbjudanden och rabatterade leksaker.',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Only query collections for category cards - Search & Discovery handles products
  const {collections} = await storefront.query(
    `#graphql
    query DiscountCollections($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
      collections(first: 50, sortKey: TITLE) {
        nodes {
          id
          title
          handle
          image { id url altText width height }
          metafields(identifiers: [
            {namespace: "custom", key: "featured-discount"},
            {namespace: "custom", key: "featured_discount"},
            {namespace: "app", key: "featured-discount"},
            {namespace: "app", key: "featured_discount"}
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
  );

  return {collections: collections.nodes};
}

export default function ReaCategory() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <CategoryLevel1
      categoryType="discounts"
      title="Rea & Erbjudanden"
      description="Upptäck fantastiska erbjudanden och rabatterade leksaker."
      categoriesData={collections}
      seoTitle="Om våra erbjudanden"
      seoContent={`<p>Våra rea-erbjudanden ger dig möjlighet att köpa högkvalitativa leksaker till reducerade priser.</p>`}
      analyticsData={{id: 'rea-category', handle: 'rea'}}
    />
  );
}
