// app/lib/wishlist-storage.ts
export interface WishlistItem {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  addedAt: string; // ISO timestamp
  variantId?: string; // Optional: for specific variants
}

const STORAGE_KEY = 'sthlm_wishlist';
const MAX_ITEMS = 50; // Prevent storage bloat

export class WishlistStorage {
  // Get current wishlist from storage
  static getWishlist(): WishlistItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      // Try localStorage first (persistent), then sessionStorage
      const stored = localStorage.getItem(STORAGE_KEY) || 
                    sessionStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        const items = JSON.parse(stored) as WishlistItem[];
        return Array.isArray(items) ? items : [];
      }
    } catch (error) {
      console.warn('Failed to load wishlist from storage:', error);
    }
    
    return [];
  }

  // Save wishlist to storage
  static saveWishlist(items: WishlistItem[], persistent = true): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Limit items to prevent storage overflow
      const trimmedItems = items.slice(0, MAX_ITEMS);
      const data = JSON.stringify(trimmedItems);
      
      if (persistent) {
        localStorage.setItem(STORAGE_KEY, data);
      } else {
        sessionStorage.setItem(STORAGE_KEY, data);
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('wishlist-updated', {
        detail: { count: trimmedItems.length, items: trimmedItems }
      }));
      
    } catch (error) {
      console.warn('Failed to save wishlist:', error);
    }
  }

  // Add item to wishlist
  static addItem(product: Omit<WishlistItem, 'addedAt'>): boolean {
    const wishlist = this.getWishlist();
    
    // Check if item already exists
    const existingIndex = wishlist.findIndex(item => 
      item.id === product.id && item.variantId === product.variantId
    );
    
    if (existingIndex !== -1) {
      return false; // Already in wishlist
    }
    
    const newItem: WishlistItem = {
      ...product,
      addedAt: new Date().toISOString()
    };
    
    const updatedWishlist = [newItem, ...wishlist];
    this.saveWishlist(updatedWishlist);
    return true;
  }

  // Remove item from wishlist
  static removeItem(productId: string, variantId?: string): boolean {
    const wishlist = this.getWishlist();
    const initialLength = wishlist.length;
    
    const filtered = wishlist.filter(item => 
      !(item.id === productId && 
        (!variantId || item.variantId === variantId))
    );
    
    if (filtered.length !== initialLength) {
      this.saveWishlist(filtered);
      return true;
    }
    return false;
  }

  // Check if item is in wishlist
  static isInWishlist(productId: string, variantId?: string): boolean {
    const wishlist = this.getWishlist();
    return wishlist.some(item => 
      item.id === productId && 
      (!variantId || item.variantId === variantId)
    );
  }

  // Clear entire wishlist
  static clearWishlist(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    
    window.dispatchEvent(new CustomEvent('wishlist-updated', {
      detail: { count: 0, items: [] }
    }));
  }

  // Get wishlist count
  static getCount(): number {
    return this.getWishlist().length;
  }
}