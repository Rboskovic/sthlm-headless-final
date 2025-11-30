// FILE: app/lib/fragments.ts
// ✅ UPDATED: Added THEMES_PAGE_QUERY and PRICE_AGE_PAGE_QUERY for metaobject-based pages

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

// Mega Menu Banner metaobject query
export const MEGA_MENU_BANNER_QUERY = `#graphql
  query MegaMenuBanners($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    megaMenuBanners: metaobjects(type: "mega_menu_promo", first: 10) {
      nodes {
        id
        handle
        fields {
          key
          value
          type
          reference {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
            ... on Collection {
              handle
              title
            }
          }
        }
      }
    }
  }
` as const;

// ✅ Popular Collections Metaobject Query
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

// ✅ NEW: Themes Page Metaobject Query
export const THEMES_PAGE_QUERY = `#graphql
  query ThemesPage($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    themesPage: metaobjects(type: "lego_teman", first: 1) {
      nodes {
        id
        fields {
          key
          value
          references(first: 50) {
            nodes {
              ... on Collection {
                id
                title
                handle
                image {
                  url
                  altText
                }
                metafields(identifiers: [
                  {namespace: "custom", key: "theme_image"}
                ]) {
                  key
                  value
                  namespace
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

// ✅ NEW: Price & Age Landing Pages Metaobject Query
// Shared by both /handla-efter-pris and /ages routes
export const PRICE_AGE_PAGE_QUERY = `#graphql
  query PriceAgePage($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    priceAgePage: metaobjects(type: "stranice_handla_efter_pris_alder_podesavanja", first: 1) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
          references(first: 50) {
            nodes {
              ... on Collection {
                id
                title
                handle
                description
                image {
                  url
                  altText
                }
                metafields(identifiers: [
                  {namespace: "custom", key: "age_lifestyle_image"}
                ]) {
                  id
                  key
                  value
                  namespace
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

export const CART_QUERY_FRAGMENT = CART_FRAGMENT;

export {
  MONEY_FRAGMENT,
  CART_FRAGMENT,
  MENU_FRAGMENT,
  SHOP_FRAGMENT,
  POPULAR_COLLECTION_FRAGMENT,
};