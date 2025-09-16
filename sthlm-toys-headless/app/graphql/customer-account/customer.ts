export const CUSTOMER_QUERY = `#graphql
  query Customer {
    customer {
      id
      firstName
      lastName
      displayName
    }
  }
` as const;