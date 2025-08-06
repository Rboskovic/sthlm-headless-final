// app/components/Header/Logo.tsx - SHOPIFY STANDARD with large header sizing
import {Link} from 'react-router';

interface LogoProps {
  shop: any;
  className?: string;
}

export function Logo({shop, className = ''}: LogoProps) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      {shop?.brand?.logo?.image?.url ? (
        <img
          src={shop.brand.logo.image.url}
          alt={shop.name || 'STHLM Toys & Games'}
          className="h-40 w-auto" // ✅ FIXED: Much larger h-20 (80px) to properly fill header space
        />
      ) : (
        // ✅ IMPROVED: Large text logo to match header prominence
        <div className="flex flex-col items-start text-white font-bold">
          <div className="text-4xl leading-tight font-bold">STHLM</div>
          <div className="text-yellow-400 text-xl leading-tight font-semibold">
            TOYS & GAMES
          </div>
        </div>
      )}
    </Link>
  );
}