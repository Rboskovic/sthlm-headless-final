// FILE: app/hooks/useWishlist.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Simple wishlist management hook

import {useState, useEffect} from 'react';

interface WishlistItem {
  productId: string;
  productHandle: string;
  productTitle: string;
  variantId?: string;
  addedAt: string;
}

interface UseWishlistReturn {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WISHLIST_STORAGE_KEY = 'sthlm_toys_wishlist';

export function useWishlist(): UseWishlistReturn {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from memory on mount
  useEffect(() => {
    try {
      // For now, we'll use a simple in-memory storage
      // Later this can be enhanced to use customer accounts
      const savedWishlist = JSON.parse(
        globalThis?.localStorage?.getItem(WISHLIST_STORAGE_KEY) || '[]',
      );
      setWishlistItems(savedWishlist);
    } catch (error) {
      console.warn('Failed to load wishlist:', error);
      setWishlistItems([]);
    }
  }, []);

  // Save wishlist to memory whenever it changes
  useEffect(() => {
    try {
      globalThis?.localStorage?.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistItems),
      );
    } catch (error) {
      console.warn('Failed to save wishlist:', error);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const addToWishlist = (item: Omit<WishlistItem, 'addedAt'>): void => {
    setWishlistItems((prev) => {
      // Avoid duplicates
      if (prev.some((existing) => existing.productId === item.productId)) {
        return prev;
      }

      return [
        ...prev,
        {
          ...item,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const removeFromWishlist = (productId: string): void => {
    setWishlistItems((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  };

  const clearWishlist = (): void => {
    setWishlistItems([]);
  };

  return {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
  };
}

// ✅ SHOPIFY STANDARDS: Export types for TypeScript
export type {WishlistItem, UseWishlistReturn};
