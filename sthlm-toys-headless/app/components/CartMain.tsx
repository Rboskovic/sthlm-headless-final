// FILE: app/components/CartMain.tsx
// ✅ UPDATED: Now uses collections directly from popular_collections metaobject (no filtering)

import {Link} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {ShoppingBag} from 'lucide-react';
import {useAside} from './Aside';
import {CartLineItem} from './CartLineItem';
import {CartSummary} from './CartSummary';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  popularCollections?: Collection[];
};

export function CartMain({layout = 'aside', cart: originalCart, popularCollections}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount = cart && Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      {!linesCount && (
        <CartEmpty layout={layout} popularCollections={popularCollections} />
      )}
      {linesCount && (
        <>
          {layout === 'aside' ? (
            <div className="flex flex-col h-full">
              <section className="flex-1 overflow-y-auto cart-items-container">
                <div className="space-y-4">
                  {(cart?.lines?.nodes || []).map((line, index) => (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      layout={layout}
                    />
                  ))}
                </div>
              </section>

              <section className="cart-summary-container">
                <CartSummary cart={cart} layout={layout} />
              </section>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8">
              <section className="lg:col-span-7">
                <div className="space-y-4">
                  {(cart?.lines?.nodes || []).map((line, index) => (
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

      <div className={layout === 'page' ? 'px-4 pb-6 flex-1 max-w-4xl mx-auto w-full' : 'px-4 pb-6 flex-1'}>
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900 text-center">Populära</h4>
        </div>
        
        <PopularCategoriesGrid 
          collections={popularCollections} 
          onClose={layout === 'aside' ? close : undefined}
          layout={layout}
        />
      </div>
    </div>
  );
}

// ✅ UPDATED: No more filtering - uses collections directly from metaobject
function PopularCategoriesGrid({
  collections,
  onClose,
  layout = 'aside',
}: {
  collections?: Collection[];
  onClose?: () => void;
  layout?: CartLayout;
}) {
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string} | null> | null | undefined,
    key: string
  ): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;
    const metafield = metafields.find((field) => field && field.key === key);
    return metafield && metafield.value ? metafield.value : null;
  };

  // ✅ RESPONSIVE: Different image sizes for different layouts
  const getOptimizedImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    // Aside: 80px display = 160px for retina
    // Page: 120px display = 240px for retina
    const width = layout === 'page' ? 240 : 160;
    return url.includes('?') 
      ? `${url}&width=${width}` 
      : `${url}?width=${width}`;
  };

  // ✅ UPDATED: No filtering! Use collections directly, limit to 9
  const displayCollections = collections?.slice(0, 9) || [];

  // Fallback items (only show if NO collections provided)
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

  const displayItems = displayCollections.length > 0 ? displayCollections : fallbackItems;

  // ✅ RESPONSIVE: Different grid layouts
  // Aside: 3 columns always (narrow sidebar)
  // Page: 3 columns mobile, 4 columns tablet, 6 columns desktop (wider space)
  const gridClassName = layout === 'page'
    ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4'
    : 'grid grid-cols-3 gap-2 sm:gap-3';

  return (
    <div className={gridClassName}>
      {displayItems.map((item) => {
        const customImageUrl = 'metafields' in item ? getMetafieldValue(
          item.metafields,
          'mobile_menu_image'
        ) : null;
        
        const rawImageUrl = customImageUrl || item.image?.url;
        const imageUrl = getOptimizedImageUrl(rawImageUrl);

        return (
          <Link
            key={item.id}
            to={`/collections/${item.handle}`}
            onClick={onClose}
            className="flex flex-col items-center text-center group"
          >
            <div 
              className={`w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden mb-2 group-hover:shadow-md transition-shadow ${
                layout === 'page' ? 'group-hover:scale-[1.02] transition-transform' : ''
              }`}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="text-gray-400 text-xs font-semibold">
                  {item.title}
                </div>
              )}
            </div>
            <span className={`text-gray-900 group-hover:text-blue-600 transition-colors ${
              layout === 'page' ? 'text-xs sm:text-sm font-medium' : 'text-xs font-medium'
            }`}>
              {item.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}