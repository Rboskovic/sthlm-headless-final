// FILE: app/lib/wishlist.server.ts
// ✅ SHOPIFY HYDROGEN: Server-side wishlist storage using customer metafields

import type {CustomerAccount} from '@shopify/hydrogen';

export interface WishlistItem {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  addedAt: string;
}

const WISHLIST_METAFIELD_NAMESPACE = 'custom';
const WISHLIST_METAFIELD_KEY = 'wishlist_items';

// Query customer wishlist from metafields
const CUSTOMER_WISHLIST_QUERY = `#graphql
  query CustomerWishlist {
    customer {
      id
      metafield(namespace: "${WISHLIST_METAFIELD_NAMESPACE}", key: "${WISHLIST_METAFIELD_KEY}") {
        id
        value
      }
    }
  }
` as const;

// Mutation to update customer wishlist metafield
const CUSTOMER_WISHLIST_UPDATE_MUTATION = `#graphql
  mutation CustomerWishlistUpdate($metafields: [CustomerMetafieldInput!]!) {
    customerUpdate(input: { metafields: $metafields }) {
      customer {
        id
        metafield(namespace: "${WISHLIST_METAFIELD_NAMESPACE}", key: "${WISHLIST_METAFIELD_KEY}") {
          id
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

/**
 * Get customer wishlist from Shopify metafields
 */
export async function getCustomerWishlist(
  customerAccount: CustomerAccount
): Promise<WishlistItem[]> {
  try {
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return [];
    }

    const {data, errors} = await customerAccount.query(CUSTOMER_WISHLIST_QUERY);
    
    if (errors?.length) {
      console.error('Wishlist query errors:', errors);
      return [];
    }

    const wishlistData = data?.customer?.metafield?.value;
    if (!wishlistData) {
      return [];
    }

    const items = JSON.parse(wishlistData);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('Error fetching customer wishlist:', error);
    return [];
  }
}

/**
 * Update customer wishlist in Shopify metafields
 */
export async function updateCustomerWishlist(
  customerAccount: CustomerAccount,
  items: WishlistItem[]
): Promise<{success: boolean; error?: string}> {
  try {
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return {success: false, error: 'Customer not logged in'};
    }

    const metafields = [
      {
        namespace: WISHLIST_METAFIELD_NAMESPACE,
        key: WISHLIST_METAFIELD_KEY,
        value: JSON.stringify(items),
        type: 'json',
      },
    ];

    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_WISHLIST_UPDATE_MUTATION,
      {variables: {metafields}}
    );

    if (errors?.length) {
      console.error('Wishlist mutation errors:', errors);
      return {success: false, error: errors[0].message};
    }

    if (data?.customerUpdate?.userErrors?.length) {
      const error = data.customerUpdate.userErrors[0];
      return {success: false, error: error.message};
    }

    return {success: true};
  } catch (error) {
    console.error('Error updating customer wishlist:', error);
    return {success: false, error: 'Failed to update wishlist'};
  }
}

/**
 * Add item to customer wishlist
 */
export async function addToCustomerWishlist(
  customerAccount: CustomerAccount,
  item: Omit<WishlistItem, 'addedAt'>
): Promise<{success: boolean; error?: string}> {
  const currentWishlist = await getCustomerWishlist(customerAccount);
  
  // Check if item already exists
  if (currentWishlist.some(existing => existing.id === item.id)) {
    return {success: true}; // Already in wishlist
  }

  const newItem: WishlistItem = {
    ...item,
    addedAt: new Date().toISOString(),
  };

  const updatedWishlist = [...currentWishlist, newItem];
  return await updateCustomerWishlist(customerAccount, updatedWishlist);
}

/**
 * Remove item from customer wishlist
 */
export async function removeFromCustomerWishlist(
  customerAccount: CustomerAccount,
  productId: string
): Promise<{success: boolean; error?: string}> {
  const currentWishlist = await getCustomerWishlist(customerAccount);
  const updatedWishlist = currentWishlist.filter(item => item.id !== productId);
  
  return await updateCustomerWishlist(customerAccount, updatedWishlist);
}

/**
 * Check if item is in customer wishlist
 */
export async function isInCustomerWishlist(
  customerAccount: CustomerAccount,
  productId: string
): Promise<boolean> {
  const wishlist = await getCustomerWishlist(customerAccount);
  return wishlist.some(item => item.id === productId);
}

/**
 * Get wishlist count for customer
 */
export async function getCustomerWishlistCount(
  customerAccount: CustomerAccount
): Promise<number> {
  const wishlist = await getCustomerWishlist(customerAccount);
  return wishlist.length;
}