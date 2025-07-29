import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Heart} from 'lucide-react';
import {useState} from 'react';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {ProductPrice} from './ProductPrice';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Calculate discount percentage for badge
  const minPrice = product.priceRange.minVariantPrice;
  const compareAtPrice = minPrice.compareAtPrice;

  let discountPercentage = 0;
  if (
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(minPrice.amount)
  ) {
    discountPercentage = Math.round(
      ((parseFloat(compareAtPrice.amount) - parseFloat(minPrice.amount)) /
        parseFloat(compareAtPrice.amount)) *
        100,
    );
  }

  // Determine badge type
  const getBadge = () => {
    const title = product.title.toLowerCase();

    if (title.includes('exclusive') || title.includes('limited')) {
      return {text: 'EXCLUSIVE', color: 'bg-blue-600'};
    }

    if (discountPercentage > 0) {
      return {text: `-${discountPercentage}%`, color: 'bg-red-600'};
    }

    return null;
  };

  const badge = getBadge();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Integrate with your wishlist system
    console.log(
      `${isWishlisted ? 'Removed from' : 'Added to'} wishlist:`,
      product.title,
    );
  };

  return (
    <div
      className="group relative overflow-hidden cursor-pointer flex flex-col"
      style={{
        width: '298px', // Exact Smyths width
        height: '443.766px', // Exact Smyths height
        paddingBottom: '12px', // Smyths padding
        fontFamily:
          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
      }}
    >
      {/* Wishlist Heart - Top Right */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200"
        style={{width: '32px', height: '32px'}}
      >
        <Heart
          size={18}
          className={`transition-colors duration-200 ${
            isWishlisted
              ? 'fill-red-500 text-red-500'
              : 'text-gray-400 hover:text-red-500'
          }`}
        />
      </button>

      {/* Discount Badge - Top Left */}
      {badge && (
        <div
          className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded text-white text-xs font-bold ${badge.color}`}
          style={{
            fontSize: '10px',
            fontWeight: 700,
            lineHeight: '13px',
          }}
        >
          {badge.text}
        </div>
      )}

      {/* Original ProductItem structure with Smyths styling */}
      <Link
        className="product-item block"
        key={product.id}
        prefetch="intent"
        to={variantUrl}
      >
        {/* Product Image - Smyths style */}
        <div
          className="relative overflow-hidden bg-white"
          style={{
            aspectRatio: '1/1',
            marginBottom: '12px',
          }}
        >
          {image && (
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="298px"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {/* Product Info - Smyths style */}
        <div className="flex-grow">
          {/* Product Title with Smyths styling */}
          <h4
            className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-200 line-clamp-2"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '18.9px',
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              marginBottom: '8px',
              minHeight: '38px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'rgb(32, 34, 35)',
            }}
          >
            {product.title}
          </h4>

          {/* Use existing ProductPrice component with Smyths styling */}
          <div
            className="product-price-wrapper"
            style={{
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            <ProductPrice price={minPrice} compareAtPrice={compareAtPrice} />
          </div>
        </div>
      </Link>
    </div>
  );
}
