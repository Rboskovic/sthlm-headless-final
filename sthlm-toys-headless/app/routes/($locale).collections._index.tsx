// FILE: app/routes/($locale).collections._index.tsx
// ✅ FIXED: Proper styling and layout for collections overview page

import {useLoaderData, Link, type MetaFunction} from 'react-router';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {getCanonicalUrlForPath} from '~/lib/canonical';

export const meta: MetaFunction<typeof loader> = () => {
  return [
    {title: 'Alla Kollektioner | Klosslabbet'},
    {
      name: 'description',
      content: 'Bläddra igenom alla våra LEGO®-kollektioner. Hitta dina favoritserier, teman och specialutgåvor. ✓ Stort urval ✓ Snabb leverans ✓ Säker betalning',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getCanonicalUrlForPath('/collections'),
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12, // Show 12 collections initially (3 rows of 4 on desktop)
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

/**
 * Load deferred data
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="collections-page">
      {/* Page Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6">
          Alla Kollektioner
        </h1>
        
        {/* SEO Intro */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-gray-600 text-lg leading-relaxed">
            Bläddra igenom alla våra LEGO®-kollektioner. Från populära teman till 
            specialutgåvor och exklusiva serier – hitta precis det du letar efter.
          </p>
        </div>

        {/* Collections Grid with Pagination */}
        <PaginatedResourceSection
          connection={collections}
          resourcesClassName="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {({node: collection, index}) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              loading={index < 8 ? 'eager' : 'lazy'}
            />
          )}
        </PaginatedResourceSection>

        {/* SEO Outro */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              Vi är en auktoriserad återförsäljare av LEGO® och köper våra produkter direkt från LEGO Group. 
              Detta innebär att du alltid kan vara säker på att produkterna du handlar hos oss är 100% äkta, 
              nya och originalförpackade.
            </p>
            <p>
              Vi erbjuder ett brett sortiment av LEGO®-set för både barn och vuxna – från klassiska byggsatser 
              till nyheter och samlarserier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CollectionCard Component
 * Styled card for individual collection with hover effects
 */
function CollectionCard({
  collection,
  loading = 'lazy',
}: {
  collection: CollectionFragment;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group block"
    >
      <div className="flex flex-col items-center text-center">
        
        {/* Collection Image Container */}
        <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3 group-hover:shadow-lg transition-all duration-200">
          {collection?.image ? (
            <Image
              alt={collection.image.altText || collection.title}
              data={collection.image}
              aspectRatio="1/1"
              loading={loading}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          ) : (
            // Fallback design when no image available
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-2xl sm:text-3xl lg:text-4xl font-bold">
                LEGO®
              </div>
            </div>
          )}
        </div>

        {/* Collection Title */}
        <h3 className="text-sm lg:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight px-1">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;