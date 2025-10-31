// FILE: app/routes/($locale)._index.tsx - Using hidden collection for featured products
// ✅ SHOPIFY HYDROGEN STANDARDS: Homepage with improved UX and proper ordering
// ✅ PERFORMANCE: Using hidden collection instead of fetching all products
// ✅ FIXED: Pagination dots now decorative (not interactive)

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from 'react-router';
import {Suspense, useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import type {ProductFragment} from 'storefrontapi.generated';
import {getCanonicalUrlForPath} from '~/lib/canonical';

// ✅ EXISTING: Keep all your existing components
import {HeroBanner} from '~/components/HeroBanner';
import {TopCategories} from '~/components/TopCategories';
import {ShopByDiscount} from '~/components/ShopByDiscount';
import {FeaturedBanners} from '~/components/FeaturedBanners';
import {ShopByAge} from '~/components/ShopByAge';
import {ProductItem} from '~/components/ProductItem';
import {RecommendedProductsHomepage} from '~/components/RecommendedProductsHomepage';

// ✅ NEW: Flexible product queries and helpers
import {
  HOMEPAGE_PRODUCTS_COMBINED_QUERY,
  sampleFeaturedProducts,
  sortSaleProductsByDiscount,
} from '~/lib/homepage-product-queries';

export const meta: MetaFunction = () => {
  return [
    {title: 'Klosslabbet - Sveriges bästa LEGO-leksaksbutik'},
    {
      name: 'description', 
      content: 'Handla LEGO och leksaker online hos Klosslabbet. Fri frakt till ombud över 1299 kr. Säkert köp och konkurrenskraftiga priser.'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getCanonicalUrlForPath('/'),
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: LoaderFunctionArgs) {
  try {
    const [
      topCategoriesData,
      shopByAgeData,
      featuredBannersData,
      shopByDiscountData,
      heroData,
    ] = await Promise.all([
      context.storefront.query(TOP_CATEGORIES_QUERY),
      context.storefront.query(SHOP_BY_AGE_QUERY),
      context.storefront.query(FEATURED_BANNERS_QUERY),
      context.storefront.query(SHOP_BY_DISCOUNT_QUERY),
      context.storefront.query(HERO_BANNER_QUERY),
    ]);

    return {
      topCategories: topCategoriesData.collections.nodes || [],
      shopByAgeData: shopByAgeData.collections.nodes || [],
      featuredBanners: featuredBannersData.collections.nodes || [],
      shopByDiscountData: shopByDiscountData.collections.nodes || [],
      heroMetafields: heroData.shop.metafields || [],
    };
  } catch (error) {
    console.error('Error loading collections:', error);
    return {
      topCategories: [],
      shopByAgeData: [],
      featuredBanners: [],
      shopByDiscountData: [],
      heroMetafields: [],
    };
  }
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const newProducts = context.storefront
    .query(NEW_PRODUCTS_QUERY)
    .then((response) => {
      if (!response?.collection?.products?.nodes) return null;
      
      return {
        products: {
          nodes: response.collection.products.nodes
        }
      };
    })
    .catch((error) => {
      console.error('New products error:', error);
      return null;
    });

  const homepageProducts = context.storefront
    .query(HOMEPAGE_PRODUCTS_COMBINED_QUERY, {
      variables: {
        collectionsFirst: 75,
        productsFirst: 20,
        saleFirst: 30,
      },
    })
    .catch((error) => {
      console.error('Homepage products error:', error);
      return null;
    });

  return {
    newProducts,
    homepageProducts,
  };
}

function getHeroData(metafields: any[]) {
  const getMetafield = (key: string) =>
    metafields.find((field) => field?.key === key)?.value || null;

  return {
    title: getMetafield('hero-homepage-title'),
    subtitle: getMetafield('hero-homepage-subtitle'),
    buttonText: getMetafield('hero-homepage-button-text'),
    buttonLink: getMetafield('hero-homepage-button-link'),
    backgroundColor: getMetafield('hero-homepage-background-color'),
    textColor: getMetafield('hero-homepage-text-color'),
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const heroData = getHeroData(data.heroMetafields || []);

  return (
    <div style={{margin: 0, padding: 0}}>
      <HeroBanner
        title={heroData.title || 'Bygg, skapa & föreställ dig'}
        subtitle={heroData.subtitle || 'Upptäck oändliga möjligheter med vår fantastiska LEGO-kollektion'}
        buttonText={heroData.buttonText || 'Visa teman'}
        buttonLink={heroData.buttonLink || '/themes'}
        backgroundImage="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948"
        mobileBackgroundImage="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948"
        backgroundColor={heroData.backgroundColor || '#FFD42B'}
        textColor={heroData.textColor || '#1F2937'}
      />

      {/* ✅ 1. New Products Section - Product carousel with navigation */}
      <Suspense fallback={<ProductSectionSkeleton title="Nya produkter" />}>
        <Await resolve={data.newProducts}>
          {(response) => {
            if (!response) return null;
            const newProducts = response.products?.nodes || [];
            if (newProducts.length === 0) return null;

            return (
              <ProductCarouselSection
                products={newProducts as ProductFragment[]}
                title="Nya produkter"
              />
            );
          }}
        </Await>
      </Suspense>

      {/* ✅ 2. Shop By Theme (Shoppa efter tema) */}
      <TopCategories collections={data.topCategories as any} />

      {/* ✅ 3. Featured Banners - Keep as is */}
      <FeaturedBanners collections={data.featuredBanners} />

      {/* ✅ 4. Shop By Price (Handla efter pris) */}
      <ShopByDiscount discounts={data.shopByDiscountData as any} />

      {/* ✅ 5. Shop By Age (Hitta rätt LEGO för varje ålder) */}
      <ShopByAge brands={data.shopByAgeData} />

      {/* ✅ 6. Recommended Products Section */}
      <Suspense fallback={<ProductSectionSkeleton title="Rekommenderade produkter" />}>
        <Await resolve={data.homepageProducts}>
          {(response) => {
            if (!response) return null;
            const collections = response.collections?.nodes || [];
            const featuredProducts = sampleFeaturedProducts(collections, 12);
            if (featuredProducts.length === 0) return null;

            return (
              <RecommendedProductsHomepage
                products={featuredProducts as ProductFragment[]}
                title="Rekommenderade produkter"
              />
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

// Product Carousel Section with proper navigation
function ProductCarouselSection({ 
  products, 
  title 
}: { 
  products: ProductFragment[]; 
  title: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const productsPerPageDesktop = 4;
  const productsPerPageMobile = 4;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const productsPerPage = isMobile ? productsPerPageMobile : productsPerPageDesktop;
  
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const hasMultiplePages = totalPages > 1;

  const changePage = (newPage: number) => {
    if (newPage === currentPage || isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentPage(newPage);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 150);
  };

  const nextPage = () => {
    const next = currentPage + 1 >= totalPages ? 0 : currentPage + 1;
    changePage(next);
  };

  const prevPage = () => {
    const prev = currentPage - 1 < 0 ? totalPages - 1 : currentPage - 1;
    changePage(prev);
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* ✅ FIXED: Desktop Header with centered title and right-aligned navigation (same as other sections) */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <h2
                className="text-black font-semibold"
                style={{
                  fontSize: '36px',
                  fontWeight: 600,
                  lineHeight: '42px',
                  fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: 'rgb(33, 36, 39)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
              {hasMultiplePages && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      currentPage === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md'
                    }`}
                    aria-label="Previous products"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      currentPage === totalPages - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md'
                    }`}
                    aria-label="Next products"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Desktop Product Grid with Crossfade */}
          <div 
            className={`grid grid-cols-4 gap-6 transition-opacity duration-300 ${
              isAnimating ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {currentProducts.map((product, index) => (
              <ProductItem
                key={`${product.id}-${currentPage}`}
                product={product}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="text-center mb-6">
            <h2
              className="text-black font-semibold"
              style={{
                fontSize: '24px',
                fontWeight: 600,
                lineHeight: '28px',
                fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'rgb(33, 36, 39)',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </h2>
          </div>
          
          {/* Mobile Product Grid with Crossfade */}
          <div 
            className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${
              isAnimating ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {currentProducts.map((product, index) => (
              <ProductItem
                key={`${product.id}-${currentPage}-mobile`}
                product={product}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
            ))}
          </div>

          {/* Mobile Navigation */}
          {hasMultiplePages && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`p-2 rounded-full transition-all duration-300 ${
                  currentPage === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Previous products"
              >
                <ChevronLeft size={20} />
              </button>

              {/* ✅ FIXED: Decorative pagination dots (not interactive) */}
              <div className="flex gap-2" role="presentation" aria-hidden="true">
                {[...Array(totalPages)].map((_, index) => (
                  <span
                    key={index}
                    className={`rounded-full transition-all duration-300 ${
                      currentPage === index 
                        ? 'bg-gray-900 w-6 h-2' 
                        : 'bg-gray-400 w-2 h-2'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-full transition-all duration-300 ${
                  currentPage === totalPages - 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Next products"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Product Section Skeleton
function ProductSectionSkeleton({ title }: { title: string }) {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

// Queries
const TOP_CATEGORIES_QUERY = `#graphql
  fragment TopCategory on Collection {
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
    metafields(identifiers: [
      {namespace: "custom", key: "featured-category"},
      {namespace: "custom", key: "featured_category"},
      {namespace: "app", key: "featured-category"},
      {namespace: "app", key: "featured_category"},
      {namespace: "custom", key: "sort_order"},
      {namespace: "app", key: "sort_order"}
    ]) {
      id
      key
      value
      namespace
    }
  }
  query TopCategories($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: TITLE) {
      nodes {
        ...TopCategory
      }
    }
  }
` as const;

const SHOP_BY_AGE_QUERY = `#graphql
  fragment ShopByAge on Collection {
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
    metafields(identifiers: [
      {namespace: "custom", key: "featured_brand"},
      {namespace: "custom", key: "featured-brand"},
      {namespace: "app", key: "featured_brand"},
      {namespace: "app", key: "featured-brand"},
      {namespace: "app", key: "sort_order"},
      {namespace: "custom", key: "sort_order"}
    ]) {
      id
      key
      value
      namespace
    }
  }
  query ShopByAge($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: TITLE) {
      nodes {
        ...ShopByAge
      }
    }
  }
` as const;

const SHOP_BY_DISCOUNT_QUERY = `#graphql
  fragment ShopByDiscount on Collection {
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
    metafields(identifiers: [
      {namespace: "custom", key: "featured_discount"},
      {namespace: "custom", key: "featured-discount"},
      {namespace: "app", key: "featured_discount"},
      {namespace: "app", key: "featured-discount"},
      {namespace: "custom", key: "sort_order"},
      {namespace: "app", key: "sort_order"}
    ]) {
      id
      key
      value
      namespace
    }
  }
  query ShopByDiscount($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: TITLE) {
      nodes {
        ...ShopByDiscount
      }
    }
  }
` as const;

const FEATURED_BANNERS_QUERY = `#graphql
  fragment FeaturedBanner on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
    metafields(identifiers: [
      {namespace: "custom", key: "homepage_banner_image"}
    ]) {
      id
      key
      value
      namespace
    }
  }
  query FeaturedBanners($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedBanner
      }
    }
  }
` as const;

const HERO_BANNER_QUERY = `#graphql
  query HeroBanner($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      metafields(identifiers: [
        {namespace: "hero", key: "hero-homepage-title"},
        {namespace: "hero", key: "hero-homepage-subtitle"},
        {namespace: "hero", key: "hero-homepage-button-text"},
        {namespace: "hero", key: "hero-homepage-button-link"},
        {namespace: "hero", key: "hero-homepage-background-color"},
        {namespace: "hero", key: "hero-homepage-text-color"}
      ]) {
        id
        key
        value
        namespace
      }
    }
  }
` as const;

const NEW_PRODUCTS_QUERY = `#graphql
  query FeaturedHomepageProducts {
    collection(handle: "featured-homepage") {
      products(first: 12, sortKey: MANUAL) {
        nodes {
          id
          title
          handle
          vendor
          description
          descriptionHtml
          encodedVariantExistence
          encodedVariantAvailability
          updatedAt
          featuredImage {
            id
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          selectedOrFirstAvailableVariant(selectedOptions: []) {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;