// app/hooks/useSessionWishlist.tsx
import { useState, useEffect, useCallback } from 'react';
import { WishlistStorage, type WishlistItem } from '~/lib/wishlist-storage';
import { WishlistSharing } from '~/lib/wishlist-sharing';

export function useSessionWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from storage on mount
  useEffect(() => {
    const items = WishlistStorage.getWishlist();
    setWishlistItems(items);
    setIsLoading(false);
  }, []);

  // Listen for wishlist updates from other tabs/components
  useEffect(() => {
    const handleWishlistUpdate = (event: CustomEvent) => {
      setWishlistItems(event.detail.items || []);
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate as EventListener);
    
    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate as EventListener);
    };
  }, []);

  const addToWishlist = useCallback((product: Omit<WishlistItem, 'addedAt'>) => {
    const success = WishlistStorage.addItem(product);
    if (success) {
      setWishlistItems(WishlistStorage.getWishlist());
    }
    return success;
  }, []);

  const removeFromWishlist = useCallback((productId: string, variantId?: string) => {
    const success = WishlistStorage.removeItem(productId, variantId);
    if (success) {
      setWishlistItems(WishlistStorage.getWishlist());
    }
    return success;
  }, []);

  const isInWishlist = useCallback((productId: string, variantId?: string) => {
    return WishlistStorage.isInWishlist(productId, variantId);
  }, [wishlistItems]); // Re-compute when wishlist changes

  const clearWishlist = useCallback(() => {
    WishlistStorage.clearWishlist();
    setWishlistItems([]);
  }, []);

  const createShareableLink = useCallback((customTitle?: string) => {
    return WishlistSharing.createShareableUrl(customTitle);
  }, [wishlistItems]);

  const shareWishlist = useCallback(async (customTitle?: string) => {
    return await WishlistSharing.shareWishlist(customTitle);
  }, [wishlistItems]);

  const copyShareLink = useCallback(async (customTitle?: string) => {
    return await WishlistSharing.copyToClipboard(customTitle);
  }, [wishlistItems]);

  return {
    wishlistItems,
    isLoading,
    wishlistCount: wishlistItems.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    createShareableLink,
    shareWishlist,
    copyShareLink,
  };
}