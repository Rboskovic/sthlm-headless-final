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
          className="h-12 w-auto"
        />
      ) : (
        <span className="text-white font-bold text-lg">
          {shop?.name || 'Klosslabbet'}
        </span>
      )}
    </Link>
  );
}
