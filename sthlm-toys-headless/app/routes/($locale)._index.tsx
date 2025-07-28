import { type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { Await, useLoaderData, Link, type MetaFunction } from "react-router";
import { Suspense } from "react";
import { Image, Money } from "@shopify/hydrogen";
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from "storefrontapi.generated";
import { ProductItem } from "~/components/ProductItem";
import { HeroBanner } from "~/components/HeroBanner";
import { TopCategories } from "~/components/TopCategories";

export const meta: MetaFunction = () => {
  return [{ title: "Hydrogen | Home" }];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: LoaderFunctionArgs) {
  try {
    const [featuredCollectionData, topCategoriesData] = await Promise.all([
      context.storefront.query(FEATURED_COLLECTION_QUERY),
      context.storefront.query(TOP_CATEGORIES_QUERY),
    ]);

    return {
      featuredCollection: featuredCollectionData.collections.nodes[0],
      topCategories: topCategoriesData.collections.nodes || [],
    };
  } catch (error) {
    console.error("Error loading collections:", error);
    // Fallback to just featured collection if top categories fail
    const featuredCollectionData = await context.storefront.query(
      FEATURED_COLLECTION_QUERY
    );
    return {
      featuredCollection: featuredCollectionData.collections.nodes[0],
      topCategories: [],
    };
  }
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
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
    <div style={{ margin: 0, padding: 0 }}>
      {/* Hero Banner - Immediately after header with no gap */}
      <HeroBanner
        title="Build, Create & Imagine"
        subtitle="Discover endless possibilities with our amazing LEGO collection"
        buttonText="Shop Now"
        buttonLink="/collections/lego"
      />
      <div className="home">
        <TopCategories
          title="Top categories"
          collections={data.topCategories}
        />
        <FeaturedCollection collection={data.featuredCollection} />
        <RecommendedProducts products={data.recommendedProducts} />
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

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

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
  }
  query TopCategories($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 10, sortKey: TITLE) {
      nodes {
        ...TopCategory
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
