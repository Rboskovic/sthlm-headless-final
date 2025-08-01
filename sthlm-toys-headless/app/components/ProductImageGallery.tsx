import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import type {ProductVariantFragment} from 'storefrontapi.generated';

interface ProductImageGalleryProps {
  images: (ProductVariantFragment['image'] | null | undefined)[];
  productTitle: string;
}

export function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Filter out null/undefined images
  const validImages = images.filter(Boolean) as NonNullable<
    ProductVariantFragment['image']
  >[];

  // If no images, show placeholder
  if (validImages.length === 0) {
    return (
      <div className="w-full">
        <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200">
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
      </div>
    );
  }

  // If only one image, show simple layout
  if (validImages.length === 1) {
    return (
      <div className="w-full">
        <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
          <Image
            alt={validImages[0].altText || productTitle}
            aspectRatio="1/1"
            data={validImages[0]}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  const selectedImage = validImages[selectedImageIndex];

  return (
    <div className="w-full">
      {/* Desktop Layout: Thumbnails on left, main image on right */}
      <div className="hidden lg:flex gap-4">
        {/* Thumbnail Gallery - Vertical on Desktop */}
        <div className="flex flex-col gap-2" style={{width: '80px'}}>
          {validImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`
                aspect-square border-2 rounded-lg overflow-hidden transition-all duration-200
                ${
                  index === selectedImageIndex
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
              style={{width: '80px', height: '80px'}}
            >
              <Image
                alt={image.altText || `${productTitle} view ${index + 1}`}
                aspectRatio="1/1"
                data={image}
                sizes="80px"
                className="w-full h-full object-cover"
              />
            </button>
          ))}

          {/* Navigation arrows for more images */}
          {validImages.length > 6 && (
            <div className="flex flex-col gap-1 mt-2">
              <button
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => {
                  /* Scroll thumbnails up */
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <button
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => {
                  /* Scroll thumbnails down */
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Main Image */}
        <div className="flex-1">
          <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 relative">
            <Image
              alt={selectedImage.altText || productTitle}
              aspectRatio="1/1"
              data={selectedImage}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full h-full object-cover"
            />

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {selectedImageIndex + 1} / {validImages.length}
            </div>

            {/* Navigation arrows on main image */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      selectedImageIndex === 0
                        ? validImages.length - 1
                        : selectedImageIndex - 1,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      selectedImageIndex === validImages.length - 1
                        ? 0
                        : selectedImageIndex + 1,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout: Main image on top, thumbnails below */}
      <div className="lg:hidden">
        {/* Main Image */}
        <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 relative mb-4">
          <Image
            alt={selectedImage.altText || productTitle}
            aspectRatio="1/1"
            data={selectedImage}
            sizes="100vw"
            className="w-full h-full object-cover"
          />

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {selectedImageIndex + 1} / {validImages.length}
          </div>

          {/* Navigation arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedImageIndex(
                    selectedImageIndex === 0
                      ? validImages.length - 1
                      : selectedImageIndex - 1,
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex(
                    selectedImageIndex === validImages.length - 1
                      ? 0
                      : selectedImageIndex + 1,
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Gallery - Horizontal on Mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`
                flex-shrink-0 aspect-square border-2 rounded-lg overflow-hidden transition-all duration-200
                ${
                  index === selectedImageIndex
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-20'
                    : 'border-gray-200'
                }
              `}
              style={{width: '60px', height: '60px'}}
            >
              <Image
                alt={image.altText || `${productTitle} view ${index + 1}`}
                aspectRatio="1/1"
                data={image}
                sizes="60px"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
