// Fragment for money fields
const MONEY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
` as const;

// Cart fragment
const CART_FRAGMENT = `#graphql
  fragment CartApiQuery on Cart {
    updatedAt
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        id
        quantity
        attributes {
          key
          value
        }
        cost {
          totalAmount {
            ...Money
          }
          amountPerQuantity {
            ...Money
          }
          compareAtAmountPerQuantity {
            ...Money
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            availableForSale
            compareAtPrice {
              ...Money
            }
            price {
              ...Money
            }
            requiresShipping
            title
            image {
              id
              url
              altText
              width
              height
            }
            product {
              handle
              title
              id
              vendor
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
  ${MONEY_FRAGMENT}
` as const;

// Menu fragment
const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
    items {
      id
      resourceId
      tags
      title
      type
      url
      items {
        id
        resourceId
        tags
        title
        type
        url
      }
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...MenuItem
    }
  }
` as const;

// Shop fragment
const SHOP_FRAGMENT = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
` as const;

// Header query - STRING format for Hydrogen
export const HEADER_QUERY = `#graphql
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${SHOP_FRAGMENT}
  ${MENU_FRAGMENT}
` as const;

// Footer query - STRING format for Hydrogen
export const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

// MOBILE MENU QUERY - TEMPORARILY COMMENTED OUT TO FIX CODEGEN
// TODO: Add back after fixing syntax
/*
const MOBILE_MENU_COLLECTION_FRAGMENT = `#graphql
  fragment MobileMenuCollection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
    metafields(identifiers: [
      {namespace: "custom", key: "mobile_menu_featured"},
      {namespace: "custom", key: "mobile-menu-featured"},
      {namespace: "app", key: "mobile_menu_featured"},
      {namespace: "app", key: "mobile-menu-featured"}
    ]) {
      key
      value
      namespace
    }
  }
` as const;

export const MOBILE_MENU_COLLECTIONS_QUERY = `#graphql
  query MobileMenuCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: TITLE) {
      nodes {
        ...MobileMenuCollection
      }
    }
  }
  ${MOBILE_MENU_COLLECTION_FRAGMENT}
` as const;
*/

// Export for compatibility with existing context.ts
export const CART_QUERY_FRAGMENT = CART_FRAGMENT;

// Export fragments for reuse
export {
  MONEY_FRAGMENT,
  CART_FRAGMENT,
  MENU_FRAGMENT,
  SHOP_FRAGMENT,
  // MOBILE_MENU_COLLECTION_FRAGMENT - TODO: Add back when fixed
};
