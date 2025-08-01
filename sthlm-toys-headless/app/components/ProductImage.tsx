import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
  className = '',
  aspectRatio = '1/1',
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: {
  image: ProductVariantFragment['image'];
  className?: string;
  aspectRatio?: string;
  sizes?: string;
}) {
  if (!image) {
    return (
      <div
        className={`product-image bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 ${className}`}
        style={{
          aspectRatio: aspectRatio,
          minHeight: '300px',
        }}
      >
        <div className="text-gray-400 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-image ${className}`}>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio={aspectRatio}
        data={image}
        key={image.id}
        sizes={sizes}
        className="w-full h-full object-cover"
        style={{
          aspectRatio: aspectRatio,
        }}
      />
    </div>
  );
}
