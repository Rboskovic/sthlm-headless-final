// FILE: app/lib/utils.ts
// ✅ SHOPIFY HYDROGEN STANDARDS: Utility functions

import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * Combines class names with tailwind-merge to avoid conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price with currency
 */
export function formatMoney(
  amount: string | number,
  currencyCode: string = 'SEK'
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(
  originalPrice: string | number,
  salePrice: string | number
): number {
  const original = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const sale = typeof salePrice === 'string' ? parseFloat(salePrice) : salePrice;
  
  if (original <= 0) return 0;
  const discount = ((original - sale) / original) * 100;
  return Math.round(discount);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Generate product URL
 */
export function getProductUrl(handle: string): string {
  return `/products/${handle}`;
}

/**
 * Generate collection URL
 */
export function getCollectionUrl(handle: string): string {
  return `/collections/${handle}`;
}

/**
 * Check if price is on sale
 */
export function isOnSale(
  price?: {amount: string | number} | null,
  compareAtPrice?: {amount: string | number} | null
): boolean {
  if (!price || !compareAtPrice) return false;
  
  const currentPrice = typeof price.amount === 'string' ? parseFloat(price.amount) : price.amount;
  const originalPrice = typeof compareAtPrice.amount === 'string' ? parseFloat(compareAtPrice.amount) : compareAtPrice.amount;
  
  return originalPrice > currentPrice;
}

/**
 * Get image alt text or fallback
 */
export function getImageAlt(alt?: string | null, title?: string): string {
  return alt || title || 'Product image';
}

/**
 * Debounce function for search and filters
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}