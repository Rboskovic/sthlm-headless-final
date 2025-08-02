// FILE: app/lib/wishlist.ts
// SIMPLE VERSION: No problematic mutations, just basic functionality

import {useFetcher} from 'react-router';
import {useCallback, useMemo} from 'react';

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export class WishlistManager {
  static readonly NAMESPACE = 'custom';
  static readonly KEY = 'wishlist';

  static parseWishlist(metafieldValue?: string | null): WishlistItem[] {
    if (!metafieldValue) return [];

    try {
      const parsed = JSON.parse(metafieldValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  static serializeWishlist(items: WishlistItem[]): string {
    return JSON.stringify(items);
  }

  static addToWishlist(
    currentItems: WishlistItem[],
    productId: string,
  ): WishlistItem[] {
    const exists = currentItems.some((item) => item.productId === productId);
    if (exists) return currentItems;

    return [
      ...currentItems,
      {
        productId,
        addedAt: new Date().toISOString(),
      },
    ];
  }

  static removeFromWishlist(
    currentItems: WishlistItem[],
    productId: string,
  ): WishlistItem[] {
    return currentItems.filter((item) => item.productId !== productId);
  }
}

// Simplified hook for wishlist operations (no complex mutations for now)
export function useWishlist() {
  const fetcher = useFetcher();

  const addToWishlist = useCallback(
    (productId: string) => {
      // For now, just log - we'll add real functionality later
      console.log('Adding to wishlist:', productId);
      fetcher.submit(
        {productId, action: 'add'},
        {method: 'POST', action: '/account/wishlist'},
      );
    },
    [fetcher],
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      // For now, just log - we'll add real functionality later
      console.log('Removing from wishlist:', productId);
      fetcher.submit(
        {productId, action: 'remove'},
        {method: 'POST', action: '/account/wishlist'},
      );
    },
    [fetcher],
  );

  const isUpdating = useMemo(
    () => fetcher.state === 'loading' || fetcher.state === 'submitting',
    [fetcher.state],
  );

  return {
    addToWishlist,
    removeFromWishlist,
    isUpdating,
  };
}
