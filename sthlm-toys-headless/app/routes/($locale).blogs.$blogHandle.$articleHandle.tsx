// FILE: app/routes/($locale).blogs.$blogHandle.$articleHandle.tsx
// ✅ FIXED: Simplified breadcrumb, removed blog name

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, Link} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getCanonicalUrlForPath} from '~/lib/canonical';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `${data?.article.title ?? ''} | Klosslabbet`},
    {
      name: 'description',
      content: data?.article.seo?.description || data?.article.title,
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getCanonicalUrlForPath(`/blogs/${data?.blogHandle}/${data?.article.handle}`),
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

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

  return {article, blogHandle};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, contentHtml} = article;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Navigation - Simplified */}
      <div className="container py-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/blogs" className="hover:text-blue-600 transition-colors">
              Bloggar
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{title}</span>
          </nav>
        </div>
      </div>

      {/* Article Container */}
      <article className="container pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Pure Shopify Content */}
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
              <Link 
                to="/blogs"
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
                Tillbaka till bloggar
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}

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