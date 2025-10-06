// FILE: app/components/CartMain.tsx
// ✅ PERFORMANCE FIX: Optimized collection images in empty cart

import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {ShoppingBag} from 'lucide-react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShopButton, ShopLinkButton} from './ui/ShopButton';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  popularCollections?: Collection[];
};

export function CartMain({layout, cart: originalCart, popularCollections}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={layout === 'aside' ? 'h-full flex flex-col' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
      {!cartHasItems ? (
        <CartEmpty layout={layout} popularCollections={popularCollections} />
      ) : (
        <>
          {layout === 'aside' ? (
            <>
              <div 
                className="overflow-y-auto"
                style={{
                  maxHeight: 'calc(100vh - 180px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#9CA3AF #F3F4F6'
                }}
              >
                <div className="px-4 py-2 pb-32">
                  <div className="space-y-0">
                    {(cart?.lines?.nodes ?? []).map((line, index) => (
                      <CartLineItem
                        key={line.id}
                        line={line}
                        layout={layout}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg z-50">
                <CartSummary cart={cart} layout={layout} />
              </div>
            </>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
              <section className="lg:col-span-7">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Din kundvagn ({cart?.totalQuantity || 0})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Fri upphämtning över 1299 kr
                  </p>
                </div>

                <div className="space-y-6">
                  {(cart?.lines?.nodes ?? []).map((line, index) => (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      layout={layout}
                    />
                  ))}
                </div>
              </section>

              <section className="lg:col-span-5 mt-10 lg:mt-0">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                  <CartSummary cart={cart} layout={layout} />
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CartEmpty({layout, popularCollections}: {layout: CartLayout; popularCollections?: Collection[]}) {
  const {close} = useAside();

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col items-center text-center pt-6 pb-4 px-4 flex-shrink-0">
        <ShoppingBag 
          size={48} 
          className="text-gray-300 mb-3 hidden min-[375px]:block" 
        />
        <h3 className="text-base font-medium text-gray-900 mb-2">
          Din kundvagn är tom
        </h3>
        <p className="text-gray-600 max-w-sm mb-4 text-sm">
          Du har inte lagt till några varor i din varukorg än. Börja handla för att fylla den!
        </p>

        <Link
          to="/collections/lego"
          onClick={layout === 'aside' ? close : undefined}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl transition-colors"
          style={{ color: 'white' }}
        >
          Fortsätt handla
        </Link>
      </div>

      <div className="px-4 pb-6 flex-1">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900 text-center">Populära</h4>
        </div>
        
        <PopularCategoriesGrid 
          collections={popularCollections} 
          onClose={layout === 'aside' ? close : undefined}
        />
      </div>
    </div>
  );
}

function PopularCategoriesGrid({
  collections,
  onClose,
}: {
  collections?: Collection[];
  onClose?: () => void;
}) {
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string} | null> | null | undefined,
    key: string
  ): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;
    const metafield = metafields.find((field) => field && field.key === key);
    return metafield && metafield.value ? metafield.value : null;
  };

  const isTrueValue = (value: string | null): boolean => {
    if (!value) return false;
    const normalizedValue = value.toLowerCase().trim();
    return (
      normalizedValue === 'true' ||
      normalizedValue === 'True' ||
      normalizedValue === '1' ||
      normalizedValue === 'yes'
    );
  };

  // ✅ PERFORMANCE FIX: Optimize image URLs
  const getOptimizedImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    // Display: 80px (5rem), 2x retina = 160px needed
    return url.includes('?') 
      ? `${url}&width=160` 
      : `${url}?width=160`;
  };

  const featuredCollections =
    collections
      ?.filter((collection) => {
        const featuredValue = getMetafieldValue(
          collection.metafields,
          'mobile_menu_featured',
        );
        return isTrueValue(featuredValue);
      })
      ?.slice(0, 9) || [];

  const fallbackItems = [
    {id: 'deals', title: 'Erbjudanden', image: null, handle: 'deals'},
    {id: 'new', title: 'Nytt & Populärt', image: null, handle: 'new'},
    {id: 'all-toys', title: 'Alla Leksaker', image: null, handle: 'all-toys'},
    {id: 'lego', title: 'LEGO', image: null, handle: 'lego'},
    {id: 'minecraft', title: 'Minecraft', image: null, handle: 'minecraft'},
    {id: 'sonic', title: 'Sonic', image: null, handle: 'sonic'},
    {id: 'spiderman', title: 'Spiderman', image: null, handle: 'spiderman'},
    {id: 'disney', title: 'Disney', image: null, handle: 'disney'},
    {id: 'outdoor', title: 'Utomhus', image: null, handle: 'outdoor'},
  ];

  const displayItems =
    featuredCollections.length > 0 ? featuredCollections : fallbackItems;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {displayItems.map((item) => {
        const customImageUrl = 'metafields' in item ? getMetafieldValue(
          item.metafields,
          'mobile_menu_image'
        ) : null;
        
        const rawImageUrl = customImageUrl || item.image?.url;
        const optimizedImageUrl = getOptimizedImageUrl(rawImageUrl);

        return (
          <Link
            key={item.id}
            to={`/collections/${item.handle}`}
            onClick={onClose}
            className="flex flex-col items-center text-center"
          >
            <div
              className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-1.5"
              style={{
                maxWidth: '5rem',
                backgroundColor: optimizedImageUrl ? 'transparent' : '#f3f4f6',
              }}
            >
              {optimizedImageUrl ? (
                <img
                  src={optimizedImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-gray-500 font-medium text-xs text-center px-1 leading-tight">
                  {item.title}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-gray-900 leading-tight text-center block">
              {item.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}