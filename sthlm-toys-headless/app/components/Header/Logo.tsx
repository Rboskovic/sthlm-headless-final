// FILE: app/components/Header/Logo.tsx
// ✅ PERFORMANCE OPTIMIZED: Proper sizing for desktop vs mobile

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
  isMobile?: boolean; // NEW: Differentiate mobile vs desktop
}

export function Logo({shop, className = '', style = {}, isMobile = false}: LogoProps) {
  const logoUrl = shop?.brand?.logo?.image?.url;
  const logoAlt = shop?.brand?.logo?.image?.altText || shop?.name || 'Klosslabbet';
  const shopName = shop?.name || 'Klosslabbet';

  // ✅ PERFORMANCE: Load appropriate size based on context
  const logoWidth = isMobile ? 150 : 250; // Mobile: 150px, Desktop: 250px
  const optimizedLogoUrl = logoUrl 
    ? (logoUrl.includes('?') 
        ? `${logoUrl}&width=${logoWidth}&format=webp&quality=90` 
        : `${logoUrl}?width=${logoWidth}&format=webp&quality=90`)
    : undefined;

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
          width={logoWidth.toString()}
          height={isMobile ? '50' : '83'}
          style={defaultStyle}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      ) : null}
      
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