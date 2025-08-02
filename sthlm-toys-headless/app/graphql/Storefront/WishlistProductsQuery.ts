export const WISHLIST_PRODUCTS_QUERY = `#graphql
  query WishlistProducts(
    $productIds: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $productIds) {
      ... on Product {
        id
        title
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
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        availableForSale
        vendor
        productType
      }
    }
  }
` as const;
