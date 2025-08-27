// FILE: app/lib/homepage-product-queries.ts
// ✅ SHOPIFY HYDROGEN STANDARDS: Updated GraphQL queries for flexible homepage product sections

/**
 * ✅ UPDATED: Homepage Product Fragment
 * Compatible with ProductItem component, includes all necessary fields
 */
const HOMEPAGE_PRODUCT_FRAGMENT = `#graphql
  fragment HomepageProduct on Product {
    id
    title
    vendor
    handle
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
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: [], ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      id
      availableForSale
      sku
      title
      selectedOptions {
        name
        value
      }
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
      product {
        title
        handle
      }
      unitPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

/**
 * ✅ NEW: Featured Collections by Metafield Query
 * Fetches collections that have featured_on_homepage metafield enabled
 * Gets more products for random sampling (20 per collection)
 */
export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 75
    $productsFirst: Int = 20
  ) @inContext(country: $country, language: $language) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        description
        metafields(identifiers: [
          {namespace: "custom", key: "featured_on_homepage"}
        ]) {
          id
          key
          value
          type
          namespace
        }
        products(first: $productsFirst, sortKey: COLLECTION_DEFAULT) {
          nodes {
            ...HomepageProduct
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
  }
  ${HOMEPAGE_PRODUCT_FRAGMENT}
` as const;

/**
 * ✅ NEW: Sale Products Query
 * Automatically finds products with compareAtPrice set (on sale)
 * Sorted by created date first, then we'll sort by discount percentage in JavaScript
 * Using existing query limit for performance
 */
export const SALE_PRODUCTS_QUERY = `#graphql
  query SaleProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 30
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first, 
      sortKey: CREATED_AT,
      reverse: true,
      query: "variants.compare_at_price:>0"
    ) {
      nodes {
        ...HomepageProduct
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${HOMEPAGE_PRODUCT_FRAGMENT}
` as const;

/**
 * ✅ UPDATED: Combined Homepage Products Query
 * Fetches featured collections and sale products in single request
 */
export const HOMEPAGE_PRODUCTS_COMBINED_QUERY = `#graphql
  query HomepageProductsCombined(
    $country: CountryCode
    $language: LanguageCode
    $collectionsFirst: Int = 75
    $productsFirst: Int = 20
    $saleFirst: Int = 30
  ) @inContext(country: $country, language: $language) {
    # Featured collections with metafield
    collections(first: $collectionsFirst) {
      nodes {
        id
        title
        handle
        description
        metafields(identifiers: [
          {namespace: "custom", key: "featured_on_homepage"}
        ]) {
          id
          key
          value
          type
          namespace
        }
        products(first: $productsFirst, sortKey: COLLECTION_DEFAULT) {
          nodes {
            ...HomepageProduct
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
    
    # Sale products (automatically detected)
    saleProducts: products(
      first: $saleFirst, 
      sortKey: CREATED_AT,
      reverse: true,
      query: "variants.compare_at_price:>0"
    ) {
      nodes {
        ...HomepageProduct
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${HOMEPAGE_PRODUCT_FRAGMENT}
` as const;

/**
 * ✅ HELPER: Daily rotation seed generator
 * Creates consistent randomization that changes once per day
 */
export function getDailySeed(): number {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  // Simple hash function to convert date to number
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * ✅ HELPER: Seeded random number generator
 * Ensures consistent randomization within the same day
 */
export function seededRandom(seed: number): () => number {
  let currentSeed = seed;
  return function() {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
}

/**
 * ✅ HELPER: Randomly sample products from collections
 * Mixes products from multiple featured collections
 */
export function sampleFeaturedProducts(
  collections: any[], 
  targetCount: number = 8
): any[] {
  const dailySeed = getDailySeed();
  const random = seededRandom(dailySeed);
  
  // Filter collections that have the metafield enabled
  const featuredCollections = collections.filter(collection => 
    collection.metafields?.some((field: any) => 
      field && // Add null check here
      field.key === 'featured_on_homepage' && 
      field.value === 'true'
    )
  );

  if (featuredCollections.length === 0) {
    return [];
  }

  // Collect all products from all featured collections
  const allProducts: any[] = [];
  featuredCollections.forEach(collection => {
    if (collection.products?.nodes) {
      collection.products.nodes.forEach((product: any) => {
        allProducts.push({
          ...product,
          sourceCollection: collection.title
        });
      });
    }
  });

  if (allProducts.length === 0) {
    return [];
  }

  // Shuffle using seeded random
  const shuffled = [...allProducts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return target number of products
  return shuffled.slice(0, targetCount);
}

/**
 * ✅ HELPER: Sort sale products by discount percentage
 * Only includes products with valid compareAtPrice
 */
export function sortSaleProductsByDiscount(products: any[]): any[] {
  const dailySeed = getDailySeed();
  const random = seededRandom(dailySeed + 1000); // Different seed for sales
  
  return products
    .filter(product => {
      const variant = product.selectedOrFirstAvailableVariant;
      return variant?.compareAtPrice?.amount && 
             variant?.price?.amount && 
             parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount);
    })
    .map(product => {
      const variant = product.selectedOrFirstAvailableVariant;
      const originalPrice = parseFloat(variant.compareAtPrice.amount);
      const salePrice = parseFloat(variant.price.amount);
      const discountPercentage = ((originalPrice - salePrice) / originalPrice) * 100;
      
      return {
        ...product,
        discountPercentage: Math.round(discountPercentage)
      };
    })
    .sort((a, b) => {
      // Primary sort: highest discount first
      if (b.discountPercentage !== a.discountPercentage) {
        return b.discountPercentage - a.discountPercentage;
      }
      // Secondary sort: random for products with same discount
      return random() - 0.5;
    });
}