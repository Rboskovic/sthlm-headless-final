// FILE: app/components/WishlistButton.tsx
// ✅ SHOPIFY HYDROGEN: SSR-safe wishlist button using server-side storage

import {useState, useEffect} from 'react';
import {Heart} from 'lucide-react';
import {Link, useFetcher} from 'react-router';
import {useRootLoaderData} from '~/lib/root-data';
import {useWishlist} from '~/hooks/useWishlist';

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
  isInWishlist?: boolean; // Optional prop for server-side initial state
}

export function WishlistButton({
  productId,
  productTitle,
  productHandle,
  productImage,
  productPrice,
  className = '',
  variant = 'icon',
  size = 'md',
  isInWishlist: initialIsInWishlist = false
}: WishlistButtonProps) {
  const data = useRootLoaderData();
  const isLoggedIn = data?.isLoggedIn;
  const {isInWishlist: hookIsInWishlist, addToWishlist, removeFromWishlist} = useWishlist();
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const fetcher = useFetcher();

  // Use server-provided state for logged-in users, hook state for anonymous
  useEffect(() => {
    if (isLoggedIn) {
      setIsInWishlist(initialIsInWishlist);
    } else {
      setIsInWishlist(hookIsInWishlist(productId));
    }
  }, [isLoggedIn, initialIsInWishlist, hookIsInWishlist, productId]);

  const isLoading = fetcher.state === 'submitting';

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If not logged in, redirect to login with current page as redirect
    if (!isLoggedIn) {
      const currentUrl = window.location.pathname;
      window.location.href = `/account/login?redirect=${encodeURIComponent(currentUrl)}`;
      return;
    }


    // Optimistic UI update
    setIsInWishlist(!isInWishlist);

    if (isLoggedIn) {
      // For logged-in users: use server action via fetcher
      const formData = new FormData();
      formData.append('action', isInWishlist ? 'remove' : 'add');
      formData.append('productId', productId);
      
      if (!isInWishlist) {
        // Adding to wishlist - include product data
        formData.append('productTitle', productTitle);
        formData.append('productHandle', productHandle);
        if (productImage) {
          formData.append('productImage', JSON.stringify(productImage));
        }
        if (productPrice) {
          formData.append('productPrice', JSON.stringify(productPrice));
        }
      }

      fetcher.submit(formData, {
        method: 'post',
        action: '/account/wishlist',
      });
    } else {
      // For anonymous users: use hook's session storage
      if (isInWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist({
          id: productId,
          title: productTitle,
          handle: productHandle,
          featuredImage: productImage,
          priceRange: productPrice ? {
            minVariantPrice: productPrice
          } : undefined,
        });
      }
    }
  };

  // Revert optimistic update if server action failed
  useEffect(() => {
    if (fetcher.data?.error) {
      setIsInWishlist(!isInWishlist);
    }
  }, [fetcher.data]);

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
        to={`/account/login?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '')}`}
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
        className={`flex-shrink-0 transition-transform ${isLoading ? 'scale-90' : 'scale-100'}`}
      />
      {variant === 'button' && (
        <span className={config.text}>
          {isLoading ? 'Sparar...' : (isInWishlist ? 'Sparad' : 'Spara')}
        </span>
      )}
      {variant === 'text' && (
        <span className={config.text}>
          {isLoading 
            ? 'Uppdaterar...' 
            : (isInWishlist ? 'Ta bort från önskelista' : 'Spara till önskelista')
          }
        </span>
      )}
    </button>
  );
}