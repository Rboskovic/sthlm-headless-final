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
  return (
    <Link to="/" className="flex items-center">
      {shop?.brand?.logo?.image?.url ? (
        <img
          src={shop.brand.logo.image.url}
          alt={shop.name}
          className="h-8 w-auto"
          style={{filter: 'brightness(0) invert(1)'}} // Make logo white for footer
        />
      ) : (
        <span className="text-white font-bold text-lg">
          {shop?.name || 'STHLM Toys & Games'}
        </span>
      )}
    </Link>
  );
}
