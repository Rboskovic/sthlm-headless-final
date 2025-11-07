// FILE: app/components/Footer/FooterLogo.tsx
// ✅ PERFORMANCE FIX: Added explicit width/height attributes

import {Link} from 'react-router';

interface Shop {
  name: string;
  brand?: {
    logo?: {
      image?: {
        url: string;
      };
    };
  } | null;
}

export function FooterLogo({shop}: {shop: Shop}) {
  const logoUrl = shop?.brand?.logo?.image?.url;
  
  // Optimize footer logo URL with Shopify CDN parameters
  const optimizedLogoUrl = logoUrl 
    ? (logoUrl.includes('?') ? `${logoUrl}&width=144` : `${logoUrl}?width=144`)
    : undefined;

  return (
    <Link to="/" className="flex items-center">
      {optimizedLogoUrl ? (
        <img
          src={optimizedLogoUrl}
          alt={shop.name}
          width="144"
          height="48"
          className="h-12 w-auto"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="text-white font-bold text-lg">
          {shop?.name || 'Klosslabbet'}
        </span>
      )}
    </Link>
  );
}