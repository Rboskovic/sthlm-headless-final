// FILE: app/graphql/customer-account/CustomerDetailsQuery.ts
// ✅ SHOPIFY HYDROGEN: Customer details query including addresses

export const CUSTOMER_DETAILS_QUERY = `#graphql
  query CustomerDetails {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        territoryCode
        zoneCode
        zip
        phoneNumber
      }
      addresses(first: 20) {
        nodes {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          territoryCode
          zoneCode
          zip
          phoneNumber
        }
      }
    }
  }
` as const;