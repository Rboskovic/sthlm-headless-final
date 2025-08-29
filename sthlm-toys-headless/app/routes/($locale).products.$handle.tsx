// FILE: app/routes/($locale).products.$handle.tsx
// ✅ SHOPIFY HYDROGEN STANDARD: Complete Product Detail Page with metafields
// ✅ UPDATED: Now uses ProductItem for recommended products
// ✅ FIXED: GraphQL fragment AND query naming conflicts resolved

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, Await} from 'react-router';
import {Suspense} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Money,
} from '@shopify/hydrogen';
import {ProductImageGallery} from '~/components/ProductImageGallery';
import {ProductForm} from '~/components/ProductForm';
import {ProductItem} from '~/components/ProductItem';
import {PriceDisplay} from '~/components/ui/PriceDisplay';
import {ShopButton} from '~/components/ui/ShopButton';
import {AddToCartButton} from '~/components/AddToCartButton';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {Check} from 'lucide-react';
import React, {useState} from 'react';
import {useAside} from '~/components/Aside';

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

  const [{product}, {shop}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
      },
    }),
    storefront.query(SHOP_METAFIELDS_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
    shop,
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
  
  // Load recommended products for this product
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        first: 8
      },
    })
    .catch((error) => {
      console.error('Failed to load recommended products:', error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

// Helper function to get metafield value with proper null checking
function getMetafieldValue(
  metafields: Array<{key: string; value: string; namespace: string}> | null | undefined,
  key: string,
  namespace: string = 'custom'
): string | null {
  if (!metafields || !Array.isArray(metafields)) return null;
  const metafield = metafields.find((m) => m?.key === key && m?.namespace === namespace);
  return metafield?.value || null;
}

// Helper function to parse bullet points from metafield with safe fallbacks
function parseWhyTheyLoveIt(metafieldValue: string | null | undefined): string[] {
  if (!metafieldValue || typeof metafieldValue !== 'string') return [];
  
  // Split by comma and clean up whitespace
  return metafieldValue
    .split(';')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

// ✅ NEW: Helper function to parse shipping text into bullet points
function parseShippingText(shippingText: string | null): string[] {
  if (!shippingText) return [];
  
  // Split by sentence endings and clean up
  return shippingText
    .split(/[.!]+/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

export default function Product() {
  const {product, shop, ...deferredData} = useLoaderData<typeof loader>();
  
  // ✅ KEEP: Proper quantity state management
  const [quantity, setQuantity] = useState(1);
  
  // ✅ CART MODAL: Add useAside hook to open cart
  const {open} = useAside();

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

  // ✅ FIX 1: Get ALL product images, not just variant image
  const productImages = product.images?.nodes || [selectedVariant?.image].filter(Boolean);

  // ✅ KEEP: Reset quantity when variant changes
  React.useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id]);

  // ✅ METAFIELD INTEGRATION: Extract metafield values with safe fallbacks
  // Product-specific features
  const whyTheyLoveItValue = getMetafieldValue(product?.metafields, 'why_they_love_it');
  const whyTheyLoveItItems = parseWhyTheyLoveIt(whyTheyLoveItValue);
  
  // Shop-wide shipping information
  const freeShippingText = getMetafieldValue(shop?.metafields, 'free_shipping_text') || 
    'Free Shipping on orders $49 and up*';
  
  const freeShippingNote = getMetafieldValue(shop?.metafields, 'free_shipping_note') || 
    '*Offer applies to standard shipping to one location in the contiguous U.S. A $20 shipping surcharge per item applies to customers living outside the contiguous United States: Hawaii, Alaska typically ships in 3 to 4 business days. Eligible for return on ToysRUs.com only.';

  // ✅ NEW: Parse shipping text into bullet points
  const shippingBulletPoints = parseShippingText(freeShippingText);

  console.log('🐛 Product Detail Page - selectedVariant:', selectedVariant);
  console.log('🐛 Product Detail Page - quantity:', quantity);
  console.log('🐛 Product Detail Page - product metafields:', product?.metafields);
  console.log('🐛 Product Detail Page - shop metafields:', shop?.metafields);
  console.log('🐛 Product Detail Page - whyTheyLoveItItems:', whyTheyLoveItItems);

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

      {/* Product Detail Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="order-1 lg:order-1">
            <ProductImageGallery
              images={productImages}
              productTitle={title}
            />
          </div>

          {/* Product Information */}
          <div className="order-2 lg:order-2 space-y-4">
            {/* ✅ UPDATED: Brand & Title - FIX: Override reset.css with !important */}
            <div>
              {vendor && (
                <p 
                  className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2"
                  style={{margin: '0 !important', padding: '0 !important', marginBottom: '8px !important'}}
                >
                  Märke: {vendor}
                </p>
              )}
              <h1 
                className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3"
                style={{margin: '0 !important', padding: '0 !important', marginBottom: '12px !important'}}
              >
                {title}
              </h1>
              {/* ✅ NEW: Article Number Display - Below Title */}
              {selectedVariant?.sku && (
                <div 
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200"
                  style={{margin: '0 !important', padding: '6px 12px !important'}}
                >
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Artikelnummer:
                  </span>
                  <span className="text-sm font-semibold text-gray-900 ml-2">
                    {selectedVariant.sku}
                  </span>
                </div>
              )}
            </div>

            {/* ✅ UPDATED: Product Price Display with (inkl. moms) */}
            <div className="py-2">
              {selectedVariant?.price && (
                <div className="flex items-baseline gap-3 flex-wrap">
                  {/* Current Price with VAT text */}
                  <div className="flex items-baseline gap-2">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-semibold text-gray-900">
                        {Math.round(parseFloat(selectedVariant.price.amount))}
                      </span>
                      <span className="text-lg font-medium text-gray-700 ml-1">
                        kr
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      (inkl. moms)
                    </span>
                  </div>
                  
                  {/* Compare At Price (Sale Price) */}
                  {selectedVariant?.compareAtPrice && 
                    parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-xl text-gray-500 line-through">
                          {Math.round(parseFloat(selectedVariant.compareAtPrice.amount))}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          kr
                        </span>
                      </div>
                      
                      {/* Discount Badge */}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        -{Math.round(
                          ((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) /
                            parseFloat(selectedVariant.compareAtPrice.amount)) * 100
                        )}%
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Why They'll Love It Section */}
            {whyTheyLoveItItems && whyTheyLoveItItems.length > 0 && (
              <div className="space-y-4">
                <button
                  className="flex items-center justify-between w-full text-left"
                  type="button"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    Varför du kommer älska det
                  </h3>
                  <span className="text-gray-400">-</span>
                </button>
                
                <div className="space-y-3">
                  {whyTheyLoveItItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Options - Hide quantity, keep logic */}
            <div className="space-y-4">
              <ProductForm
                product={product}
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                quantity={quantity}
                onQuantityChange={setQuantity}
                hideQuantity={true}
              />
            </div>

            {/* Availability Status - FIX 4: Increase size */}
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-900">Lagerstatus:</span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-base text-gray-700 font-medium">
                  {selectedVariant?.availableForSale ? 'I lager' : 'Slut i lager'}
                </span>
              </div>
            </div>

            {/* ✅ UPDATED: Free Shipping Information with bullet points */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {/* Bold shipping note first */}
              <p className="text-sm font-bold text-gray-900 leading-relaxed">
                {freeShippingNote}
              </p>
              
              {/* Shipping details as bullet points */}
              {shippingBulletPoints.length > 0 && (
                <ul className="space-y-1">
                  {shippingBulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add to Cart & Buy Now Buttons - Both visible with cart modal */}
            <div className="space-y-3">
              {/* Add to Cart button - NOW OPENS CART MODAL */}
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant?.id || '',
                    quantity: 1,
                  },
                ]}
                onClick={() => {
                  console.log('🐛 Opening cart aside after adding item');
                  open('cart');
                }}
                disabled={!selectedVariant?.availableForSale}
                analytics={{
                  products: [
                    {
                      productGid: product.id,
                      variantGid: selectedVariant?.id || '',
                      name: product.title,
                      variantName: selectedVariant?.title || product.title,
                      brand: product.vendor,
                      price: selectedVariant?.price?.amount || '0',
                      quantity: 1,
                    },
                  ],
                }}
                variant="primary"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-2xl transition-colors duration-200"
              >
                Lägg i varukorg
              </AddToCartButton>

              {/* Shop Pay checkout - Wider padding */}
              <form method="POST" action={`/cart/${selectedVariant?.id}:1`} className="w-full">
                <button 
                  type="submit"
                  className="w-full text-white font-semibold py-4 px-12 rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2"
                  style={{backgroundColor: '#5a31f4'}}
                >
                  Köp med <span className="font-bold">Shop</span><span className="bg-white text-purple-600 px-1 rounded text-sm font-bold">Pay</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Product Description - FIX 10: Same width as top part */}
        {descriptionHtml && (
          <div className="mt-12">
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Produktbeskrivning
              </h3>
              <div 
                className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
            </div>
          </div>
        )}

        {/* ✅ UPDATED: Recommended Products Section - Now uses ProductItem */}
        <Suspense fallback={<RecommendedProductsSkeleton />}>
          <Await
            resolve={deferredData.recommendedProducts}
            errorElement={<div>Failed to load recommended products</div>}
          >
            {(recommendedProducts) => (
              <RecommendedProducts 
                products={recommendedProducts?.products?.nodes || []}
                currentProductId={product.id}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

// ✅ SHOPIFY HYDROGEN: Updated GraphQL query with metafields
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
  #graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "why_they_love_it"}
    ]) {
      key
      value
      namespace
    }
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
  #graphql
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
` as const;

// ✅ SHOP METAFIELDS: Global shipping information
const SHOP_METAFIELDS_QUERY = `#graphql
  query ShopMetafields($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      id
      name
      metafields(identifiers: [
        {namespace: "custom", key: "free_shipping_text"},
        {namespace: "custom", key: "free_shipping_note"}
      ]) {
        key
        value
        namespace
      }
    }
  }
` as const;

// ✅ RECOMMENDED PRODUCTS: Query for product recommendations - FIXED BOTH FRAGMENT AND QUERY NAMES
const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment ProductPageRecommendedProduct on Product {
    id
    title
    handle
    vendor
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: []) {
      id
      title
      availableForSale
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      image {
        id
        url
        altText
        width
        height
      }
    }
  }
  query ProductPageRecommendedProducts(
    $country: CountryCode, 
    $language: LanguageCode,
    $first: Int = 8
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductPageRecommendedProduct
      }
    }
  }
` as const;

// ✅ UPDATED: Recommended Products Component - Now uses ProductItem
function RecommendedProducts({
  products,
  currentProductId,
}: {
  products: any[];
  currentProductId: string;
}) {
  // Filter out current product and limit to 4 items
  const filteredProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, 4);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Du kanske också gillar
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 4 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
    </div>
  );
}

// ✅ LOADING SKELETON
function RecommendedProductsSkeleton() {
  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({length: 4}).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}