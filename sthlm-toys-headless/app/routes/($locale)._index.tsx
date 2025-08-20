// FILE: app/routes/($locale)._index.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Updated homepage with requested changes

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
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
// import {ShopByCharacter} from '~/components/ShopByCharacter'; // ✅ DISABLED: Shop by character section

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
      // shopByCharacterData, // ✅ DISABLED: Character data query
      shopByDiscountData,
      heroData, // ✅ EXISTING: Hero metafields query
    ] = await Promise.all([
      context.storefront.query(FEATURED_COLLECTION_QUERY),
      context.storefront.query(TOP_CATEGORIES_QUERY),
      context.storefront.query(SHOP_BY_BRAND_QUERY),
      context.storefront.query(FEATURED_BANNERS_QUERY),
      // context.storefront.query(SHOP_BY_CHARACTER_QUERY), // ✅ DISABLED: Character query
      context.storefront.query(SHOP_BY_DISCOUNT_QUERY),
      context.storefront.query(HERO_BANNER_QUERY), // ✅ EXISTING: Hero query
    ]);

    return {
      featuredCollection: featuredCollectionData.collections.nodes[0],
      topCategories: topCategoriesData.collections.nodes || [],
      shopByBrandData: shopByBrandData.collections.nodes || [],
      featuredBanners: featuredBannersData.collections.nodes || [],
      // shopByCharacterData: shopByCharacterData.collections.nodes || [], // ✅ DISABLED: Character data
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
      // shopByCharacterData: [], // ✅ DISABLED: Character fallback
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
      {/* ✅ FIXED: Hero Banner with yellow background + your original image */}
      <HeroBanner
        title={heroData.title || 'Bygg, skapa & föreställ dig'}
        subtitle={
          heroData.subtitle ||
          'Upptäck oändliga möjligheter med vår fantastiska LEGO-kollektion'
        }
        buttonText={heroData.buttonText || 'Handla nu'}
        buttonLink={heroData.buttonLink || '/collections/lego'}
        // ✅ REVERTED: Back to your original uploaded image URLs
        backgroundImage="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948"
        mobileBackgroundImage="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948"
        backgroundColor={heroData.backgroundColor || '#FFD42B'} // ✅ KEPT: Yellow background
        textColor={heroData.textColor || '#1F2937'}
      />

      {/* ✅ FIXED: Age section appears FIRST below hero */}
      <ShopByBrand brands={data.shopByBrandData} />

      {/* ✅ FIXED: TopCategories Section appears SECOND */}
      <TopCategories collections={data.topCategories} />

      {/* ✅ UPDATED: Featured Banners Section - Title removed for closer spacing */}
      <FeaturedBanners collections={data.featuredBanners} />

      {/* ✅ DISABLED: Shop By Character Section - Now commented out 
      <ShopByCharacter characters={data.shopByCharacterData} />
      */}

      {/* ✅ UPDATED: Shop By Discount Section - Repurposed for Price */}
      <ShopByDiscount discounts={data.shopByDiscountData} />

      {/* ✅ EXISTING: Featured Products Section - exactly as you had it */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <Await resolve={data.homepageProducts}>
          {(response) => {
            if (!response) {
              console.log('No homepage products response');
              return null;
            }

            const featuredProducts = response.featuredCollection?.products?.nodes || [];
            
            if (featuredProducts.length === 0) {
              console.log('No featured products found. Make sure "featured-homepage-products" collection has products.');
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

      {/* ✅ EXISTING: Sale Products Section - exactly as you had it */}
      <Suspense fallback={<SaleProductsSkeleton />}>
        <Await resolve={data.homepageProducts}>
          {(response) => {
            if (!response) return null;

            const saleProducts = response.saleCollection?.products?.nodes || [];
            
            if (saleProducts.length === 0) {
              console.log('No sale products found. Make sure "sale-homepage-products" collection has products.');
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

      {/* ✅ FIXED: Recommended Products Section - NOW WITH ADD TO CART */}
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
                  {/* ✅ FIXED: Desktop layout - NO "Visa alla" link */}
                  <div className="hidden md:block">
                    {/* Header with ONLY centered title */}
                    <div className="flex items-center justify-center mb-8">
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
                        Rekommenderade produkter
                      </h2>
                    </div>

                    {/* Desktop Product Grid */}
                    <div className="grid grid-cols-4 gap-6">
                      {recommendedProducts.slice(0, 4).map((product: ProductFragment) => (
                        <div key={product.id} className="group">
                          {/* Product Card */}
                          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                            {/* Product Image */}
                            <Link to={`/products/${product.handle}`} className="block">
                              <div className="relative aspect-square bg-gray-50">
                                {product.featuredImage?.url ? (
                                  <Image
                                    data={product.featuredImage}
                                    aspectRatio="1/1"
                                    sizes="(min-width: 768px) 25vw, 50vw"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                                    loading="lazy"
                                    style={{ padding: '8px' }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">Ingen bild</span>
                                  </div>
                                )}
                              </div>
                            </Link>

                            {/* Product Info */}
                            <div className="p-4 flex flex-col flex-grow">
                              <Link to={`/products/${product.handle}`}>
                                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                  {product.title}
                                </h3>
                              </Link>

                              {/* Price */}
                              <div className="mb-4">
                                {product.priceRange?.minVariantPrice && (
                                  <Money
                                    data={product.priceRange.minVariantPrice}
                                    className="text-lg font-semibold text-gray-900"
                                  />
                                )}
                              </div>

                              {/* ✅ ADDED: Add to Cart Button */}
                              <div className="mt-auto">
                                <AddToCartButton
                                  disabled={!product.selectedOrFirstAvailableVariant?.availableForSale}
                                  onClick={() => {
                                    const {open} = useAside();
                                    open('cart');
                                  }}
                                  lines={product.selectedOrFirstAvailableVariant ? [{
                                    merchandiseId: product.selectedOrFirstAvailableVariant.id,
                                    quantity: 1,
                                    selectedVariant: product.selectedOrFirstAvailableVariant,
                                  }] : []}
                                >
                                  {product.selectedOrFirstAvailableVariant?.availableForSale
                                    ? 'Lägg till i kundvagn'
                                    : 'Slutsåld'}
                                </AddToCartButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="block md:hidden">
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
                      }}
                    >
                      Rekommenderade produkter
                    </h2>

                    {/* Mobile Stack */}
                    <div className="space-y-4">
                      {recommendedProducts.slice(0, 4).map((product: ProductFragment) => (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <div className="flex">
                            {/* Product Image */}
                            <Link to={`/products/${product.handle}`} className="block w-24 h-24">
                              {product.featuredImage?.url ? (
                                <Image
                                  data={product.featuredImage}
                                  aspectRatio="1/1"
                                  sizes="96px"
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">Ingen bild</span>
                                </div>
                              )}
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 p-4 flex flex-col">
                              <Link to={`/products/${product.handle}`}>
                                <h3 className="font-medium text-gray-900 mb-1 text-sm line-clamp-2">
                                  {product.title}
                                </h3>
                              </Link>

                              {/* Price */}
                              {product.priceRange?.minVariantPrice && (
                                <Money
                                  data={product.priceRange.minVariantPrice}
                                  className="text-base font-semibold text-gray-900 mb-2"
                                />
                              )}

                              {/* ✅ ADDED: Mobile Add to Cart Button */}
                              <AddToCartButton
                                disabled={!product.selectedOrFirstAvailableVariant?.availableForSale}
                                onClick={() => {
                                  const {open} = useAside();
                                  open('cart');
                                }}
                                lines={product.selectedOrFirstAvailableVariant ? [{
                                  merchandiseId: product.selectedOrFirstAvailableVariant.id,
                                  quantity: 1,
                                  selectedVariant: product.selectedOrFirstAvailableVariant,
                                }] : []}
                                className="text-sm py-2"
                              >
                                {product.selectedOrFirstAvailableVariant?.availableForSale
                                  ? 'Lägg till'
                                  : 'Slutsåld'}
                              </AddToCartButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

// ✅ EXISTING: Keep all your exact queries
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
      {namespace: "app", key: "featured_category"},
      {namespace: "custom", key: "sort_order"},
      {namespace: "app", key: "sort_order"}
    ]) {
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
      {namespace: "app", key: "featured_brand"},
      {namespace: "custom", key: "sort_order"},
      {namespace: "app", key: "sort_order"}
    ]) {
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
      {namespace: "app", key: "featured_discount"},
      {namespace: "custom", key: "sort_order"},
      {namespace: "app", key: "sort_order"}
    ]) {
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
    collections(first: 100, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedBanner
      }
    }
  }
` as const;

// Hero Banner Query
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
        key
        value
        namespace
      }
    }
  }
` as const;

// Featured Collection Query
const FEATURED_COLLECTION_QUERY = `#graphql
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
` as const;

// Skeleton components
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
        {/* Desktop */}
        <div className="hidden md:block">
          <div className="flex justify-center mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex">
                  <div className="w-24 h-24 bg-gray-200 animate-pulse"></div>
                  <div className="flex-1 p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}