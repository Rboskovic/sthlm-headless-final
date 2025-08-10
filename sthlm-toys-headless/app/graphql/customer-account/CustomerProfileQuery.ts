// FILE: app/graphql/customer-account/CustomerProfileQuery.ts
// ✅ FIXED: Using only available Customer Account API fields

export const CUSTOMER_PROFILE_FRAGMENT = `#graphql
  fragment CustomerProfile on Customer {
    id
    firstName
    lastName
    emailAddress {
      emailAddress
    }
    phoneNumber {
      phoneNumber
    }
  }
` as const;

export const CUSTOMER_PROFILE_QUERY = `#graphql
  query CustomerProfile {
    customer {
      ...CustomerProfile
    }
  }
  ${CUSTOMER_PROFILE_FRAGMENT}
` as const;