import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {HeroBanner} from '~/components/HeroBanner';
import {TopCategories} from '~/components/TopCategories';
import {FeaturedBanners} from '~/components/FeaturedBanners';
import {ShopByBrand} from '~/components/ShopByBrand';
import {ShopByCharacter} from '~/components/ShopByCharacter';

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
    ] = await Promise.all([
      context.storefront.query(FEATURED_COLLECTION_QUERY),
      context.storefront.query(TOP_CATEGORIES_QUERY),
      context.storefront.query(SHOP_BY_BRAND_QUERY),
      context.storefront.query(FEATURED_BANNERS_QUERY),
      context.storefront.query(SHOP_BY_CHARACTER_QUERY),
    ]);

    return {
      featuredCollection: featuredCollectionData.collections.nodes[0],
      topCategories: topCategoriesData.collections.nodes || [],
      shopByBrandData: shopByBrandData.collections.nodes || [],
      featuredBanners: featuredBannersData.collections.nodes || [],
      shopByCharacterData: shopByCharacterData.collections.nodes || [],
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
    };
  }
}

/**
 * Load data for rendering content below the fold.
 * This data is deferred and will be fetched after the initial page load.
 * If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{margin: 0, padding: 0}}>
      {/* Hero Banner - Immediately after header with no gap */}
      <HeroBanner
        title="Bygg, skapa & föreställ dig"
        subtitle="Upptäck oändliga möjligheter med vår fantastiska LEGO-kollektion"
        buttonText="Handla nu"
        buttonLink="/collections/lego"
        mobileBackgroundImage="https://cdn.shopify.com/s/files/1/0900/8811/2507/files/hero-mobile2.png?v=1753985948"
      />

      <div className="home">
        {/* Top Categories Section - Updated to match ShopByBrand styling */}
        <TopCategories collections={data.topCategories} />

        {/* Shop By Brand Section */}
        <ShopByBrand brands={data.shopByBrandData} />

        {/* Featured Banners Section - Square Banners */}
        <FeaturedBanners collections={data.featuredBanners} />

        {/* Shop By Character Section */}
        <ShopByCharacter characters={data.shopByCharacterData} />
      </div>
    </div>
  );
}

// GraphQL Queries
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

// Top Categories Query - Updated to use featured-category metafield
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

// Shop By Character Query - New query for characters
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
