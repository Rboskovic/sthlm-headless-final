// FILE: app/routes/($locale).cart.tsx
// ✅ MINIMAL FIX: Only added collections loading, everything else preserved

import {type MetaFunction, useLoaderData} from 'react-router';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {
  data,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  type HeadersFunction,
} from '@shopify/remix-oxygen';
import {CartMain} from '~/components/CartMain';
import {ShopLinkButton} from '~/components/ui/ShopButton';
import {ArrowLeft} from 'lucide-react';
import {MOBILE_MENU_COLLECTIONS_QUERY} from '~/lib/fragments';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

export const meta: MetaFunction = () => {
  return [{title: `Kundvagn | Klosslabbet`}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      // User inputted gift card code
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      // Combine gift card codes already applied on cart
      giftCardCodes.push(...inputs.giftCardCodes);

      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

// ✅ ONLY CHANGE: Added collections loading
export async function loader({context}: LoaderFunctionArgs) {
  const {cart, storefront} = context;
  
  // Load both cart and collections in parallel
  const [cartData, collectionsData] = await Promise.all([
    cart.get(),
    storefront.query(MOBILE_MENU_COLLECTIONS_QUERY, {
      cache: storefront.CacheLong(),
    }),
  ]);

  return {
    cart: cartData,
    popularCollections: (collectionsData?.collections?.nodes || []) as Collection[],
  };
}

export default function Cart() {
  const {cart, popularCollections} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kundvagn</h1>
              <p className="text-gray-600 mt-1">
                Granska dina varor och gå till kassan
              </p>
            </div>
            
            <ShopLinkButton
              to="/collections"
              variant="outline"
              leftIcon={<ArrowLeft size={20} />}
            >
              Fortsätt handla
            </ShopLinkButton>
          </div>
        </div>
      </div>

      {/* Cart Content - ✅ ONLY CHANGE: Pass popularCollections */}
      <div className="py-8">
        <CartMain layout="page" cart={cart} popularCollections={popularCollections} />
      </div>

      {/* Trust Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Säker betalning</h3>
              <p className="text-gray-600 text-sm">
                Alla betalningar är krypterade och säkra
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293L10.414 7.5A1 1 0 0011.121 8H13m6 0a2 2 0 110 4M5 8a2 2 0 000 4m0 0v8a2 2 0 002 2h10a2 2 0 002-2v-8m0 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Fri frakt till ombud över 799 kr</h3>
              <p className="text-gray-600 text-sm">
                Beställningar över 799 kr får fri frakt till ombud. Hemleverans kostar 139 kr.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">14 dagars ångerrätt</h3>
              <p className="text-gray-600 text-sm">
                Du har alltid 14 dagars ångerrätt enligt distansavtalslagen när du handlar online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}