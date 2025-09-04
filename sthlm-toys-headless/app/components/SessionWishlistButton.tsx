// app/components/SessionWishlistButton.tsx
// ✅ UPDATED: Blue colors + Swedish translations

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSessionWishlist } from '~/hooks/useSessionWishlist';
import { cn } from '~/lib/utils';
import type { ProductFragment } from 'storefrontapi.generated';

interface SessionWishlistButtonProps {
  product: {
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
  };
  variantId?: string;
  variant?: 'icon' | 'button' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SessionWishlistButton({
  product,
  variantId,
  variant = 'icon',
  size = 'md',
  className = ''
}: SessionWishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useSessionWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const isWishlisted = isInWishlist(product.id, variantId);

  const handleToggle = async () => {
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (isWishlisted) {
        success = removeFromWishlist(product.id, variantId);
      } else {
        success = addToWishlist({
          id: product.id,
          title: product.title,
          handle: product.handle,
          featuredImage: product.featuredImage,
          priceRange: product.priceRange,
          variantId: variantId
        });
      }

      if (success) {
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 2000);
      }
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={cn(
            'flex items-center justify-center rounded-full transition-all duration-200',
            'border hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
            isWishlisted
              ? 'bg-blue-100 border-blue-300 text-blue-600' // Changed from pink to blue
              : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600',
            isLoading && 'opacity-50 cursor-not-allowed',
            sizeClasses[size],
            className
          )}
          title={isWishlisted ? 'Ta bort från önskelistan' : 'Lägg till i önskelistan'} // Swedish
        >
          <Heart 
            size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
            className={cn(
              'transition-all duration-200',
              isWishlisted && 'fill-current'
            )}
          />
        </button>

        {/* Feedback Toast - Swedish */}
        {showFeedback && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
              {isWishlisted ? 'Tillagt i önskelistan!' : 'Borttaget från önskelistan!'}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
          'border font-medium hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500',
          isWishlisted
            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' // Changed from pink to blue
            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600',
          isLoading && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <Heart 
          size={20} 
          className={cn(
            'transition-all duration-200',
            isWishlisted && 'fill-current'
          )} 
        />
        <span>
          {isLoading ? 'Uppdaterar...' : isWishlisted ? 'I Önskelistan' : 'Lägg till i Önskelistan'} {/* Swedish */}
        </span>
      </button>
    );
  }

  // Text variant
  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-1 text-sm font-medium transition-colors duration-200',
        'hover:scale-105 focus:outline-none',
        isWishlisted ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600', // Changed from pink to blue
        isLoading && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <Heart 
        size={16} 
        className={cn(
          'transition-all duration-200',
          isWishlisted && 'fill-current'
        )} 
      />
      <span>
        {isLoading ? 'Uppdaterar...' : isWishlisted ? 'Sparad' : 'Spara'} {/* Swedish */}
      </span>
    </button>
  );
}