// FILE: app/components/AddToCartButton.tsx
// ✅ INVENTORY VALIDATION: Prevents adding more than available quantity

import React, {useState} from 'react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {type FetcherWithComponents} from 'react-router';
import {ShopButton} from '~/components/ui/ShopButton';
import {AlertCircle} from 'lucide-react';

export function AddToCartButton({
  children,
  lines,
  onClick,
  disabled = false,
  className = '',
  analytics,
  variant = 'addToCart',
  size = 'lg',
  quantityAvailable,
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
  quantityAvailable?: number | null;
  [key: string]: any;
}) {
  const [showInventoryError, setShowInventoryError] = useState(false);
  
  // ✅ Calculate total quantity being added
  const totalQuantity = lines.reduce((sum, line) => sum + (line.quantity || 0), 0);
  
  // ✅ Check if quantity exceeds available inventory
  const exceedsInventory = quantityAvailable !== null && 
                           quantityAvailable !== undefined && 
                           totalQuantity > quantityAvailable;

  const handleClick = (e: React.MouseEvent) => {
    // ✅ Prevent submission if exceeds inventory
    if (exceedsInventory) {
      e.preventDefault();
      setShowInventoryError(true);
      setTimeout(() => setShowInventoryError(false), 4000);
      return;
    }

    // Call custom onClick if provided
    onClick?.();
  };

  return (
    <div className="w-full">
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
              
              <ShopButton
                type="submit"
                onClick={handleClick}
                disabled={disabled || isSubmitting || exceedsInventory}
                loading={isSubmitting}
                variant={disabled || exceedsInventory ? 'secondary' : variant}
                size={size}
                fullWidth
                className={className}
                {...props}
              >
                {children}
              </ShopButton>
            </>
          );
        }}
      </CartForm>

      {/* ✅ Swedish inventory error message */}
      {showInventoryError && quantityAvailable !== null && quantityAvailable !== undefined && (
        <div className="mt-3 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            Endast {quantityAvailable} {quantityAvailable === 1 ? 'st' : 'st'} tillgänglig{quantityAvailable === 1 ? '' : 'a'} i lager
          </p>
        </div>
      )}
    </div>
  );
}