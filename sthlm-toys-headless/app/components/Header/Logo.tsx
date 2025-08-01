// app/components/Header/Logo.tsx - Fixed size, alignment, and cutting issues
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

interface LogoProps {
  shop: any;
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({shop, className = '', style = {}}: LogoProps) {
  const logoUrl = shop?.brand?.logo?.image?.url;
  const shopName = shop?.name || 'STHLM Toys & Games';

  if (logoUrl) {
    return (
      <Link to="/" className="flex-shrink-0">
        <div
          className={`flex items-center justify-center ${className}`}
          style={{
            // Increased size while staying within header constraints
            height: style.height || '90px', // Increased from 80px
            width: style.width || '240px', // Increased from 200px
            minHeight: style.height || '90px',
            minWidth: style.width || '240px',
            maxHeight: style.height || '90px',
            maxWidth: style.width || '240px',
            overflow: 'visible', // Prevent clipping
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Ensure perfect centering
            ...style,
          }}
        >
          <Image
            data={{
              url: logoUrl,
              altText: `${shopName} logo`,
              width: parseInt(
                style.width?.toString().replace('px', '') || '240',
              ),
              height: parseInt(
                style.height?.toString().replace('px', '') || '90',
              ),
            }}
            sizes={`${style.width || '240px'}`}
            className="object-contain w-full h-full"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              width: 'auto', // Allow natural sizing
              height: 'auto', // Allow natural sizing
            }}
          />
        </div>
      </Link>
    );
  }

  // Fallback to styled text logo if no image is set in Shopify
  return (
    <Link to="/" className="flex-shrink-0">
      <div
        className={`flex flex-col items-center justify-center text-white font-bold ${className}`}
        style={{
          height: style.height || '90px', // Increased size
          width: style.width || '240px', // Increased size
          minHeight: style.height || '90px',
          minWidth: style.width || '240px',
          maxHeight: style.height || '90px',
          maxWidth: style.width || '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <div className="text-3xl leading-tight font-bold">STHLM</div>
        <div className="text-yellow-400 text-xl leading-tight font-semibold">
          TOYS & GAMES
        </div>
      </div>
    </Link>
  );
}
