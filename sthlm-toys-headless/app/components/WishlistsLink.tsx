// FILE: app/components/WishlistsLink.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Smart wishlist link that handles auth

import {useState, Suspense} from 'react';
import {Link, Await} from 'react-router';
import {Heart} from 'lucide-react';
import {LoginModal} from './LoginModal';

interface WishlistsLinkProps {
  isLoggedIn: Promise<boolean>;
  onClose?: () => void; // For mobile nav - close menu when clicked
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'desktop' | 'mobile' | 'nav-item';
}

export function WishlistsLink({
  isLoggedIn,
  onClose,
  children,
  className = '',
  style,
  variant = 'desktop',
}: WishlistsLinkProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <Suspense
        fallback={
          <WishlistsLinkFallback
            className={className}
            style={style}
            variant={variant}
          >
            {children}
          </WishlistsLinkFallback>
        }
      >
        <Await resolve={isLoggedIn}>
          {(isLoggedIn) => {
            if (isLoggedIn) {
              // User is logged in - go to wishlist page
              return (
                <Link
                  to="/account/wishlist"
                  className={className}
                  style={style}
                  onClick={onClose}
                >
                  {children}
                </Link>
              );
            } else {
              // User not logged in - show modal
              return (
                <button
                  onClick={() => {
                    if (onClose) {
                      onClose(); // Close mobile nav first
                      setTimeout(() => setShowLoginModal(true), 500);
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                  className={className}
                  style={style}
                >
                  {children}
                </button>
              );
            }
          }}
        </Await>
      </Suspense>

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

// Fallback component while checking auth status
function WishlistsLinkFallback({
  children,
  className,
  style,
  variant,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant: 'desktop' | 'mobile' | 'nav-item';
}) {
  // Default children based on variant if none provided
  const defaultChildren = () => {
    switch (variant) {
      case 'desktop':
        return (
          <>
            <Heart size={32} className="text-white" />
            <span className="text-white">Önskelista</span>
          </>
        );
      case 'mobile':
        return <Heart size={24} />;
      case 'nav-item':
        return (
          <>
            <Heart size={20} className="text-blue-600" />
            <span className="text-gray-900 font-medium">Önskelista</span>
          </>
        );
      default:
        return children;
    }
  };

  return (
    <div className={className} style={style}>
      {children || defaultChildren()}
    </div>
  );
}

// ✅ SHOPIFY STANDARDS: Export types for TypeScript
export type {WishlistsLinkProps};
