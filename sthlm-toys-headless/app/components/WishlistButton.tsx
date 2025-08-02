// FILE: app/components/WishlistButton.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Matches existing header heart icon styling

import {useState} from 'react';
import {Heart} from 'lucide-react';
import {LoginModal} from './LoginModal';

interface WishlistButtonProps {
  productId: string;
  productTitle: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function WishlistButton({
  productId,
  productTitle,
  className = '',
  size = 'md',
}: WishlistButtonProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Size variants - match existing header icon sizing
  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleWishlistClick = () => {
    // For now, just show login modal - this follows your Smyths example
    // Later when customer accounts are set up, we can check auth status
    setShowLoginModal(true);
  };

  return (
    <>
      <button
        onClick={handleWishlistClick}
        className={`
          flex items-center justify-center
          ${sizeClasses[size]}
          rounded-full
          transition-all duration-200
          hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${
            isInWishlist
              ? 'text-red-500 hover:text-red-600'
              : 'text-gray-400 hover:text-red-500'
          }
          ${className}
        `}
        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-label={`${isInWishlist ? 'Remove' : 'Add'} ${productTitle} ${isInWishlist ? 'from' : 'to'} wishlist`}
      >
        <Heart
          size={iconSizes[size]}
          fill={isInWishlist ? 'currentColor' : 'none'}
          className="transition-all duration-200"
        />
      </button>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          context="wishlist"
        />
      )}
    </>
  );
}

// ✅ SHOPIFY STANDARDS: Export types for TypeScript
export type {WishlistButtonProps};
