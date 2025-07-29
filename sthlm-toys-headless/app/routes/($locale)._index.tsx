import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {HeroBanner} from '~/components/HeroBanner';
import {TopCategories} from '~/components/TopCategories';
import {ShopByAge} from '~/components/ShopByAge';
import {FeaturedBrands} from '~/components/FeaturedBrands';

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
    const [featuredCollectionData, topCategoriesData, featuredBrandsData] =
      await Promise.all([
        context.storefront.query(FEATURED_COLLECTION_QUERY),
        context.storefront.query(TOP_CATEGORIES_QUERY),
        context.storefront.query(FEATURED_BRANDS_QUERY),
      ]);

    return {
      featuredCollection: featuredCollectionData.collections.nodes[0],
      topCategories: topCategoriesData.collections.nodes || [],
      featuredBrands: featuredBrandsData.collections.nodes || [],
    };
  } catch (error) {
    console.error('Error loading collections:', error);
    // Fallback to just featured collection if others fail
    try {
      const featuredCollectionData = await context.storefront.query(
        FEATURED_COLLECTION_QUERY,
      );
      return {
        featuredCollection: featuredCollectionData.collections.nodes[0],
        topCategories: [],
        featuredBrands: [],
      };
    } catch (fallbackError) {
      console.error('Error loading fallback data:', fallbackError);
      return {
        featuredCollection: null,
        topCategories: [],
        featuredBrands: [],
      };
    }
  }
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
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
      />

      <div className="home">
        {/* Top Categories Section */}
        <div style={{paddingTop: '8px', paddingBottom: '48px'}}>
          <TopCategories
            title="Populära kategorier"
            collections={data.topCategories}
          />
        </div>

        {/* Featured Collection - Commented out to remove unwanted full-width image */}
        {/* 
        <FeaturedCollection collection={data.featuredCollection} /> 
        */}

        {/* Recommended Products - Smyths styling */}
        <RecommendedProducts products={data.recommendedProducts} />

        {/* Shop by Age Section */}
        <ShopByAge title="Handla efter ålder" />

        {/* Featured Brands Section */}
        <FeaturedBrands brands={data.featuredBrands} />
      </div>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

// Updated RecommendedProducts with Smyths styling
function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section
      className="w-full"
      style={{
        backgroundColor: 'rgb(248, 249, 251)', // Smyths light gray background
        padding: '20px 0px',
      }}
    >
      {/* Container matching Smyths specs */}
      <div
        className="mx-auto"
        style={{
          maxWidth: '1400px',
          padding: '0px 64px',
          fontFamily:
            "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
        }}
      >
        {/* Section Title - Smyths styling */}
        <h2
          className="text-grey-900"
          style={{
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: '36px',
            marginBottom: '24px',
            color: 'rgb(32, 34, 35)',
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
          }}
        >
          Utvalt ur vårt sortiment
        </h2>

        {/* Products Grid - Flex layout like Smyths */}
        <Suspense fallback={<LoadingSkeleton />}>
          <Await resolve={products}>
            {(response) => (
              <div
                className="flex flex-wrap gap-4"
                style={{
                  gap: '16px',
                }}
              >
                {response?.products?.nodes
                  ?.slice(0, 4)
                  ?.map((product, index) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      loading={index < 4 ? 'eager' : 'lazy'}
                    />
                  )) || (
                  <div className="w-full text-center py-8 text-gray-500">
                    No recommended products available
                  </div>
                )}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-wrap gap-4" style={{gap: '16px'}}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse cursor-pointer flex flex-col"
          style={{
            width: '298px',
            height: '443.766px',
            paddingBottom: '12px',
          }}
        >
          {/* Image Skeleton */}
          <div
            className="bg-gray-200"
            style={{
              aspectRatio: '1/1',
              marginBottom: '12px',
            }}
          ></div>

          {/* Content Skeleton */}
          <div className="flex-grow">
            {/* Title lines */}
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

            {/* Price */}
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// UPDATED Top Categories Query with Metafield Filtering
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
      {namespace: "custom", key: "top_category"},
      {namespace: "custom", key: "featured_category"}
    ]) {
      key
      value
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

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

// Featured Brands Query with metafield filtering
const FEATURED_BRANDS_QUERY = `#graphql
  fragment FeaturedBrand on Collection {
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
      {namespace: "custom", key: "featured-brand"}
    ]) {
      key
      value
    }
  }
  query FeaturedBrands($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedBrand
      }
    }
  }
` as const;