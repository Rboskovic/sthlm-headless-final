// FILE: app/components/WishlistsLink.tsx
// ✅ ENHANCED: Added wishlist count badge (Issue #5)

import {Link} from 'react-router';
import {Heart} from 'lucide-react';
import {useState, useEffect} from 'react';

export interface WishlistsLinkProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function WishlistsLink({
  className = '',
  style = {},
  children,
}: WishlistsLinkProps) {
  const [wishlistCount, setWishlistCount] = useState(0);

  // ✅ ENHANCED: Check wishlist count from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateWishlistCount = () => {
        // Check for any wishlist data - we'll look for keys starting with 'wishlist_'
        let totalCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('wishlist_')) {
            try {
              const items = JSON.parse(localStorage.getItem(key) || '[]');
              if (Array.isArray(items)) {
                totalCount += items.length;
              }
            } catch (error) {
              // Ignore parsing errors
            }
          }
        }
        setWishlistCount(totalCount);
      };

      // Update count on mount
      updateWishlistCount();

      // Listen for storage changes (when items are added/removed)
      window.addEventListener('storage', updateWishlistCount);

      // Also listen for custom events when wishlist is updated
      window.addEventListener('wishlist-updated', updateWishlistCount);

      return () => {
        window.removeEventListener('storage', updateWishlistCount);
        window.removeEventListener('wishlist-updated', updateWishlistCount);
      };
    }
  }, []);

  return (
    <Link 
      to="/account/wishlist" 
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
          {/* ✅ ENHANCED: Count badge for custom children */}
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
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
            }}>
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </span>
          )}
        </>
      ) : (
        <>
          <div style={{ position: 'relative' }}>
            <Heart size={20} />
            {/* ✅ ENHANCED: Count badge for default heart icon */}
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
                border: '2px solid currentColor'
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

// ✅ Helper function to update wishlist count from other components
export function updateWishlistCount() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
  }
}