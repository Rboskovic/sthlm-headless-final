// FILE: app/lib/fragments.ts
// ✅ ADDED: POPULAR_COLLECTIONS_QUERY for metaobject-based popular collections

// Fragment for money fields
const MONEY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
` as const;

// Cart fragment - ✅ ADDED discountAllocations for BOGO and savings display
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
        discountAllocations {
          discountedAmount {
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
            quantityAvailable
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
    discountAllocations {
      discountedAmount {
        ...Money
      }
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
    metafields(identifiers: [
      {namespace: "custom", key: "free_shipping_banner"}
    ]) {
      key
      value
      namespace
    }
  }
` as const;

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
    footerSettings: metaobjects(type: "footer_settings", first: 1) {
      nodes {
        id
        fields {
          key
          value
        }
      }
    }
  }
  ${MENU_FRAGMENT}
` as const;

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

// Header Banner metaobject query
export const HEADER_BANNER_QUERY = `#graphql
  query HeaderBanners($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobjects(type: "header_banner", first: 10) {
      nodes {
        id
        handle
        fields {
          key
          value
        }
      }
    }
  }
` as const;

// ✅ KEPT: Original query for backward compatibility (can be removed after full migration)
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

// ✅ NEW: Popular Collections Metaobject Query
// Replaces filtering collections by mobile_menu_featured metafield
const POPULAR_COLLECTION_FRAGMENT = `#graphql
  fragment PopularCollection on Collection {
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
      {namespace: "custom", key: "mobile_menu_image"}
    ]) {
      key
      value
      namespace
    }
  }
` as const;

export const POPULAR_COLLECTIONS_QUERY = `#graphql
  query PopularCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    popularCollections: metaobjects(type: "popular_collections", first: 1) {
      nodes {
        id
        fields {
          key
          value
          references(first: 10) {
            nodes {
              ... on Collection {
                ...PopularCollection
              }
            }
          }
        }
      }
    }
  }
  ${POPULAR_COLLECTION_FRAGMENT}
` as const;

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

export const CART_QUERY_FRAGMENT = CART_FRAGMENT;

export {
  MONEY_FRAGMENT,
  CART_FRAGMENT,
  MENU_FRAGMENT,
  SHOP_FRAGMENT,
  MOBILE_MENU_COLLECTION_FRAGMENT,
  THEMES_COLLECTION_FRAGMENT,
  POPULAR_COLLECTION_FRAGMENT,
};