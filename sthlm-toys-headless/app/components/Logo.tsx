import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {HeaderQuery} from 'storefrontapi.generated';

interface LogoProps {
  shop: HeaderQuery['shop'];
  className?: string;
  style?: React.CSSProperties;
  linkClassName?: string;
  linkStyle?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large' | 'custom';
  linkTo?: string;
}

// Default sizes for the logo
const logoSizes = {
  small: {width: '80px', height: '32px'},
  medium: {width: '130px', height: '46px'},
  large: {width: '180px', height: '64px'},
  custom: {width: 'auto', height: 'auto'},
};

export function Logo({
  shop,
  className = '',
  style = {},
  linkClassName = '',
  linkStyle = {},
  size = 'medium',
  linkTo = '/',
}: LogoProps) {
  const logoUrl = shop?.brand?.logo?.image?.url;
  const shopName = shop?.name || 'STHLM Toys & Games';
  const sizeStyles = logoSizes[size];

  // Logo container styles
  const containerStyles = {
    ...sizeStyles,
    ...style,
  };

  // Default link styles
  const defaultLinkStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...linkStyle,
  };

  if (logoUrl) {
    return (
      <Link
        to={linkTo}
        className={`${linkClassName}`.trim()}
        style={defaultLinkStyles}
      >
        <div
          className={`flex items-center justify-center ${className}`.trim()}
          style={containerStyles}
        >
          <Image
            data={{
              url: logoUrl,
              altText: `${shopName} logo`,
              width: parseInt(containerStyles.width as string) || 130,
              height: parseInt(containerStyles.height as string) || 46,
            }}
            sizes={`${containerStyles.width}`}
            className="object-contain w-full h-full"
            style={{
              maxWidth: containerStyles.width,
              maxHeight: containerStyles.height,
            }}
          />
        </div>
      </Link>
    );
  }

  // Fallback to text logo if no image is set in Shopify
  return (
    <Link to={linkTo} className={linkClassName} style={defaultLinkStyles}>
      <div
        className={`flex items-center justify-center bg-red-500 text-white rounded-lg font-bold border-2 border-yellow-400 shadow-lg ${className}`.trim()}
        style={{
          ...containerStyles,
          fontSize:
            size === 'small' ? '14px' : size === 'large' ? '24px' : '18px',
        }}
      >
        {shopName.length > 8 ? shopName.substring(0, 8) : shopName}
      </div>
    </Link>
  );
}

// Usage examples:
// <Logo shop={shop} />  // Default medium size
// <Logo shop={shop} size="small" />  // Small size
// <Logo shop={shop} size="large" />  // Large size
// <Logo shop={shop} size="custom" style={{width: '200px', height: '80px'}} />  // Custom size
// <Logo shop={shop} linkTo="/about" />  // Custom link destination
