// FILE: app/routes/($locale)._index.tsx - Enhanced with all requested changes
// ✅ SHOPIFY HYDROGEN STANDARDS: Homepage with improved UX and proper ordering

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from 'react-router';
import {Suspense, useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import type {ProductFragment} from 'storefrontapi.generated';

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
  return [{title: 'STHLM Toys & Games | Hem'}];
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

      {/* ✅ 2. Shop By Brand/Age (Shoppa efter tema) - Keep as is */}
      <ShopByBrand brands={data.shopByBrandData} />

      {/* ✅ 3. Featured Banners - Keep as is */}
      <FeaturedBanners collections={data.featuredBanners} />

      {/* ✅ 4. Sale Products Section - Smyths-style arrows */}
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

      {/* ✅ 5. Shop By Discount (Handla efter pris) */}
      <ShopByDiscount discounts={data.shopByDiscountData as any} />

      {/* ✅ 6. Shop By Age (Handla efter ålder) - TopCategories moved here */}
      <TopCategories collections={data.topCategories} />

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

// Smyths-Style Product Section with arrow navigation
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
  
  const productsPerPage = 4;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const hasMultiplePages = totalPages > 1;
  
  const currentProducts = products.slice(
    currentPage * productsPerPage, 
    (currentPage + 1) * productsPerPage
  );

  const goToPage = (pageIndex: number) => {
    if (isAnimating || pageIndex === currentPage) return;
    
    setIsAnimating(true);
    setCurrentPage(pageIndex);
    
    // Reset animation after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <section>
      <div
        className="mx-auto relative"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '32px',
          paddingBottom: '16px',
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h2
                className="text-black font-semibold"
                style={{
                  fontSize: '36px',
                  fontWeight: 600,
                  lineHeight: '42px',
                  fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: 'rgb(33, 36, 39)',
                  textAlign: 'center',
                }}
              >
                {title}
              </h2>
            </div>
            
            {/* Desktop Arrow Navigation */}
            {hasMultiplePages && (
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    currentPage === 0 
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-500 mx-2">
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    currentPage === totalPages - 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          {/* Product Grid with Animation */}
          <div 
            className={`grid grid-cols-4 gap-6 transition-all duration-300 ${
              isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
            }`}
          >
            {currentProducts.map((product, index) => (
              <div key={`${product.id}-${currentPage}`} className="relative">
                <ProductItem
                  product={product}
                  loading={index < 4 ? 'eager' : 'lazy'}
                />
                {/* Added days ago label for new products */}
                {showAddedLabels && (
                  <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {getDaysAgo(product.updatedAt || new Date().toISOString())}
                  </div>
                )}
              </div>
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
          
          {/* Mobile Product Grid */}
          <div 
            className={`grid grid-cols-2 gap-4 transition-all duration-300 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {currentProducts.map((product, index) => (
              <div key={`${product.id}-${currentPage}-mobile`} className="relative">
                <ProductItem
                  product={product}
                  loading={index < 4 ? 'eager' : 'lazy'}
                />
                {showAddedLabels && (
                  <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {getDaysAgo(product.updatedAt || new Date().toISOString())}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          {hasMultiplePages && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`p-2 rounded-full ${
                  currentPage === 0 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-500">
                {currentPage + 1} / {totalPages}
              </span>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-full ${
                  currentPage === totalPages - 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Recommended Products Section with show more button
function RecommendedProductsSection({ products, title }: { products: ProductFragment[]; title: string }) {
  const [showCount, setShowCount] = useState(4);
  
  const canShowMore = products.length > showCount;
  const displayProducts = products.slice(0, showCount);

  const showMore = () => {
    setShowCount(prev => Math.min(prev + 4, products.length));
  };

  return (
    <section>
      <div
        className="mx-auto relative"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '32px',
          paddingBottom: '16px',
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center mb-8">
            <h2
              className="text-black font-semibold"
              style={{
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: '42px',
                fontFamily: "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                color: 'rgb(33, 36, 39)',
                textAlign: 'center',
              }}
            >
              {title}
            </h2>
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            {displayProducts.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
            ))}
          </div>

          {/* Show More Button - Desktop */}
          {canShowMore && (
            <div className="text-center mt-8">
              <button
                onClick={showMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors duration-200"
              >
                Visa fler produkter
              </button>
            </div>
          )}
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
          
          <div className="grid grid-cols-2 gap-4">
            {displayProducts.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
            ))}
          </div>

          {/* Show More Button - Mobile */}
          {canShowMore && (
            <div className="text-center mt-6">
              <button
                onClick={showMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Visa fler produkter
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Inline Skeleton Component
function ProductSectionSkeleton({ title }: { title: string }) {
  return (
    <section>
      <div
        className="mx-auto relative"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '32px',
          paddingBottom: '16px',
        }}
      >
        <div className="hidden md:block">
          <div className="flex items-center justify-center mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="block md:hidden">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="w-full aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Updated New Products Query
const NEW_PRODUCTS_QUERY = `#graphql
  fragment NewProduct on Product {
    id
    title
    handle
    vendor
    updatedAt
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    selectedOrFirstAvailableVariant(selectedOptions: [], ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
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
    }
  }
  query NewProducts($country: CountryCode, $language: LanguageCode, $first: Int = 12)
    @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...NewProduct
      }
    }
  }
` as const;

// All other existing queries remain the same
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
      {namespace: "custom", key: "featured-brand"},
      {namespace: "custom", key: "featured_brand"},
      {namespace: "app", key: "featured-brand"},
      {namespace: "app", key: "featured_brand"},
      {namespace: "custom", key: "sort_order"},
      {namespace: "app", key: "sort_order"}
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
      {namespace: "custom", key: "featured-discount"},
      {namespace: "custom", key: "featured_discount"},
      {namespace: "app", key: "featured-discount"},
      {namespace: "app", key: "featured_discount"},
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