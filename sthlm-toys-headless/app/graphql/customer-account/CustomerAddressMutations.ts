// FILE: app/graphql/customer-account/CustomerAddressMutations.ts
// ✅ SHOPIFY HYDROGEN: Customer address mutations for Customer Account API

export const CREATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(input: { address: $address, defaultAddress: $defaultAddress }) {
      customerAddress {
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
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;

export const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressUpdate(input: { id: $addressId, address: $address, defaultAddress: $defaultAddress }) {
      customerAddress {
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
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;

export const DELETE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressDelete($addressId: ID!) {
    customerAddressDelete(input: { id: $addressId }) {
      deletedAddressId
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;