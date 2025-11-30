// FILE: app/routes/($locale).ages.tsx
// ✅ FIXED: Same changes as price page - hardcoded header, square blog images, no fallback

import {type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from 'react-router';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import { getCanonicalUrlForPath } from '~/lib/canonical';
import {PRICE_AGE_PAGE_QUERY} from '~/lib/fragments';

export const meta: MetaFunction = () => {
  return [
    {title: 'LEGO® Sets efter ålder och gåvor för alla åldrar - Klosslabbet'},
    {name: 'description', content: 'Vi har LEGO® sets perfekt för barn och vuxna i alla åldrar. Från småbarn till tonåringar, det finns gott om att upptäcka med vårt breda sortiment av intressen och budgetar.'},
    {
      tagName: 'link',
      rel: 'canonical',
      href: getCanonicalUrlForPath('/ages'),
    },
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  try {
    const data = await storefront.query(PRICE_AGE_PAGE_QUERY);
    const metaobject = data?.priceAgePage?.nodes?.[0];
    const fields = metaobject?.fields || [];
    
    // ✅ FIX: Remove space in variable name
    const kolecijePoUzrastuField = fields.find((f: any) => f.key === 'kolekcije_kupuj_po_uzrastu');
    const ageCollections = kolecijePoUzrastuField?.references?.nodes || [];

    // Fetch blog articles (keep existing)
    const blogsData = await storefront.query(AGE_BLOGS_QUERY);
    const allArticles = [];

    if (blogsData?.blogs?.nodes) {
      for (const blog of blogsData.blogs.nodes) {
        if (blog.articles?.nodes) {
          allArticles.push(...blog.articles.nodes.map((article: any) => ({
            ...article,
            blogHandle: blog.handle
          })));
        }
      }
    }

    const ageArticles = allArticles.filter((article: any) => {
      const agePageMetafield = article.metafields?.find(
        (field: any) => field?.key === 'age_page' && 
        (field.namespace === 'custom' || field.namespace === 'app')
      );
      return agePageMetafield?.value === 'true';
    });

    return {
      ageCollections,
      ageArticles,
    };
  } catch (error) {
    return {
      ageCollections: [],
      ageArticles: [],
    };
  }
}

export default function AgesPage() {
  const {ageCollections, ageArticles} = useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      {/* ✅ FIXED: Hardcoded Image Header (same as price page) */}
      <div className="container py-6">
        <div className="rounded-xl overflow-hidden">
          <img
            src="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/SE_BrandStore_Separator_Shop_by_Age.jpg?v=1758235859"
            alt="LEGO® Sets efter ålder och gåvor för alla åldrar"
            className="w-full h-auto"
            loading="eager"
          />
        </div>
      </div>

      {/* Description Section */}
      <div className="container pt-2 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            Vi har LEGO® sets perfekt för <Link to="/collections/barn" className="text-blue-600 hover:underline">barn</Link> och{' '}
            <Link to="/collections/vuxna" className="text-blue-600 hover:underline">vuxna</Link> i alla åldrar. Från{' '}
            <Link to="/collections/småbarn" className="text-blue-600 hover:underline">småbarn</Link> till{' '}
            <Link to="/collections/tonåringar" className="text-blue-600 hover:underline">tonåringar</Link>, det finns gott om att upptäcka med vårt breda sortiment av{' '}
            <Link to="/collections/intressen" className="text-blue-600 hover:underline">intressen</Link> och{' '}
            <Link to="/collections/budgetar" className="text-blue-600 hover:underline">budgetar</Link>. Hitta ditt nästa LEGO-tillskott till din LEGO-kollektion eller välj den bästa{' '}
            <Link to="/collections/födelsedag" className="text-blue-600 hover:underline">födelsedags</Link>- eller{' '}
            <Link to="/collections/helgdag" className="text-blue-600 hover:underline">helgdagspresenten</Link> för din vän, kollega eller familj.
          </p>
        </div>
      </div>

      {/* Age Collections Grid */}
      <div className="container pb-4">
        {ageCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ageCollections.map((collection: any) => (
              <AgeCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              Ålderssamlingar kommer snart!.
            </p>
          </div>
        )}
      </div>

      {/* ✅ Blog Articles Section with Carousel */}
      {ageArticles && ageArticles.length > 0 && (
        <BlogCarouselSection articles={ageArticles} />
      )}

      {/* ✅ REMOVED: Blog placeholder section - show nothing if no articles */}
    </div>
  );
}

/**
 * Blog Carousel Section Component
 */
function BlogCarouselSection({articles}: {articles: any[]}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const articlesPerView = 4;
  const maxIndex = Math.max(0, articles.length - articlesPerView);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - articlesPerView));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + articlesPerView));
  };

  const visibleArticles = articles.slice(currentIndex, currentIndex + articlesPerView);

  return (
    <div className="bg-gray-50 pt-8 pb-16">
      <div className="container">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Hitta rätt LEGO®-set för varje ålder</h2>
          <Link 
            to="/blogs" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Visa alla artiklar &gt;
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleArticles.map((article) => (
              <BlogArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Navigation Arrows */}
          {articles.length > articlesPerView && (
            <>
              {/* Previous Arrow */}
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
                  currentIndex === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-xl hover:scale-110'
                }`}
                aria-label="Previous articles"
              >
                <svg 
                  className="w-6 h-6 text-gray-600" 
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
              </button>

              {/* Next Arrow */}
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
                  currentIndex >= maxIndex 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-xl hover:scale-110'
                }`}
                aria-label="Next articles"
              >
                <svg 
                  className="w-6 h-6 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ✅ FIXED: Blog Article Card Component - Square Images for 750x750
 */
function BlogArticleCard({article}: {article: any}) {
  const publishedDate = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/blogs/${article.blogHandle}/${article.handle}`}>
        {/* ✅ FIXED: Square Image Container for 750x750 Blog Images */}
        <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
          {article.image ? (
            <Image
              data={article.image}
              aspectRatio="1/1"
              className="w-full h-full object-cover"
              loading="lazy"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-lg font-bold">Ingen bild</span>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>
          
          {article.excerpt && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {article.excerpt}
            </p>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{publishedDate}</span>
            <span className="text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors">
              Läs mer →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * Age Card Component - Keep original rectangle format
 */
function AgeCard({collection}: {collection: any}) {
  // Extract metafield values with proper namespace checking
  const getMetafieldValue = (key: string) => {
    const metafield = collection.metafields?.find((field: any) => 
      field?.key === key && (field.namespace === 'custom' || field.namespace === 'app')
    );
    return metafield?.value || null;
  };

  const displayTitle = collection.title;
  const lifestyleImageValue = getMetafieldValue('age_lifestyle_image');

  // TypeScript interface for parsed JSON
  interface ShopifyImageData {
    url?: string;
    src?: string;
    alt?: string;
  }

  let lifestyleImageUrl = null;
  
  if (lifestyleImageValue) {
    try {
      const parsed = JSON.parse(lifestyleImageValue) as ShopifyImageData;
      lifestyleImageUrl = parsed.url || parsed.src || lifestyleImageValue;
    } catch {
      // If not JSON, use as direct URL
      lifestyleImageUrl = lifestyleImageValue;
    }
  }

  return (
    <Link to={`/collections/${collection.handle}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Lifestyle Image - Keep original rectangle format */}
        <div className="relative w-full bg-gray-100" style={{ aspectRatio: '420/200' }}>
          {lifestyleImageUrl ? (
            <img
              src={lifestyleImageUrl}
              alt={collection.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={420}
              height={200}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <div className="text-white text-2xl font-bold">{displayTitle}</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{displayTitle}</h3>
          
          {collection.description && (
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {collection.description}
            </p>
          )}
          
          <div className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
            Handla nu →
          </div>
        </div>
      </div>
    </Link>
  );
}

// ✅ FIXED: GraphQL Query for Blog Articles with id field
const AGE_BLOGS_QUERY = `#graphql
  query AgeBlogs($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blogs(first: 10) {
      nodes {
        handle
        articles(first: 50) {
          nodes {
            id
            title
            handle
            excerpt
            publishedAt
            image {
              id
              altText
              url
              width
              height
            }
            metafields(identifiers: [
              {namespace: "custom", key: "age_page"},
              {namespace: "app", key: "age_page"}
            ]) {
              id
              key
              value
              namespace
            }
          }
        }
      }
    }
  }
` as const;