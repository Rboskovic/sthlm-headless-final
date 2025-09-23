// FILE: app/components/WishlistsLink.tsx
// ✅ SHOPIFY HYDROGEN: SSR-safe wishlist link with server-side count

import {Link} from 'react-router';
import {Heart} from 'lucide-react';
import {useState, useEffect} from 'react';
import {useRootLoaderData} from '~/lib/root-data';
import {useWishlist} from '~/hooks/useWishlist';

export interface WishlistsLinkProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  initialCount?: number; // Server-provided count for logged-in users
}

export function WishlistsLink({
  className = '',
  style = {},
  children,
  initialCount = 0,
}: WishlistsLinkProps) {
  const {isLoggedIn} = useRootLoaderData();
  const {wishlistCount: sessionCount} = useWishlist();
  const [wishlistCount, setWishlistCount] = useState(initialCount);

  // For logged-in users, use server-provided count; for anonymous, use session count
  useEffect(() => {
    if (isLoggedIn) {
      setWishlistCount(initialCount);
    } else {
      setWishlistCount(sessionCount);
    }
  }, [isLoggedIn, initialCount, sessionCount]);

  // Listen for wishlist updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWishlistUpdate = (event: CustomEvent) => {
      if (!isLoggedIn) {
        setWishlistCount(event.detail?.count || 0);
      }
    };

    // Listen for custom events when wishlist is updated
    window.addEventListener('wishlist-updated', handleWishlistUpdate as EventListener);

    // Also listen for storage changes (when items are added/removed in other tabs)
    const handleStorageChange = () => {
      if (!isLoggedIn) {
        try {
          const stored = sessionStorage.getItem('sthlm_wishlist_session');
          if (stored) {
            const items = JSON.parse(stored);
            setWishlistCount(Array.isArray(items) ? items.length : 0);
          } else {
            setWishlistCount(0);
          }
        } catch (error) {
          // Ignore errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn]);

  return (
    <Link 
      to="/wishlist" 
      className={`wishlist-link ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        ...style
      }}
    >
      {children ? (
        <>
          {children}
          {/* Count badge for custom children */}
          {wishlistCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              border: '2px solid white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
              zIndex: 1,
            }}>
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </span>
          )}
        </>
      ) : (
        <>
          <div style={{ position: 'relative' }}>
            <Heart size={20} />
            {/* Count badge for default heart icon */}
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#dc2626',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                border: '2px solid currentColor',
                zIndex: 1,
              }}>
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </div>
          <span style={{ marginLeft: '8px' }}>Wishlist</span>
        </>
      )}
    </Link>
  );
}

// Helper function to update wishlist count from other components
export function updateWishlistCount() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
  }
}