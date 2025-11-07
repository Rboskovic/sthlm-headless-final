// app/components/WishlistIcon.tsx
// ✅ UPDATED: Better integration with header styling

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import { WishlistStorage } from '~/lib/wishlist-storage';

interface WishlistIconProps {
  className?: string;
  style?: React.CSSProperties;
  showText?: boolean; // For desktop vs mobile
}

export function WishlistIcon({ 
  className = '', 
  style = {},
  showText = false 
}: WishlistIconProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial count
    setCount(WishlistStorage.getCount());

    // Listen for updates
    const handleUpdate = (event: CustomEvent) => {
      setCount(event.detail.count || 0);
    };

    window.addEventListener('wishlist-updated', handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('wishlist-updated', handleUpdate as EventListener);
    };
  }, []);

  return (
    <Link 
      to="/wishlist" 
      className={`relative inline-flex items-center transition-colors ${className}`}
      style={{
        textDecoration: 'none',
        ...style
      }}
      title="My Wishlist"
    >
      <div className="relative">
        <Heart 
          size={showText ? 18 : 20} 
          className="text-white"
        />
        
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium text-center leading-none">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
      
      {showText && (
        <span 
          className="text-white ml-2"
          style={{
            fontSize: '15px',
            fontWeight: 500,
          }}
        >
          Önskelista
        </span>
      )}
    </Link>
  );
}