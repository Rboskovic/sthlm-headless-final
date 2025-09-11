// FILE: app/routes/($locale)._index.tsx - Enhanced with all requested changes
// ✅ SHOPIFY HYDROGEN STANDARDS: Homepage with improved UX and proper ordering

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
import {ShopByBrand} from '~/components/ShopByBrand';
import {ProductItem} from '~/components/ProductItem';

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
      content: 'Handla LEGO och leksaker online hos Klosslabbet. Fri frakt över 989 kr. Säkert köp och konkurrenskraftiga priser direkt hem till dig.'
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
      shopByBrandData,
      featuredBannersData,
      shopByDiscountData,
      heroData,
    ] = await Promise.all([
      context.storefront.query(TOP_CATEGORIES_QUERY),
      context.storefront.query(SHOP_BY_BRAND_QUERY),
      context.storefront.query(FEATURED_BANNERS_QUERY),
      context.storefront.query(SHOP_BY_DISCOUNT_QUERY),
      context.storefront.query(HERO_BANNER_QUERY),
    ]);

    return {
      topCategories: topCategoriesData.collections.nodes || [],
      shopByBrandData: shopByBrandData.collections.nodes || [],
      featuredBanners: featuredBannersData.collections.nodes || [],
      shopByDiscountData: shopByDiscountData.collections.nodes || [],
      heroMetafields: heroData.shop.metafields || [],
    };
  } catch (error) {
    console.error('Error loading collections:', error);
    return {
      topCategories: [],
      shopByBrandData: [],
      featuredBanners: [],
      shopByDiscountData: [],
      heroMetafields: [],
    };
  }
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const newProducts = context.storefront
    .query(NEW_PRODUCTS_QUERY, {
      variables: { first: 12 }, // Load 12 for arrows functionality
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
        buttonText={heroData.buttonText || 'Handla nu'}
        buttonLink={heroData.buttonLink || '/collections/lego'}
        backgroundImage="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948"
        mobileBackgroundImage="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948"
        backgroundColor={heroData.backgroundColor || '#FFD42B'}
        textColor={heroData.textColor || '#1F2937'}
      />

      {/* ✅ 1. New Products Section - Smyths-style arrows */}
      <Suspense fallback={<ProductSectionSkeleton title="Nya produkter" />}>
        <Await resolve={data.newProducts}>
          {(response) => {
            if (!response) return null;
            const newProducts = response.products?.nodes || [];
            if (newProducts.length === 0) return null;

            return (
              <SmythsStyleProductSection
                products={newProducts as ProductFragment[]}
                title="Nya produkter"
                showAddedLabels={true}
              />
            );
          }}
        </Await>
      </Suspense>

      {/* ✅ 2. Shop By Age (Handla efter ålder) - MOVED UP */}
      <TopCategories collections={data.topCategories} />

      {/* ✅ 3. Featured Banners - Keep as is */}
      <FeaturedBanners collections={data.featuredBanners} />

      {/* ✅ 4. REA PRODUKTER SECTION - TURNED OFF */}
      {/* 
      <Suspense fallback={<ProductSectionSkeleton title="Rea Produkter" />}>
        <Await resolve={data.homepageProducts}>
          {(response) => {
            if (!response) return null;
            const rawSaleProducts = response.saleProducts?.nodes || [];
            const sortedSaleProducts = sortSaleProductsByDiscount(rawSaleProducts);
            if (sortedSaleProducts.length === 0) return null;

            return (
              <SmythsStyleProductSection
                products={sortedSaleProducts as ProductFragment[]}
                title="Rea Produkter"
                showAddedLabels={false}
              />
            );
          }}
        </Await>
      </Suspense>
      */}

      {/* ✅ 5. Shop By Discount (Handla efter pris) */}
      <ShopByDiscount discounts={data.shopByDiscountData as any} />

      {/* ✅ 6. Shop By Brand/Theme (Shoppa efter tema) - MOVED DOWN */}
      <ShopByBrand brands={data.shopByBrandData} />

      {/* ✅ 7. Recommended Products Section - Keep button style */}
      <Suspense fallback={<ProductSectionSkeleton title="Rekommenderade produkter" />}>
        <Await resolve={data.homepageProducts}>
          {(response) => {
            if (!response) return null;
            const collections = response.collections?.nodes || [];
            const featuredProducts = sampleFeaturedProducts(collections, 12);
            if (featuredProducts.length === 0) return null;

            return (
              <RecommendedProductsSection
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

// Helper function to calculate "added X days ago"
function getDaysAgo(updatedAt: string): string {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffTime = Math.abs(now.getTime() - updated.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'idag';
  if (diffDays === 1) return '1 dag sedan';
  if (diffDays <= 7) return `${diffDays} dagar sedan`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} veckor sedan`;
  return `${Math.floor(diffDays / 30)} månader sedan`;
}

// Smyths-Style Product Section with proper crossfade animation
function SmythsStyleProductSection({ 
  products, 
  title, 
  showAddedLabels = false 
}: { 
  products: ProductFragment[]; 
  title: string; 
  showAddedLabels?: boolean;
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
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-black font-semibold"
              style={{
                fontSize: '28px',
                fontWeight: 600,
                lineHeight: '32px',
                fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'rgb(33, 36, 39)',
              }}
            >
              {title}
            </h2>

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

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changePage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentPage === index 
                        ? 'bg-gray-900 w-6' 
                        : 'bg-gray-400 hover:bg-gray-600'
                    }`}
                    aria-label={`Page ${index + 1}`}
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

// Recommended Products Section with inline show more
function RecommendedProductsSection({ 
  products, 
  title 
}: { 
  products: ProductFragment[]; 
  title: string; 
}) {
  const [displayCount, setDisplayCount] = useState(8);
  
  const showMore = () => {
    setDisplayCount(prev => Math.min(prev + 8, products.length));
  };
  
  const currentProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  return (
    <section className="w-full bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2
            className="text-black font-semibold mb-2"
            style={{
              fontSize: '32px',
              fontWeight: 600,
              lineHeight: '36px',
              fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              color: 'rgb(33, 36, 39)',
            }}
          >
            {title}
          </h2>
          <p className="text-gray-600 text-lg">
            Handplockade favoriter bara för dig
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {currentProducts.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 4 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        {/* Mobile Grid */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {currentProducts.slice(0, Math.min(displayCount, 4)).map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        {/* Show More Button - Inline loading */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={showMore}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'white',
              }}
            >
              Visa fler produkter
            </button>
          </div>
        )}
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

const SHOP_BY_BRAND_QUERY = `#graphql
  fragment ShopByBrand on Collection {
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
  query ShopByBrand($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: TITLE) {
      nodes {
        ...ShopByBrand
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
      {namespace: "custom", key: "featured-banner"},
      {namespace: "custom", key: "featured_banner"},
      {namespace: "app", key: "featured-banner"},
      {namespace: "app", key: "featured_banner"}
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
  query NewProducts($first: Int = 12) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        vendor
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
` as const;