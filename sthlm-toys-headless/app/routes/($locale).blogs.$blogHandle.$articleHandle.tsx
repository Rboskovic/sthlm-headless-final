// FILE: app/routes/($locale).blogs.$blogHandle.$articleHandle.tsx
// ✅ FIXED: Removed blue header and featured image, pure Shopify content

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, Link} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `${data?.article.title ?? ''} - Klosslabbet`},
    {name: 'description', content: data?.article.seo?.description || data?.article.title},
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
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle,
    },
    {
      handle: blogHandle,
      data: blog,
    },
  );

  const article = blog.articleByHandle;

  return {article, blogHandle, blogTitle: blog.title};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Article() {
  const {article, blogHandle, blogTitle} = useLoaderData<typeof loader>();
  const {title, contentHtml} = article; // ✅ Added title back for meta function

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="container py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/blogs" className="hover:text-blue-600 transition-colors">
            Bloggar
          </Link>
          <span>/</span>
          <Link to={`/blogs/${blogHandle}`} className="hover:text-blue-600 transition-colors">
            {blogTitle}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{title}</span>
        </nav>
      </div>

      {/* Article Container */}
      <article className="container pb-16">
        <div className="max-w-4xl mx-auto">
          {/* ✅ COMPLETELY REMOVED: All custom headers - pure Shopify content only */}

          {/* ✅ PURE SHOPIFY CONTENT: All styling and content from Shopify blog editor */}
          <div 
            className="shopify-blog-content"
            dangerouslySetInnerHTML={{__html: contentHtml}}
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#374151'
            }}
          />

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-center">
              {/* Back to Blog */}
              <Link 
                to={`/blogs/${blogHandle}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
                Tillbaka till {blogTitle}
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}

// NOTE: Removed image field from query since we don't need it
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      title
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;