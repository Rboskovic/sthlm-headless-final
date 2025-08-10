// FILE: app/graphql/customer-account/CustomerMarketingUpdateMutation.ts
// ✅ SHOPIFY HYDROGEN: Marketing preferences update using customerUpdate mutation

export const CUSTOMER_MARKETING_UPDATE_MUTATION = `#graphql
  # https://shopify.dev/docs/api/customer/latest/mutations/customerUpdate
  mutation customerMarketingUpdate(
    $customer: CustomerUpdateInput!
  ){
    customerUpdate(input: $customer) {
      customer {
        id
        firstName
        lastName
        acceptsMarketing
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
        createdAt
      }
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;