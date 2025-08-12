// FILE: app/components/Header/Logo.tsx
// ✅ SHOPIFY 2025 STANDARDS: Optimized logo component with proper sizing and fallbacks

import {Link} from 'react-router';

interface LogoProps {
  shop: {
    id?: string;
    name: string;
    brand?: {
      logo?: {
        image?: {
          url: string;
          altText?: string;
        };
      };
    } | null;
  };
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({shop, className = '', style = {}}: LogoProps) {
  // Extract logo data with proper fallbacks
  const logoUrl = shop?.brand?.logo?.image?.url;
  const logoAlt = shop?.brand?.logo?.image?.altText || shop?.name || 'STHLM Toys & Games';
  const shopName = shop?.name || 'STHLM Toys & Games';

  // Default styling that can be overridden
  const defaultStyle: React.CSSProperties = {
    height: '50px',
    width: 'auto',
    maxWidth: '200px',
    objectFit: 'contain',
    objectPosition: 'left center',
    ...style,
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center hover:opacity-90 transition-opacity ${className}`}
      aria-label={`Go to ${shopName} homepage`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={logoAlt}
          style={defaultStyle}
          loading="eager" // Logo should load immediately
          onError={(e) => {
            // Fallback if logo fails to load
            console.warn('Logo failed to load:', logoUrl);
            e.currentTarget.style.display = 'none';
            // Show fallback text logo
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.style.display = 'flex';
            }
          }}
        />
      ) : null}
      
      {/* Fallback Text Logo - Hidden by default, shown if image fails */}
      <div 
        className="flex flex-col items-start text-white font-bold"
        style={{
          height: style.height || '50px',
          maxWidth: style.maxWidth || '200px',
          justifyContent: 'center',
          display: logoUrl ? 'none' : 'flex',
          ...style,
        }}
      >
        <div className="text-lg leading-tight font-bold whitespace-nowrap">
          STHLM
        </div>
        <div className="text-yellow-400 text-sm leading-tight font-semibold whitespace-nowrap">
          TOYS & GAMES
        </div>
      </div>
    </Link>
  );
}

/**
 * Logo Size Guidelines for Different Contexts:
 * 
 * Desktop Header: 
 * style={{ height: '45px', maxWidth: '180px' }}
 * 
 * Mobile Header:
 * style={{ height: '36px', maxWidth: '140px' }}
 * 
 * Footer:
 * style={{ height: '32px', maxWidth: '120px' }}
 * 
 * Email/Print:
 * style={{ height: '60px', maxWidth: '240px' }}
 */