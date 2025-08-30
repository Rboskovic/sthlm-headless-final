// FILE: app/hooks/useWishlist.tsx
// ✅ SHOPIFY HYDROGEN: SSR-safe wishlist hook with server-side storage

import {useState, useEffect} from 'react';
import {useRootLoaderData} from '~/lib/root-data';
import type {WishlistItem} from '~/lib/wishlist.server';

export interface UseWishlistReturn {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
  isLoading: boolean;
}

const SESSION_STORAGE_KEY = 'sthlm_wishlist_session';

export function useWishlist(): UseWishlistReturn {
  const {isLoggedIn, customer} = useRootLoaderData();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // SSR-safe storage check
  const isClient = typeof window !== 'undefined';

  // Load wishlist on mount
  useEffect(() => {
    if (!isClient) {
      setIsLoading(false);
      return;
    }

    loadWishlist();
  }, [isClient, isLoggedIn, customer?.id]);

  const loadWishlist = async () => {
    try {
      if (isLoggedIn && customer?.id) {
        // For logged-in users, wishlist is loaded via route loader
        // This hook primarily manages session storage for anonymous users
        setIsLoading(false);
        return;
      }

      // Anonymous users: use sessionStorage (not localStorage for SSR safety)
      if (isClient) {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const items = JSON.parse(stored);
          setWishlistItems(Array.isArray(items) ? items : []);
        }
      }
    } catch (error) {
      console.warn('Error loading wishlist:', error);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToSession = (items: WishlistItem[]) => {
    if (!isClient) return;
    
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(items));
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('wishlist-updated', {
        detail: {count: items.length}
      }));
    } catch (error) {
      console.warn('Failed to save to session storage:', error);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  const addToWishlist = async (item: Omit<WishlistItem, 'addedAt'>): Promise<void> => {
    if (isInWishlist(item.id)) return;

    const newItem: WishlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };

    const updatedItems = [...wishlistItems, newItem];
    setWishlistItems(updatedItems);

    // For anonymous users, save to session storage
    if (!isLoggedIn) {
      saveToSession(updatedItems);
    }

    // For logged-in users, the server action will handle persistence
    // This is managed by the WishlistButton component's form submission
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    const updatedItems = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedItems);

    // For anonymous users, save to session storage
    if (!isLoggedIn) {
      saveToSession(updatedItems);
    }

    // For logged-in users, the server action will handle persistence
  };

  const clearWishlist = async (): Promise<void> => {
    setWishlistItems([]);
    
    if (!isLoggedIn && isClient) {
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('wishlist-updated', {
          detail: {count: 0}
        }));
      } catch (error) {
        console.warn('Failed to clear session storage:', error);
      }
    }
  };

  return {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
    isLoading,
  };
}

// Helper function to migrate localStorage data to customer account
export async function migrateLocalStorageWishlist(customerId: string): Promise<WishlistItem[]> {
  if (typeof window === 'undefined') return [];
  
  try {
    // Check for old localStorage keys
    const oldWishlistKey = `wishlist_${customerId}`;
    const generalWishlistKey = 'sthlm_toys_wishlist';
    
    let items: WishlistItem[] = [];
    
    // Try customer-specific key first
    const customerData = localStorage.getItem(oldWishlistKey);
    if (customerData) {
      items = JSON.parse(customerData);
      localStorage.removeItem(oldWishlistKey);
    } else {
      // Try general key
      const generalData = localStorage.getItem(generalWishlistKey);
      if (generalData) {
        items = JSON.parse(generalData);
        localStorage.removeItem(generalWishlistKey);
      }
    }
    
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.warn('Error migrating localStorage wishlist:', error);
    return [];
  }
}

export type {WishlistItem, UseWishlistReturn};