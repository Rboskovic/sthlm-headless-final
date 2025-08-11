// FILE: app/routes/($locale).products.$handle.tsx
// ✅ SHOPIFY STANDARD: Product detail page with proper quantity state management

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImageGallery} from '~/components/ProductImageGallery';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import React, {useState} from 'react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `${data?.product.title ?? ''} | Stockholm Toys`},
    {name: 'description', content: data?.product.description ?? ''},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.
  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  
  // ✅ FIXED: Proper quantity state management
  const [quantity, setQuantity] = useState(1);

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;

  // Get all product images - if multiple variants have different images, collect them
  const productImages = [
    selectedVariant?.image,
    // Add more images from other variants or product.images if available
    // This will be enhanced when you have products with multiple images
  ].filter(Boolean);

  // ✅ FIXED: Reset quantity when variant changes
  React.useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id]);

  console.log('🐛 Product Detail Page - selectedVariant:', selectedVariant);
  console.log('🐛 Product Detail Page - quantity:', quantity);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Analytics Integration */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: selectedVariant?.product?.id || product.id,
              title: selectedVariant?.product?.title || product.title,
              price: selectedVariant?.price?.amount || '0',
              vendor: selectedVariant?.product?.vendor || product.vendor,
              variantId: selectedVariant?.id,
              variantTitle: selectedVariant?.title,
              quantity: quantity,
            },
          ],
        }}
      />

      {/* Main Product Container */}
      <div
        className="mx-auto px-4 lg:px-16"
        style={{
          maxWidth: '1400px',
        }}
      >
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center space-x-2 py-4 text-sm text-gray-600"
          style={{
            fontFamily:
              "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
          }}
        >
          <a href="/" className="hover:text-blue-600">
            Home
          </a>
          <span>›</span>
          <span className="text-gray-900">{title}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-16">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            <ProductImageGallery images={productImages} />
          </div>

          {/* Right Column - Product Information */}
          <div className="flex flex-col space-y-6">
            {/* Vendor */}
            {vendor && (
              <p
                className="text-sm text-gray-600"
                style={{
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              >
                {vendor}
              </p>
            )}

            {/* Product Title */}
            <h1
              className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
              style={{
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
            >
              {title}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <ProductPrice selectedVariant={selectedVariant} />
            </div>

            {/* ✅ FIXED: Product Form with proper quantity state */}
            <ProductForm
              product={product}
              productOptions={productOptions}
              selectedVariant={selectedVariant}
              quantity={quantity}
              onQuantityChange={setQuantity}
            />

            {/* Product Description */}
            {descriptionHtml && (
              <div className="space-y-4">
                <h3
                  className="text-lg font-semibold text-gray-900"
                  style={{
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  }}
                >
                  Product Description
                </h3>
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  style={{
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  }}
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </div>
            )}

            {/* Additional Product Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3
                className="text-lg font-semibold text-gray-900 mb-4"
                style={{
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              >
                Product Details
              </h3>
              <dl className="space-y-2 text-sm">
                {product.productType && (
                  <>
                    <dt className="font-medium text-gray-900">Category</dt>
                    <dd className="text-gray-600 mb-2">{product.productType}</dd>
                  </>
                )}
                {selectedVariant?.sku && (
                  <>
                    <dt className="font-medium text-gray-900">SKU</dt>
                    <dd className="text-gray-600 mb-2">{selectedVariant.sku}</dd>
                  </>
                )}
                {product.tags && product.tags.length > 0 && (
                  <>
                    <dt className="font-medium text-gray-900">Tags</dt>
                    <dd className="text-gray-600">
                      {product.tags.slice(0, 5).join(', ')}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ SHOPIFY STANDARD: Product Query Fragment
const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    productType
    tags
    images(first: 20) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants: variants(first: 3) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
      id
      vendor
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;