// app/lib/fragments.ts - Fixed to use STRING queries for Hydrogen

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

// Export for compatibility with existing context.ts
export const CART_QUERY_FRAGMENT = CART_FRAGMENT;

// Export fragments for reuse
export {MONEY_FRAGMENT, CART_FRAGMENT, MENU_FRAGMENT, SHOP_FRAGMENT};
