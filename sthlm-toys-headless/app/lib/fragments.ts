// FILE: app/lib/fragments.ts
// ✅ FIXED: Removed customer fragments causing GraphQL errors since using Shopify hosted account
// ✅ UPDATED: Added paymentSettings to FOOTER_QUERY for official payment icons

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

// Shop fragment - ✅ UPDATED: Added metafields for free shipping banner
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
    metafields(identifiers: [
      {namespace: "custom", key: "free_shipping_banner"}
    ]) {
      key
      value
      namespace
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

// ✅ UPDATED: Footer query with payment settings - OFFICIAL SHOPIFY METHOD
export const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      paymentSettings {
        acceptedCardBrands
      }
    }
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

// EXISTING: Mobile menu collections query
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
      {namespace: "custom", key: "mobile_menu_image"}
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
    collections(first: 75, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...MobileMenuCollection
      }
    }
  }
  ${MOBILE_MENU_COLLECTION_FRAGMENT}
` as const;

// EXISTING: Themes collections query
const THEMES_COLLECTION_FRAGMENT = `#graphql
  fragment ThemesCollection on Collection {
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
      {namespace: "custom", key: "lego_theme"},
      {namespace: "custom", key: "theme_image"}
    ]) {
      key
      value
      namespace
    }
  }
` as const;

export const THEMES_COLLECTIONS_QUERY = `#graphql
  query ThemesCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ThemesCollection
      }
    }
  }
  ${THEMES_COLLECTION_FRAGMENT}
` as const;

// Export for compatibility with existing context.ts
export const CART_QUERY_FRAGMENT = CART_FRAGMENT;

// Export fragments for reuse
export {
  MONEY_FRAGMENT,
  CART_FRAGMENT,
  MENU_FRAGMENT,
  SHOP_FRAGMENT,
  MOBILE_MENU_COLLECTION_FRAGMENT,
  THEMES_COLLECTION_FRAGMENT,
};