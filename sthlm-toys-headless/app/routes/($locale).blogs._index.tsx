// FILE: app/routes/($locale).blogs._index.tsx
// ✅ UPDATED: Swedish language, better styling, consistent with ages page

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export const meta: MetaFunction = () => {
  return [
    {title: 'Bloggar & Artiklar - Klosslabbet'},
    {name: 'description', content: 'Läs våra senaste artiklar om LEGO, byggtips, produktnyheter och mycket mer.'},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {blogs};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Blogs() {
  const {blogs} = useLoaderData<typeof loader>();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="container py-6">
        <div className="bg-black text-white py-6 px-6 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
            Bloggar & Artiklar
          </h1>
        </div>
      </div>

      {/* Description */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            Utforska våra bloggar för de senaste LEGO-nyheterna, byggtips, produktrecensioner 
            och inspiration för alla åldrar. Från nybörjare till avancerade byggare, 
            här hittar du något för alla.
          </p>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PaginatedResourceSection connection={blogs}>
            {({node: blog}) => (
              <Link
                to={`/blogs/${blog.handle}`}
                key={blog.handle}
                prefetch="intent"
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h2>
                  {blog.seo?.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {blog.seo.description}
                    </p>
                  )}
                  <div className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    Läs artiklar →
                  </div>
                </div>
              </Link>
            )}
          </PaginatedResourceSection>
        </div>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
` as const;