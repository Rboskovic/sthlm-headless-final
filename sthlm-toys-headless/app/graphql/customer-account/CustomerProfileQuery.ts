// FILE: app/graphql/customer-account/CustomerProfileQuery.ts
// ✅ ENHANCED: Profile-specific query with additional fields

export const CUSTOMER_PROFILE_FRAGMENT = `#graphql
  fragment CustomerProfile on Customer {
    id
    firstName
    lastName
    createdAt
    emailAddress {
      emailAddress
    }
    phoneNumber {
      phoneNumber
    }
    acceptsMarketing
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