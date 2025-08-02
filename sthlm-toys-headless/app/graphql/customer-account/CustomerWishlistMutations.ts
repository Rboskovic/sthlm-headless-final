export const CUSTOMER_METAFIELDS_SET_MUTATION = `#graphql
  mutation customerMetafieldsSet($metafields: [CustomerMetafieldsSetInput!]!) {
    customerMetafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

export const CUSTOMER_METAFIELDS_DELETE_MUTATION = `#graphql
  mutation customerMetafieldsDelete($metafields: [CustomerMetafieldsDeleteInput!]!) {
    customerMetafieldsDelete(metafields: $metafields) {
      deletedMetafields {
        key
        namespace
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;
