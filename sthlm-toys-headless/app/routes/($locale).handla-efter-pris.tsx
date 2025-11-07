// FILE: app/routes/($locale).handla-efter-pris.tsx
// ✅ FIXED: Square image cards + hardcoded image header

import {type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from 'react-router';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import { getCanonicalUrlForPath } from '~/lib/canonical';

export const meta: MetaFunction = () => {
  return [
    {title: 'Handla LEGO®-set efter pris - Klosslabbet'},
    {name: 'description', content: 'LEGO®-set är perfekta julklappar för både barn och vuxna, oavsett budget. Hitta det perfekta tillskottet till din LEGO-samling eller välj den bästa födelsedags- eller säsongsgåvan till vänner, familj eller nära och kära.'},
    {
      tagName: 'link',
      rel: 'canonical',
      href: getCanonicalUrlForPath('/handla-efter-pris'),
    },
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  try {
    // Fetch discount page collections
    const discountCollectionsData = await storefront.query(DISCOUNT_COLLECTIONS_QUERY);
    const allCollections = discountCollectionsData?.collections?.nodes || [];

    // Filter collections that have BOTH discountpage_collection=true AND age_lifestyle_image
    const filteredDiscountCollections = allCollections.filter((collection: Collection) => {
      const getMetafieldValue = (key: string) => {
        const metafield = collection.metafields?.find(field => 
          field?.key === key && (field.namespace === 'custom' || field.namespace === 'app')
        );
        return metafield?.value || null;
      };

      const isDiscountCollection = getMetafieldValue('discountpage_collection') === 'true';
      const lifestyleImageValue = getMetafieldValue('age_lifestyle_image');
      
      return isDiscountCollection && lifestyleImageValue;
    }).sort((a: Collection, b: Collection) => {
      const getSortOrder = (collection: Collection) => {
        const sortOrderField = collection.metafields?.find(field => 
          field?.key === 'sort_order' && (field.namespace === 'custom' || field.namespace === 'app')
        );
        return sortOrderField?.value ? parseInt(sortOrderField.value) : 999;
      };
      
      return getSortOrder(a) - getSortOrder(b);
    });

    // Fetch blog articles for discount page
    const blogsData = await storefront.query(DISCOUNT_BLOGS_QUERY);
    const allArticles = [];

    // Collect all articles from all blogs
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

    // Filter articles that have discount_page=true metafield
    const discountArticles = allArticles.filter((article: any) => {
      const discountPageMetafield = article.metafields?.find(
        (field: any) => field?.key === 'discount_page' && 
        (field.namespace === 'custom' || field.namespace === 'app')
      );
      return discountPageMetafield?.value === 'true';
    });

    return {
      discountCollections: filteredDiscountCollections,
      discountArticles: discountArticles,
    };
  } catch (error) {
    return {
      discountCollections: [],
      discountArticles: [],
    };
  }
}

export default function HandlaEfterPrisPage() {
  const {discountCollections, discountArticles} = useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      {/* ✅ FIXED: Hardcoded Image Header */}
      <div className="container py-6">
        <div className="rounded-xl overflow-hidden">
          <img
            src="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/allAID25166eeP2GL_LOBS_2025_Price_Section_Header_3000x200_45df9a12-4fb2-4521-8641-9df855dfdb6a.png?v=1758234887"
            alt="Handla LEGO®-set efter pris"
            className="w-full h-auto"
            loading="eager"
          />
        </div>
      </div>

      {/* ✅ Description Section - Updated content */}
      <div className="container pt-2 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            LEGO®-set är perfekta julklappar för både <Link to="/collections/barn" className="text-blue-600 hover:underline">barn</Link> och{' '}
            <Link to="/collections/vuxna" className="text-blue-600 hover:underline">vuxna</Link>, oavsett budget. Hitta det perfekta tillskottet till din{' '}
            <Link to="/collections/lego-samling" className="text-blue-600 hover:underline">LEGO-samling</Link> eller välj den bästa{' '}
            <Link to="/collections/födelsedag" className="text-blue-600 hover:underline">födelsedags</Link>- eller{' '}
            <Link to="/collections/säsong" className="text-blue-600 hover:underline">säsongsgåvan</Link> till vänner, familj eller nära och kära.
          </p>
        </div>
      </div>

      {/* ✅ Price Collections Grid */}
      <div className="container pb-4">
        {discountCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {discountCollections.map((collection: Collection) => (
              <PriceCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              Prissamlingar kommer snart! Kontrollera att kollektioner har både discountpage_collection=true och age_lifestyle_image inställda.
            </p>
          </div>
        )}
      </div>

      {/* ✅ Blog Articles Section with Carousel */}
      {discountArticles && discountArticles.length > 0 && (
        <BlogCarouselSection articles={discountArticles} />
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
          <h2 className="text-2xl font-bold text-gray-900">Välja rätt LEGO®-leksak efter åldersgrupp</h2>
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
 * ✅ REVERTED: Price Card Component - Back to Original Rectangle Format
 */
function PriceCard({collection}: {collection: Collection}) {
  // Extract metafield values with proper namespace checking
  const getMetafieldValue = (key: string) => {
    const metafield = collection.metafields?.find(field => 
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
        {/* ✅ REVERTED: Original Rectangle Format for Price Cards */}
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

// GraphQL Query for Discount Page Collections
const DISCOUNT_COLLECTIONS_QUERY = `#graphql
  query DiscountCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        description
        metafields(identifiers: [
          {namespace: "custom", key: "discountpage_collection"},
          {namespace: "app", key: "discountpage_collection"},
          {namespace: "custom", key: "age_lifestyle_image"},
          {namespace: "app", key: "age_lifestyle_image"},
          {namespace: "custom", key: "sort_order"},
          {namespace: "app", key: "sort_order"}
        ]) {
          key
          value
          namespace
        }
      }
    }
  }
` as const;

// GraphQL Query for Blog Articles with discount_page metafield
const DISCOUNT_BLOGS_QUERY = `#graphql
  query DiscountBlogs($country: CountryCode, $language: LanguageCode)
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
              {namespace: "custom", key: "discount_page"},
              {namespace: "app", key: "discount_page"}
            ]) {
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