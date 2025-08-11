// FILE: app/routes/($locale)._index.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: FIXED - Defensive props handling

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
  ProductFragment,
} from 'storefrontapi.generated';

// ✅ EXISTING: Keep all your existing components
import {HeroBanner} from '~/components/HeroBanner';
import {TopCategories} from '~/components/TopCategories';
import {ShopByDiscount} from '~/components/ShopByDiscount';
import {FeaturedBanners} from '~/components/FeaturedBanners';
import {ShopByBrand} from '~/components/ShopByBrand';
import {ShopByCharacter} from '~/components/ShopByCharacter';

// ✅ NEW: Add product section components (only add these files, don't replace anything)
import {FeaturedProducts, FeaturedProductsSkeleton} from '~/components/FeaturedProducts';
import {SaleProducts, SaleProductsSkeleton} from '~/components/SaleProducts';

// ✅ NEW: Product queries
import {
  HOMEPAGE_PRODUCTS_COMBINED_QUERY,
} from '~/lib/homepage-product-queries';

export const meta: MetaFunction = () => {
  return [{title: 'STHLM Toys & Games | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * ✅ EXISTING: Keep your exact loadCriticalData function with all existing sections
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  try {
    const [
      featuredCollectionData,
      topCategoriesData,
      shopByBrandData,
      featuredBannersData,
      shopByCharacterData,
      shopByDiscountData,
      heroData, // ✅ EXISTING: Hero metafields query
    ] = await Promise.all([
      context.storefront.query(FEATURED_COLLECTION_QUERY),
      context.storefront.query(TOP_CATEGORIES_QUERY),
      context.storefront.query(SHOP_BY_BRAND_QUERY),
      context.storefront.query(FEATURED_BANNERS_QUERY),
      context.storefront.query(SHOP_BY_CHARACTER_QUERY),
      context.storefront.query(SHOP_BY_DISCOUNT_QUERY),
      context.storefront.query(HERO_BANNER_QUERY), // ✅ EXISTING: Hero query
    ]);

    return {
      featuredCollection: featuredCollectionData.collections.nodes[0],
      topCategories: topCategoriesData.collections.nodes || [],
      shopByBrandData: shopByBrandData.collections.nodes || [],
      featuredBanners: featuredBannersData.collections.nodes || [],
      shopByCharacterData: shopByCharacterData.collections.nodes || [],
      shopByDiscountData: shopByDiscountData.collections.nodes || [],
      heroMetafields: heroData.shop.metafields || [], // ✅ EXISTING: Hero metafields
    };
  } catch (error) {
    console.error('Error loading collections:', error);
    // Fallback to empty arrays if queries fail
    return {
      featuredCollection: null,
      topCategories: [],
      shopByBrandData: [],
      featuredBanners: [],
      shopByCharacterData: [],
      shopByDiscountData: [],
      heroMetafields: [], // ✅ EXISTING: Fallback for hero metafields
    };
  }
}

/**
 * ✅ ENHANCED: Keep existing + add new product sections
 * Load data for rendering content below the fold. This data is deferred and will be 
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  // ✅ EXISTING: Keep existing recommended products query
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error('Recommended products error:', error);
      return null;
    });

  // ✅ NEW: Add homepage product sections
  const homepageProducts = context.storefront
    .query(HOMEPAGE_PRODUCTS_COMBINED_QUERY, {
      variables: {
        featuredFirst: 8,
        saleFirst: 8,
      },
    })
    .catch((error) => {
      console.error('Homepage products error:', error);
      return null;
    });

  return {
    recommendedProducts,
    homepageProducts,
  };
}

// ✅ EXISTING: Keep your exact helper function
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

  // ✅ EXISTING: Extract hero data from metafields
  const heroData = getHeroData(data.heroMetafields || []);

  return (
    <div style={{margin: 0, padding: 0}}>
      {/* ✅ EXISTING: Hero Banner exactly as you had it */}
      <HeroBanner
        title={heroData.title || 'Bygg, skapa & föreställ dig'}
        subtitle={
          heroData.subtitle ||
          'Upptäck oändliga möjligheter med vår fantastiska LEGO-kollektion'
        }
        buttonText={heroData.buttonText || 'Handla nu'}
        buttonLink={heroData.buttonLink || '/collections/lego'}
        // ✅ EXISTING: Keep working URLs
        backgroundImage="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948"
        mobileBackgroundImage="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948"
        backgroundColor={heroData.backgroundColor || '#FFD42B'}
        textColor={heroData.textColor || '#1F2937'}
      />

      <div className="home">
        {/* ✅ EXISTING: Top Categories Section - exactly as you had it */}
        <TopCategories collections={data.topCategories} />

        {/* ✅ NEW: Featured Products Section - positioned after categories */}
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <Await
            resolve={data.homepageProducts}
            errorElement={
              <div className="py-12 text-center text-gray-500">
                <p>Featured products temporarily unavailable</p>
              </div>
            }
          >
            {(homepageProducts) => {
              const featuredProducts = homepageProducts?.featuredCollection?.products?.nodes || [];
              
              if (featuredProducts.length === 0) {
                console.log('⚠️ No featured products found. Make sure "featured-homepage-products" collection has products.');
                return null;
              }

              return (
                <FeaturedProducts
                  products={featuredProducts}
                  title="Featured Products"
                  subtitle="Discover our hand-picked favorites from top brands"
                  showViewAll={true}
                />
              );
            }}
          </Await>
        </Suspense>

        {/* ✅ EXISTING: Shop By Brand Section - exactly as you had it */}
        <ShopByBrand brands={data.shopByBrandData} />

        {/* ✅ NEW: Sale Products Section - positioned after brands */}
        <Suspense fallback={<SaleProductsSkeleton />}>
          <Await
            resolve={data.homepageProducts}
            errorElement={
              <div className="py-12 text-center text-gray-500">
                <p>Sale products temporarily unavailable</p>
              </div>
            }
          >
            {(homepageProducts) => {
              const saleProducts = homepageProducts?.saleCollection?.products?.nodes || [];
              
              if (saleProducts.length === 0) {
                console.log('⚠️ No sale products found. Make sure "sale-homepage-products" collection has products.');
                return null;
              }

              return (
                <SaleProducts
                  products={saleProducts}
                  title="Sale Products"
                  subtitle="Limited time offers you don't want to miss"
                  showViewAll={true}
                  showTimer={false}
                />
              );
            }}
          </Await>
        </Suspense>

        {/* ✅ EXISTING: Featured Banners Section - exactly as you had it */}
        <FeaturedBanners collections={data.featuredBanners} />

        {/* ✅ EXISTING: Shop By Character Section - exactly as you had it */}
        <ShopByCharacter characters={data.shopByCharacterData} />

        {/* ✅ EXISTING: Shop By Discount Section - exactly as you had it */}
        <ShopByDiscount discounts={data.shopByDiscountData} />

        {/* ✅ FIXED: Recommended Products Section with direct styling (no SectionHeading component issues) */}
        <Suspense fallback={<RecommendedProductsSkeleton />}>
          <Await resolve={data.recommendedProducts}>
            {(response) => {
              if (!response) return null;
              
              const recommendedProducts = response.products?.nodes || [];
              
              if (recommendedProducts.length === 0) return null;

              return (
                <section className="py-12 lg:py-16">
                  <div className="mx-auto" style={{ maxWidth: '1272px', paddingLeft: '16px', paddingRight: '16px' }}>
                    
                    {/* ✅ FIXED: Direct styling instead of SectionHeading component to avoid prop issues */}
                    <div className="text-center mb-8 lg:mb-12">
                      <h2 
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                        style={{
                          fontFamily: 'var(--font-primary)',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        Du kanske också gillar
                      </h2>
                      <p 
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        style={{
                          fontFamily: 'var(--font-primary)',
                        }}
                      >
                        Fler produkter baserat på vad andra kunder tittar på
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                      {recommendedProducts.map((product: any, index: number) => (
                        <RecommendedProductCard
                          key={product.id}
                          product={product}
                          loading={index < 4 ? 'eager' : 'lazy'}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

// ✅ EXISTING: Keep your exact RecommendedProductCard component
function RecommendedProductCard({
  product,
  loading,
}: {
  product: any;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.selectedOrFirstAvailableVariant;
  const productAnalytics = {
    productGid: product.id,
    variantGid: variant.id,
    name: product.title,
    variantName: variant.title,
    brand: product.vendor,
    price: variant.price.amount,
    quantity: 1,
  };

  return (
    <Link
      className="recommended-product"
      key={product.id}
      prefetch="intent"
      to={`/products/${product.handle}`}
    >
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {product.featuredImage && (
          <Image
            data={product.featuredImage}
            aspectRatio="1/1"
            sizes="(min-width: 45em) 20vw, 50vw"
            loading={loading}
            className="w-full"
          />
        )}
        <div className="p-4">
          <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">
            {product.title}
          </h4>
          <small className="text-gray-600">
            <Money data={variant.price} />
          </small>
        </div>
      </div>
    </Link>
  );
}

// ✅ FIXED: Simple skeleton without SectionHeading component
function RecommendedProductsSkeleton() {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto" style={{ maxWidth: '1272px', paddingLeft: '16px', paddingRight: '16px' }}>
        
        {/* ✅ FIXED: Direct skeleton styling */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="h-8 lg:h-10 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-5 lg:h-6 w-96 bg-gray-200 rounded mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ✅ EXISTING: Keep all your exact GraphQL queries
const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
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
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

// ✅ EXISTING: Hero Banner Query
const HERO_BANNER_QUERY = `#graphql
  query HeroBanner($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      metafields(identifiers: [
        {namespace: "custom", key: "hero-homepage-title"},
        {namespace: "custom", key: "hero-homepage-subtitle"},
        {namespace: "custom", key: "hero-homepage-button-text"},
        {namespace: "custom", key: "hero-homepage-button-link"},
        {namespace: "custom", key: "hero-homepage-background-color"},
        {namespace: "custom", key: "hero-homepage-text-color"}
      ]) {
        key
        value
      }
    }
  }
` as const;

// ✅ EXISTING: Keep your exact recommended products query  
const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
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
    selectedOrFirstAvailableVariant(selectedOptions: []) {
      id
      title
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
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

// ✅ EXISTING: All your collection queries (Add these back exactly as you had them)
// Top Categories Query
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
      {namespace: "app", key: "featured_category"}
    ]) {
      key
      value
      namespace
    }
  }
  query TopCategories($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: TITLE) {
      nodes {
        ...TopCategory
      }
    }
  }
` as const;

// Shop By Brand Query
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
      {namespace: "app", key: "featured_brand"}
    ]) {
      key
      value
      namespace
    }
  }
  query ShopByBrand($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: TITLE) {
      nodes {
        ...ShopByBrand
      }
    }
  }
` as const;

// Shop By Character Query
const SHOP_BY_CHARACTER_QUERY = `#graphql
  fragment ShopByCharacter on Collection {
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
      {namespace: "custom", key: "featured-character"},
      {namespace: "custom", key: "featured_character"},
      {namespace: "app", key: "featured-character"},
      {namespace: "app", key: "featured_character"}
    ]) {
      key
      value
      namespace
    }
  }
  query ShopByCharacter($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: TITLE) {
      nodes {
        ...ShopByCharacter
      }
    }
  }
` as const;

// Shop By Discount Query
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
      {namespace: "app", key: "featured_discount"}
    ]) {
      key
      value
      namespace
    }
  }
  query ShopByDiscount($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: TITLE) {
      nodes {
        ...ShopByDiscount
      }
    }
  }
` as const;

// Featured Banners Query
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
      key
      value
      namespace
    }
  }
  query FeaturedBanners($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedBanner
      }
    }
  }
` as const;