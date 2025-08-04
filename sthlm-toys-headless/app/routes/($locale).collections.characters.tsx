import {
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {useLoaderData} from 'react-router';
import {CategoryLevel1} from '~/components/CategoryLevel1';

export const meta: MetaFunction = () => [
  {title: 'Karaktärer | STHLM Toys & Games'},
  {
    name: 'description',
    content: 'Upptäck leksaker med dina favoritkaraktärer.',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Only query collections for category cards - Search & Discovery handles products
  const {collections} = await storefront.query(
    `#graphql
    query CharacterCollections($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
      collections(first: 50, sortKey: TITLE) {
        nodes {
          id
          title
          handle
          image { id url altText width height }
          metafields(identifiers: [
            {namespace: "custom", key: "featured-character"},
            {namespace: "custom", key: "featured_character"},
            {namespace: "app", key: "featured-character"},
            {namespace: "app", key: "featured_character"}
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

export default function CharactersCategory() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <CategoryLevel1
      categoryType="characters"
      title="Karaktärer"
      description="Upptäck leksaker med dina favoritkaraktärer från film, TV och spel."
      categoriesData={collections}
      seoTitle="Om våra karaktärer"
      seoContent={`<p>Låt dina barn utforska världar fulla av äventyr tillsammans med sina favoritkaraktärer.</p>`}
      analyticsData={{id: 'characters-category', handle: 'characters'}}
    />
  );
}
