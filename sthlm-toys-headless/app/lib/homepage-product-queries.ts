// FILE: app/lib/homepage-product-queries.ts
// ✅ SHOPIFY HYDROGEN STANDARDS: GraphQL queries for homepage product sections

/**
 * ✅ COMPATIBLE: Homepage Product Fragment
 * Simplified version compatible with your existing ProductCard component
 * Includes all fields needed by ProductCard without complex options structure
 * DEFINED FIRST to avoid initialization errors
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
 * Featured Homepage Products Query
 * Fetches products from the 'featured-homepage-products' collection
 * Client manages this collection by adding/removing products
 * Metafield type: Boolean (true/false)
 * ✅ FIXED: Uses COLLECTION_DEFAULT sort instead of MANUAL
 */
export const FEATURED_HOMEPAGE_PRODUCTS_QUERY = `#graphql
  query FeaturedHomepageProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 8
  ) @inContext(country: $country, language: $language) {
    collection(handle: "featured-homepage-products") {
      id
      title
      handle
      description
      metafields(identifiers: [
        {namespace: "custom", key: "featured-homepage-products"}
      ]) {
        key
        value
        type
        namespace
      }
      products(first: $first, sortKey: COLLECTION_DEFAULT) {
        nodes {
          ...HomepageProduct
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${HOMEPAGE_PRODUCT_FRAGMENT}
` as const;

/**
 * Sale Homepage Products Query
 * Fetches products from the 'sale-homepage-products' collection
 * Client manages this collection by adding/removing products
 * Metafield type: Boolean (true/false)
 * ✅ FIXED: Uses COLLECTION_DEFAULT sort instead of MANUAL
 */
export const SALE_HOMEPAGE_PRODUCTS_QUERY = `#graphql
  query SaleHomepageProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 8
  ) @inContext(country: $country, language: $language) {
    collection(handle: "sale-homepage-products") {
      id
      title
      handle
      description
      metafields(identifiers: [
        {namespace: "custom", key: "sale-homepage-products"}
      ]) {
        key
        value
        type
        namespace
      }
      products(first: $first, sortKey: COLLECTION_DEFAULT) {
        nodes {
          ...HomepageProduct
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${HOMEPAGE_PRODUCT_FRAGMENT}
` as const;

/**
 * Combined Homepage Products Query (Alternative Approach)
 * Fetches both collections in a single request for better performance
 * Metafield type: Boolean (true/false)
 * ✅ FIXED: Uses COLLECTION_DEFAULT sort instead of MANUAL
 */
export const HOMEPAGE_PRODUCTS_COMBINED_QUERY = `#graphql
  query HomepageProductsCombined(
    $country: CountryCode
    $language: LanguageCode
    $featuredFirst: Int = 8
    $saleFirst: Int = 8
  ) @inContext(country: $country, language: $language) {
    featuredCollection: collection(handle: "featured-homepage-products") {
      id
      title
      handle
      description
      metafields(identifiers: [
        {namespace: "custom", key: "featured-homepage-products"}
      ]) {
        key
        value
        type
        namespace
      }
      products(first: $featuredFirst, sortKey: COLLECTION_DEFAULT) {
        nodes {
          ...HomepageProduct
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
    
    saleCollection: collection(handle: "sale-homepage-products") {
      id
      title
      handle
      description
      metafields(identifiers: [
        {namespace: "custom", key: "sale-homepage-products"}
      ]) {
        key
        value
        type
        namespace
      }
      products(first: $saleFirst, sortKey: COLLECTION_DEFAULT) {
        nodes {
          ...HomepageProduct
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${HOMEPAGE_PRODUCT_FRAGMENT}
` as const;

/**
 * Collection Validation Query
 * Checks if the required collections exist and have the correct metafields
 * Useful for setup validation - metafields should be Boolean type
 */
export const HOMEPAGE_COLLECTIONS_VALIDATION_QUERY = `#graphql
  query HomepageCollectionsValidation(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    featuredCollection: collection(handle: "featured-homepage-products") {
      id
      title
      handle
      metafields(identifiers: [
        {namespace: "custom", key: "featured-homepage-products"}
      ]) {
        key
        value
        type
        namespace
      }
      products(first: 1) {
        pageInfo {
          hasNextPage
        }
      }
    }
    
    saleCollection: collection(handle: "sale-homepage-products") {
      id
      title
      handle
      metafields(identifiers: [
        {namespace: "custom", key: "sale-homepage-products"}
      ]) {
        key
        value
        type
        namespace
      }
      products(first: 1) {
        pageInfo {
          hasNextPage
        }
      }
    }
  }
` as const;