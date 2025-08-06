// app/components/Header/Logo.tsx - ✅ SMYTHS STYLE: Compact sizing and proper scaling

import {Link} from 'react-router';

interface LogoProps {
  shop: any;
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({shop, className = '', style = {}}: LogoProps) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      {shop?.brand?.logo?.image?.url ? (
        <img
          src={shop.brand.logo.image.url}
          alt={shop.name || 'STHLM Toys & Games'}
          style={{
            // ✅ SMYTHS STYLE: Let the header control sizing via style prop
            height: style.height || '50px', // Default height if not specified
            width: 'auto', // Let width scale naturally
            maxWidth: style.maxWidth || '200px', // Prevent oversizing
            objectFit: 'contain',
            objectPosition: 'left center', // Align to left like Smyths
            ...style,
          }}
        />
      ) : (
        // ✅ IMPROVED: Compact text logo for fallback
        <div 
          className={`flex flex-col items-start text-white font-bold`}
          style={{
            height: style.height || '50px',
            maxWidth: style.maxWidth || '200px',
            justifyContent: 'center',
            ...style,
          }}
        >
          <div className="text-lg leading-tight font-bold">STHLM</div>
          <div className="text-yellow-400 text-sm leading-tight font-semibold">
            TOYS & GAMES
          </div>
        </div>
      )}
    </Link>
  );
}