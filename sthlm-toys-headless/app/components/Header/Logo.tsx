// FILE: app/components/Header/Logo.tsx
// ✅ SHOPIFY 2025 STANDARDS: Optimized logo component with proper sizing and fallbacks
// ✅ PERFORMANCE FIX: Added explicit width/height attributes and decoding="async"

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
  const logoAlt = shop?.brand?.logo?.image?.altText || shop?.name || 'Klosslabbet';
  const shopName = shop?.name || 'Klosslabbet';

  // Optimize logo URL with Shopify CDN parameters
  const optimizedLogoUrl = logoUrl 
    ? (logoUrl.includes('?') ? `${logoUrl}&width=288` : `${logoUrl}?width=288`)
    : undefined;

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
      {optimizedLogoUrl ? (
        <img
          src={optimizedLogoUrl}
          alt={logoAlt}
          width="288"
          height="96"
          style={defaultStyle}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onError={(e) => {
            // Fallback if logo fails to load
            console.warn('Logo failed to load:', optimizedLogoUrl);
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
        className="flex items-center text-white font-bold"
        style={{
          height: style.height || '50px',
          maxWidth: style.maxWidth || '200px',
          justifyContent: 'center',
          display: optimizedLogoUrl ? 'none' : 'flex',
          ...style,
        }}
      >
        <span className="text-lg font-bold whitespace-nowrap">
          klosslabbet.se
        </span>
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