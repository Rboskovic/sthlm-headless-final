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
import {useState} from 'react';

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
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
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

  return (
    <div className="w-full bg-white min-h-screen">
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
          <a href="/" className="hover:text-blue-600 transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/products" className="hover:text-blue-600 transition-colors">
            Products
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-12">
          {/* Product Images - Left Column */}
          <div className="order-1">
            <ProductImageGallery images={productImages} productTitle={title} />
          </div>

          {/* Product Information - Right Column */}
          <div className="order-2 space-y-6">
            {/* Product Title & Brand */}
            <div>
              <h1
                className="text-2xl lg:text-3xl font-medium text-gray-900 leading-tight mb-2"
                style={{
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              >
                {title}
              </h1>
              {vendor && (
                <p
                  className="text-sm text-gray-600"
                  style={{
                    fontFamily:
                      "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  }}
                >
                  by {vendor}
                </p>
              )}
            </div>

            {/* Key Features Section */}
            <div>
              <h3
                className="text-lg font-medium text-gray-900 mb-3"
                style={{
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              >
                Key features
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    High quality materials and attention to detail
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Safe and suitable for children
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Perfect addition to your toy collection
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Encourages imaginative play
                  </span>
                </li>
              </ul>
            </div>

            {/* Price Section */}
            <div
              className="product-price-wrapper py-4"
              style={{
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
            >
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
              {selectedVariant?.compareAtPrice && (
                <div className="mt-1">
                  <span className="text-red-600 text-sm font-medium">
                    Spara{' '}
                    {(
                      parseFloat(selectedVariant.compareAtPrice.amount) -
                      parseFloat(selectedVariant.price.amount)
                    ).toFixed(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Product Options & Add to Cart */}
            <div className="space-y-4">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 pt-2">
              <span
                className="text-sm font-medium text-gray-700"
                style={{
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                }}
              >
                Tillgänglighet
              </span>
              {selectedVariant?.availableForSale ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 text-sm font-medium">
                    In Stock
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 text-sm font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description - Full Width Below */}
        {descriptionHtml && (
          <div className="border-t pt-8 pb-12">
            <h3
              className="text-lg font-medium text-gray-900 mb-4"
              style={{
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
            >
              Product Description
            </h3>
            <div
              className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
              style={{
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />
          </div>
        )}

        {/* Phase 2: Recommended Products and Recently Viewed Products sections will go here */}
        {/* 
        <RecommendedProducts />
        <RecentlyViewedProducts />
        */}
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
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
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

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
  ${PRODUCT_FRAGMENT}
`;
