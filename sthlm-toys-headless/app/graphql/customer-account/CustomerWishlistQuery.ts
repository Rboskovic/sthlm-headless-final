export const CUSTOMER_WISHLIST_QUERY = `#graphql
  query CustomerWishlist {
    customer {
      id
      metafields(identifiers: [
        {namespace: "custom", key: "wishlist"}
      ]) {
        key
        namespace
        value
      }
    }
  }
` as const;
