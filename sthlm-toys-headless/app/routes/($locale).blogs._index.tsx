// FILE: app/routes/($locale).blogs._index.tsx
// ✅ PRODUCTION READY: Shows all articles directly (single blog setup)

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {getCanonicalUrlForPath} from '~/lib/canonical';

// Define the article type locally
type ArticleItemFragment = {
  id: string;
  handle: string;
  title: string;
  contentHtml: string;
  publishedAt: string;
  image?: {
    id: string;
    altText?: string;
    url: string;
    width?: number;
    height?: number;
  };
  author?: {
    name: string;
  };
  blog: {
    handle: string;
  };
};

export const meta: MetaFunction = () => {
  return [
    {title: 'Bloggar & Artiklar | Klosslabbet'},
    {
      name: 'description',
      content: 'Utforska våra bloggar med de senaste LEGO®-nyheterna, byggtips, produktrecensioner och inspiration för alla åldrar. Från nybörjare till avancerade byggare.',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getCanonicalUrlForPath('/blogs'),
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  // Query the main blog (assumed to be called "news" - adjust if different)
  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLES_QUERY, {
      variables: {
        blogHandle: 'news', // ⚠️ Change this to your actual blog handle if different
        ...paginationVariables,
      },
    }),
  ]);

  return {
    articles: blog?.articles || { 
      nodes: [], 
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      }
    }
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Blogs() {
  const {articles} = useLoaderData<typeof loader>();
  const hasArticles = articles.nodes && articles.nodes.length > 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Bloggar & Artiklar
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Utforska våra bloggar för de senaste LEGO®-nyheterna, byggtips, 
              produktrecensioner och inspiration för alla åldrar.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-12">
        {hasArticles ? (
          <>
            {/* Articles Count */}
            <div className="mb-8">
              <p className="text-gray-600 text-sm">
                {articles.nodes.length} {articles.nodes.length === 1 ? 'artikel' : 'artiklar'}
              </p>
            </div>

            {/* Articles Grid */}
            <PaginatedResourceSection 
              connection={articles}
              resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {({node: article, index}) => {
                const typedArticle = article as ArticleItemFragment;
                return (
                  <ArticleItem
                    article={typedArticle}
                    key={typedArticle.id}
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                );
              }}
            </PaginatedResourceSection>
          </>
        ) : (
          /* Empty State */
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  className="w-12 h-12 text-blue-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Våra artiklar kommer snart!
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Vi håller på att skriva vårt första inlägg med de senaste LEGO®-nyheterna, 
                byggtips och produktrecensioner. Kom tillbaka snart för spännande innehåll!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/collections/all"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                }}
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: '#ffffff' }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                </svg>
                <span style={{ color: '#ffffff' }}>Utforska produkter</span>
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  border: '2px solid #d1d5db',
                }}
              >
                <span style={{ color: '#374151' }}>Tillbaka till startsidan</span>
              </Link>
            </div>
          </div>
        )}
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

  // Extract plain text from HTML for excerpt
  const getExcerpt = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <Link to={`/blogs/${article.blog.handle}/${article.handle}`} className="group block h-full">
      <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full border border-gray-100 hover:border-blue-200 flex flex-col">
        {/* Article Image */}
        {article.image ? (
          <div className="relative w-full h-64 overflow-hidden bg-gray-100">
            <Image
              alt={article.image.altText || article.title}
              data={article.image}
              loading={loading}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          /* Fallback if no image */
          <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-blue-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
              />
            </svg>
          </div>
        )}

        {/* Article Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Date & Author */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <time dateTime={article.publishedAt}>
              {publishedAt}
            </time>
            {article.author?.name && (
              <span className="flex items-center">
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                {article.author.name}
              </span>
            )}
          </div>

          {/* Article Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>

          {/* Article Excerpt */}
          {article.contentHtml && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
              {getExcerpt(article.contentHtml)}
            </p>
          )}

          {/* Read More Link */}
          <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors mt-auto">
            <span>Läs mer</span>
            <svg 
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

const ARTICLES_QUERY = `#graphql
  query Articles(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItemFragment
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  fragment ArticleItemFragment on Article {
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