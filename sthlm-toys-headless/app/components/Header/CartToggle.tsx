import {Suspense} from 'react';
import {ShoppingCart} from 'lucide-react';
import {Await, useAsyncValue} from 'react-router';
import {useAside} from '~/components/Aside';
import {useOptimisticCart} from '@shopify/hydrogen'; // ← Fixed import
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartToggleProps} from './types';

export function CartToggle({cart}: CartToggleProps) {
  return (
    <Suspense fallback={<CartFallback />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartFallback() {
  return (
    <button 
      className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
      aria-label="Öppna kundvagn"
      <ShoppingCart size={24} />
      <span className="hidden lg:inline text-sm font-medium">Kundvagn</span>
    </button>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const {open} = useAside();

  return (
    <button
      onClick={() => open('cart')}
      className="flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors relative"
    >
      <ShoppingCart size={24} />
      <span className="hidden lg:inline text-sm font-medium">Kundvagn</span>
      {cart?.totalQuantity && cart.totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cart.totalQuantity}
        </span>
      )}
    </button>
  );
}
  