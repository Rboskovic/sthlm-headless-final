// app/lib/wishlist-sharing.ts
import { WishlistStorage, type WishlistItem } from './wishlist-storage';

export class WishlistSharing {
  // Create shareable URL with encoded wishlist data
  static createShareableUrl(customTitle?: string): string {
    const wishlist = WishlistStorage.getWishlist();
    
    if (wishlist.length === 0) {
      return window.location.origin + '/wishlist';
    }
    
    // Create minimal data for URL (avoid URL length limits)
    const shareData = {
      items: wishlist.map(item => ({
        id: item.id,
        handle: item.handle,
        title: item.title,
        variantId: item.variantId
      })),
      title: customTitle || 'Check out my wishlist!',
      createdAt: new Date().toISOString()
    };
    
    try {
      // Compress and encode data
      const compressed = JSON.stringify(shareData);
      const encoded = btoa(compressed); // Base64 encode
      
      // Create shareable URL
      const shareUrl = new URL('/wishlist/shared', window.location.origin);
      shareUrl.searchParams.set('data', encoded);
      
      return shareUrl.toString();
    } catch (error) {
      console.error('Failed to create shareable URL:', error);
      return window.location.origin + '/wishlist';
    }
  }

  // Load wishlist from shared URL
  static loadFromShareUrl(encodedData: string): WishlistItem[] | null {
    try {
      const decoded = atob(encodedData);
      const shareData = JSON.parse(decoded);
      
      // Validate data structure
      if (!shareData.items || !Array.isArray(shareData.items)) {
        return null;
      }
      
      // Convert to full wishlist items (minimal data expansion)
      const items: WishlistItem[] = shareData.items.map(item => ({
        id: item.id,
        title: item.title || 'Shared Product',
        handle: item.handle,
        variantId: item.variantId,
        addedAt: shareData.createdAt || new Date().toISOString(),
        // Note: Price and image data not available in shared links
        // Could be fetched via Storefront API if needed
      }));
      
      return items;
    } catch (error) {
      console.error('Failed to load shared wishlist:', error);
      return null;
    }
  }

  // Native sharing (if supported)
  static async shareWishlist(customTitle?: string): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.share) {
      return false;
    }
    
    const shareUrl = this.createShareableUrl(customTitle);
    const wishlistCount = WishlistStorage.getCount();
    
    try {
      await navigator.share({
        title: customTitle || `My Wishlist (${wishlistCount} items)`,
        text: 'Check out the products I\'m loving!',
        url: shareUrl
      });
      return true;
    } catch (error) {
      // User cancelled or not supported
      return false;
    }
  }

  // Copy to clipboard
  static async copyToClipboard(customTitle?: string): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      return false;
    }
    
    const shareUrl = this.createShareableUrl(customTitle);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
}