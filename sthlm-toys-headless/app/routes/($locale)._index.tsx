// FILE: app/routes/($locale)._index.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Swedish translation + consistent styling

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

// ✅ UPDATED: New horizontal scrolling product components
import {FeaturedProducts, FeaturedProductsSkeleton} from '~/components/FeaturedProducts';
import {SaleProducts, SaleProductsSkeleton} from '~/components/SaleProducts';

// ✅ EXISTING: Product queries
import {
  HOMEPAGE_PRODUCTS_COMBINED_QUERY,
} from '~/lib/homepage-product-queries';

export const meta: MetaFunction = () => {
  return [{title: 'STHLM Toys & Games | Hem'}];
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
 * ✅ EXISTING: Keep existing + add new product sections
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

  // ✅ EXISTING: Homepage product sections
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

        {/* ✅ UPDATED: Featured Products Section - Swedish translation */}
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <Await
            resolve={data.homepageProducts}
            errorElement={
              <div className="py-12 text-center text-gray-500">
                <p>Utvalda produkter är tillfälligt otillgängliga</p>
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
                  title="Utvalda Produkter"
                  showViewAll={true}
                />
              );
            }}
          </Await>
        </Suspense>

        {/* ✅ EXISTING: Shop By Brand Section - exactly as you had it */}
        <ShopByBrand brands={data.shopByBrandData} />

        {/* ✅ UPDATED: Sale Products Section - Swedish translation */}
        <Suspense fallback={<SaleProductsSkeleton />}>
          <Await
            resolve={data.homepageProducts}
            errorElement={
              <div className="py-12 text-center text-gray-500">
                <p>Rea produkter är tillfälligt otillgängliga</p>
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
                  title="Rea Produkter"
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

        {/* ✅ FIXED: Recommended Products Section - Now with consistent styling like other sections */}
        <Suspense fallback={<RecommendedProductsSkeleton />}>
          <Await resolve={data.recommendedProducts}>
            {(response) => {
              if (!response) return null;
              
              const recommendedProducts = response.products?.nodes || [];
              
              if (recommendedProducts.length === 0) return null;

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
                    {/* ✅ FIXED: Now uses same styling pattern as other sections */}
                    <div className="hidden md:block">
                      {/* Header with centered title and right-aligned Shop All link */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex-1"></div>
                        <div className="flex-1 flex justify-center">
                          <h2
                            className="text-black font-semibold"
                            style={{
                              fontSize: '36px',
                              fontWeight: 600,
                              lineHeight: '42px',
                              fontFamily:
                                "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                              color: 'rgb(33, 36, 39)',
                              textAlign: 'center',
                            }}
                          >
                            Du kanske också gillar
                          </h2>
                        </div>
                        <div className="flex-1 flex justify-end">
                          <Link
                            to="/collections"
                            className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            style={{
                              fontSize: '18px',
                              fontWeight: 500,
                              fontFamily:
                                "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                              color: '#3B82F6',
                              textDecoration: 'none',
                              alignSelf: 'center',
                            }}
                          >
                            Visa alla produkter
                          </Link>
                        </div>
                      </div>

                      {/* Desktop Grid */}
                      <div className="grid grid-cols-4 gap-6">
                        {recommendedProducts.map((product: any, index: number) => (
                          <RecommendedProductCard
                            key={product.id}
                            product={product}
                            loading={index < 4 ? 'eager' : 'lazy'}
                            variant="desktop"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="block md:hidden">
                      {/* Mobile Title */}
                      <h2
                        className="text-black font-semibold text-center mb-6"
                        style={{
                          fontSize: '24px',
                          fontWeight: 600,
                          lineHeight: '28px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                          color: 'rgb(33, 36, 39)',
                          textAlign: 'center',
                          marginBottom: '24px',
                        }}
                      >
                        Du kanske också gillar
                      </h2>

                      {/* Mobile Grid - same as desktop but responsive */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {recommendedProducts.map((product: any, index: number) => (
                          <RecommendedProductCard
                            key={product.id}
                            product={product}
                            loading={index < 4 ? 'eager' : 'lazy'}
                            variant="mobile"
                          />
                        ))}
                      </div>

                      {/* Mobile Shop All Link */}
                      <div className="text-center">
                        <Link
                          to="/collections"
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                          style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            fontFamily:
                              "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                            textDecoration: 'none',
                          }}
                        >
                          Visa alla produkter
                        </Link>
                      </div>
                    </div>

                    {/* Subtitle below products */}
                    <div className="text-center mt-6">
                      <p 
                        className="text-gray-600"
                        style={{
                          fontSize: '16px',
                          fontFamily:
                            "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        }}
                      >
                        Fler produkter baserat på vad andra kunder tittar på
                      </p>
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

// ✅ FIXED: Updated RecommendedProductCard with proper image containment
function RecommendedProductCard({
  product,
  loading,
  variant = 'desktop',
}: {
  product: any;
  loading?: 'eager' | 'lazy';
  variant?: 'desktop' | 'mobile';
}) {
  const productVariant = product.selectedOrFirstAvailableVariant;

  const cardStyle = variant === 'desktop' 
    ? { width: '100%', minHeight: '320px' }
    : { width: '100%' };

  return (
    <Link
      className="recommended-product group"
      key={product.id}
      prefetch="intent"
      to={`/products/${product.handle}`}
      style={cardStyle}
    >
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow duration-200 h-full">
        {/* ✅ FIXED: Product Image with proper containment */}
        <div className="relative aspect-square bg-gray-50">
          {product.featuredImage ? (
            <Image
              data={product.featuredImage}
              aspectRatio="1/1"
              sizes={variant === 'desktop' ? "(min-width: 768px) 25vw, 50vw" : "180px"}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              loading={loading}
              style={{
                padding: '8px', // Add padding to ensure full product visibility
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Ingen bild</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h4 
            className="font-medium text-gray-900 mb-2 line-clamp-2"
            style={{
              fontSize: variant === 'desktop' ? '16px' : '14px',
              lineHeight: variant === 'desktop' ? '20px' : '18px',
              fontFamily:
                "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            {product.title}
          </h4>

          {/* Price */}
          {productVariant?.price && (
            <div className="flex items-center gap-2">
              <Money 
                data={productVariant.price}
                className="font-semibold text-gray-900"
                style={{
                  fontSize: variant === 'desktop' ? '16px' : '14px',
                  fontFamily:
                    "Buenos Aires, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ✅ FIXED: Updated skeleton with consistent styling
function RecommendedProductsSkeleton() {
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
        {/* Desktop Skeleton */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <div className="h-10 w-64 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 flex justify-end">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="block md:hidden">
          <div className="h-7 w-48 bg-gray-200 rounded mx-auto mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-5 w-32 bg-gray-200 rounded mx-auto"></div>
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

// ✅ EXISTING: All your collection queries - keep exactly as you had them
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