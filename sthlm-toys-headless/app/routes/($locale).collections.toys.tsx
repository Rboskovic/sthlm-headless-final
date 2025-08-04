import { type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';
import { CategoryLevel1 } from '~/components/CategoryLevel1';

export const meta: MetaFunction = () => [
  { title: 'Leksaker | STHLM Toys & Games' },
  { name: 'description', content: 'Upptäck vårt stora utbud av leksaker för alla åldrar.' }
];

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;
  
  // Use EXACT same query as homepage TopCategories
  const { collections } = await storefront.query(`#graphql
    query ToyCategories($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
      collections(first: 50, sortKey: TITLE) {
        nodes {
          id
          title
          handle
          image { id url altText width height }
          metafields(identifiers: [
            {namespace: "custom", key: "featured-category"},
            {namespace: "custom", key: "featured_category"},
            {namespace: "app", key: "featured-category"},
            {namespace: "app", key: "featured_category"}
          ]) { key value namespace }
        }
      }
    }
  `, {
    variables: {
      country: storefront.i18n?.country,
      language: storefront.i18n?.language,
    },
  });

  return { collections: collections.nodes };
}

export default function ToysCategory() {
  const { collections } = useLoaderData<typeof loader>();

  return (
    <CategoryLevel1
      categoryType="toys"
      title="Leksaker"
      description="Upptäck vårt stora utbud av leksaker för alla åldrar. Från LEGO och Barbie till pedagogiska leksaker och spel."
      categoriesData={collections}
      seoTitle="Om våra leksaker"
      seoContent={`
        <p>Välkommen till vår omfattande samling av leksaker!</p>
        <h3>Våra kategorier:</h3>
        <ul>
          <li><strong>Actionfigurer & Lekset</strong> - Hjältar och karaktärer</li>
          <li><strong>Konstruktion & Bilar</strong> - LEGO och byggstenar</li>
          <li><strong>Förskola & Elektronik</strong> - Pedagogiska leksaker</li>
        </ul>
      `}
      analyticsData={{ id: 'toys-category', handle: 'toys' }}
    />
  );
}
