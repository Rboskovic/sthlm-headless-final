// FILE: app/components/WishlistButton.tsx
// ✅ FIXED: Wishlist button that doesn't inappropriately trigger mobile login modal

import {useState, useEffect} from 'react';
import {Heart} from 'lucide-react';
import {Link} from 'react-router';
import {useRootLoaderData} from '~/lib/root-data';

export interface WishlistButtonProps {
  productId: string;
  productTitle: string;
  productHandle: string;
  productImage?: {
    url: string;
    altText?: string;
  };
  productPrice?: {
    amount: string;
    currencyCode: string;
  };
  className?: string;
  variant?: 'icon' | 'button' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

export function WishlistButton({
  productId,
  productTitle,
  productHandle,
  productImage,
  productPrice,
  className = '',
  variant = 'icon',
  size = 'md'
}: WishlistButtonProps) {
  const {isLoggedIn, customer} = useRootLoaderData();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist status from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && customer?.id) {
      try {
        const stored = localStorage.getItem(`wishlist_${customer.id}`);
        if (stored) {
          const items = JSON.parse(stored);
          if (Array.isArray(items)) {
            setIsInWishlist(items.some(item => item.id === productId));
          }
        }
      } catch (error) {
        console.error('Error loading wishlist status:', error);
      }
    }
  }, [productId, customer?.id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If not logged in, redirect to login with current page as redirect
    if (!isLoggedIn) {
      const currentUrl = window.location.pathname;
      window.location.href = `/account/login?redirect=${encodeURIComponent(currentUrl)}`;
      return;
    }

    if (!customer?.id) return;

    setIsLoading(true);

    try {
      const wishlistKey = `wishlist_${customer.id}`;
      const stored = localStorage.getItem(wishlistKey);
      let wishlistItems: any[] = [];

      if (stored) {
        try {
          wishlistItems = JSON.parse(stored);
          if (!Array.isArray(wishlistItems)) {
            wishlistItems = [];
          }
        } catch {
          wishlistItems = [];
        }
      }

      if (isInWishlist) {
        // Remove from wishlist
        const updatedItems = wishlistItems.filter(item => item.id !== productId);
        localStorage.setItem(wishlistKey, JSON.stringify(updatedItems));
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        const newItem = {
          id: productId,
          title: productTitle,
          handle: productHandle,
          featuredImage: productImage,
          priceRange: productPrice ? {
            minVariantPrice: productPrice
          } : undefined,
          addedAt: new Date().toISOString()
        };
        
        const updatedItems = [...wishlistItems, newItem];
        localStorage.setItem(wishlistKey, JSON.stringify(updatedItems));
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      icon: 16,
      padding: 'p-1.5',
      text: 'text-xs',
      gap: 'gap-1'
    },
    md: {
      icon: 20,
      padding: 'p-2',
      text: 'text-sm',
      gap: 'gap-2'
    },
    lg: {
      icon: 24,
      padding: 'p-3',
      text: 'text-base',
      gap: 'gap-2'
    }
  };

  const config = sizeConfig[size];

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Variant-specific styles
  const variantStyles = {
    icon: `
      ${config.padding}
      rounded-full
      ${isInWishlist 
        ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-pink-600'
      }
    `,
    button: `
      ${config.padding} px-4
      ${config.gap}
      rounded-lg font-medium
      ${isInWishlist
        ? 'bg-pink-600 text-white hover:bg-pink-700'
        : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-300 hover:text-pink-600'
      }
    `,
    text: `
      ${config.gap}
      font-medium
      ${isInWishlist
        ? 'text-pink-600 hover:text-pink-700'
        : 'text-gray-600 hover:text-pink-600'
      }
    `
  };

  const buttonClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  // For non-logged in users, render as Link to login
  if (!isLoggedIn) {
    return (
      <Link
        to={`/account/login?redirect=${encodeURIComponent(window.location.pathname)}`}
        className={buttonClassName}
        title="Logga in för att spara till önskelista"
      >
        <Heart 
          size={config.icon} 
          fill="none"
          className="flex-shrink-0"
        />
        {variant === 'button' && (
          <span className={config.text}>Spara</span>
        )}
        {variant === 'text' && (
          <span className={config.text}>Spara till önskelista</span>
        )}
      </Link>
    );
  }

  // For logged in users, render as interactive button
  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isLoading}
      className={buttonClassName}
      title={isInWishlist ? 'Ta bort från önskelista' : 'Lägg till i önskelista'}
    >
      <Heart 
        size={config.icon} 
        fill={isInWishlist ? 'currentColor' : 'none'}
        className={`flex-shrink-0 transition-transform ${isLoading ? 'animate-pulse' : ''}`}
      />
      {variant === 'button' && (
        <span className={config.text}>
          {isInWishlist ? 'Sparad' : 'Spara'}
        </span>
      )}
      {variant === 'text' && (
        <span className={config.text}>
          {isInWishlist ? 'Ta bort från önskelista' : 'Spara till önskelista'}
        </span>
      )}
    </button>
  );
}