import {ShopButton} from '~/components/ui/ShopButton';
// FILE: app/components/AddToCartButton.tsx
// ✅ SHOPIFY STANDARD: Updated to use ShopButton consistently

import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {type FetcherWithComponents} from 'react-router';
import {ShopButton} from '~/components/ui/ShopButton';

export function AddToCartButton({
  children,
  lines,
  onClick,
  disabled = false,
  className = '',
  analytics,
  variant = 'addToCart',
  size = 'lg',
  ...props
}: {
  children: React.ReactNode;
  lines: OptimisticCartLineInput[];
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  analytics?: unknown;
  variant?: 'primary' | 'secondary' | 'addToCart' | 'cta';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  [key: string]: any;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isSubmitting = fetcher.state === 'submitting';

        return (
          <>
            {analytics && (
              <input
                name="analytics"
                type="hidden"
                value={JSON.stringify(analytics)}
              />
            )}
            
            {/* ✅ FIXED: Using ShopButton instead of custom button */}
            <ShopButton
              type="submit"
              onClick={onClick}
              disabled={disabled || isSubmitting}
              loading={isSubmitting}
              variant={disabled ? 'secondary' : variant}
              size={size}
              fullWidth
              className={className}
              {...props}
            >
              {/* ✅ ENSURES: White text is handled by ShopButton variants */}
              {children}
            </ShopButton>
          </>
        );
      }}
    </CartForm>
  );
}