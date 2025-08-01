// app/components/Logo.tsx (NEW)
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

export function Logo({shop}: {shop: Shop}) {
  return (
    <Link to="/" className="flex items-center">
      {shop?.brand?.logo?.image?.url ? (
        <img
          src={shop.brand.logo.image.url}
          alt={shop.name}
          className="h-8 w-auto"
        />
      ) : (
        <span className="font-bold text-xl">{shop.name}</span>
      )}
    </Link>
  );
}
