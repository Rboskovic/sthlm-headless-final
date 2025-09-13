// FILE: app/routes/($locale).blogs.$blogHandle._index.tsx
// ✅ UPDATED: Swedish language, better styling, consistent with ages page

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `${data?.blog.title ?? ''} - Klosslabbet`},
    {name: 'description', content: data?.blog.seo?.description || `Läs artiklar från ${data?.blog.title}`},
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="container py-6">
        <div className="bg-black text-white py-6 px-6 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Description */}
      {blog.seo?.description && (
        <div className="container py-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
              {blog.seo.description}
            </p>
          </div>
        </div>
      )}

      {/* Back to Blogs Link */}
      <div className="container pb-4">
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
          Tillbaka till alla bloggar
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PaginatedResourceSection connection={articles}>
            {({node: article, index}) => (
              <ArticleItem
                article={article}
                key={article.id}
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </div>
    </div>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
        {/* Article Image */}
        {article.image && (
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="16/9"
              data={article.image}
              loading={loading}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Article Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          
          {/* Article Excerpt - Extract from contentHtml if no excerpt field */}
          {article.contentHtml && (
            <div 
              className="text-gray-600 text-sm mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: article.contentHtml.substring(0, 150) + '...'
              }}
            />
          )}
          
          <div className="flex justify-between items-center">
            <time className="text-xs text-gray-500" dateTime={article.publishedAt}>
              {publishedAt}
            </time>
            {article.author?.name && (
              <span className="text-xs text-gray-500">
                av {article.author.name}
              </span>
            )}
          </div>
          
          <div className="mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors">
            Läs mer →
          </div>
        </div>
      </Link>
    </article>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;