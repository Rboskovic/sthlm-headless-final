// app/components/Logo.tsx - Generic Logo Component for Footer/Other Uses
import {Link} from 'react-router';

interface LogoProps {
  shop: {
    name: string;
    brand?: {
      logo?: {
        image?: {
          url: string;
        };
      };
    } | null;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'white';
}

export function Logo({
  shop, 
  className = '', 
  size = 'md',
  color = 'default'
}: LogoProps) {
  // Size classes for different use cases
  const sizeClasses = {
    sm: 'h-6', // 24px - for small areas
    md: 'h-8', // 32px - for footer/normal use  
    lg: 'h-12', // 48px - for header use
  };

  // Color classes for different backgrounds
  const colorClasses = {
    default: 'text-gray-900',
    white: 'text-white',
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      {shop?.brand?.logo?.image?.url ? (
        <img
          src={shop.brand.logo.image.url}
          alt={shop.name || 'STHLM Toys & Games'}
          className={`${sizeClasses[size]} w-auto`}
          style={color === 'white' ? {filter: 'brightness(0) invert(1)'} : {}}
        />
      ) : (
        <div className={`flex flex-col items-start font-bold ${colorClasses[color]}`}>
          <div className="text-lg leading-tight font-bold">STHLM</div>
          <div className="text-yellow-400 text-sm leading-tight font-semibold">
            TOYS & GAMES
          </div>
        </div>
      )}
    </Link>
  );
}