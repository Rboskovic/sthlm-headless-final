// FILE: app/components/ui/PriceDisplay.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Consistent price formatting component

import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {cn} from '~/lib/utils';

interface PriceDisplayProps {
  price: MoneyV2 | undefined | null;
  compareAtPrice?: MoneyV2 | undefined | null;
  className?: string;
  showCurrencyCode?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right';
  showDiscountBadge?: boolean;
  variant?: 'default' | 'inline' | 'stacked';
}

/**
 * PriceDisplay Component
 * Standardized price display with sale price support
 * 
 * @example
 * // Simple price
 * <PriceDisplay price={product.price} />
 * 
 * // With compare at price (sale)
 * <PriceDisplay 
 *   price={product.price} 
 *   compareAtPrice={product.compareAtPrice}
 *   showDiscountBadge
 * />
 * 
 * // Large centered price
 * <PriceDisplay 
 *   price={product.price} 
 *   size="lg"
 *   align="center"
 * />
 */
export function PriceDisplay({
  price,
  compareAtPrice,
  className,
  showCurrencyCode = false,
  size = 'md',
  align = 'left',
  showDiscountBadge = false,
  variant = 'default',
}: PriceDisplayProps) {
  if (!price) return null;

  const hasDiscount = compareAtPrice && 
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
          parseFloat(compareAtPrice.amount)) *
          100
      )
    : 0;

  // Size classes for different text sizes
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const priceSizeClasses = {
    xs: 'text-sm font-medium',
    sm: 'text-base font-medium',
    md: 'text-lg font-semibold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold',
  };

  const compareAtSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const containerClasses = cn(
    'price-display',
    alignClasses[align],
    variant === 'inline' && 'inline-flex items-baseline gap-2',
    variant === 'stacked' && 'flex flex-col gap-1',
    className
  );

  return (
    <div className={containerClasses}>
      {/* Current Price */}
      <div className={cn(
        'price-current inline-flex items-baseline',
        hasDiscount ? 'text-red-600' : 'text-gray-900'
      )}>
        <span className={priceSizeClasses[size]}>
          <Money
            data={price}
            as="span"
            withoutCurrency={!showCurrencyCode}
            withoutTrailingZeros
          />
        </span>
        {showCurrencyCode && (
          <span className={cn(sizeClasses[size], 'ml-1 text-gray-600')}>
            {price.currencyCode}
          </span>
        )}
      </div>

      {/* Compare At Price */}
      {hasDiscount && compareAtPrice && (
        <div className={cn(
          'price-compare inline-flex items-baseline',
          variant === 'inline' ? 'ml-2' : ''
        )}>
          <span className={cn(
            compareAtSizeClasses[size],
            'text-gray-500 line-through'
          )}>
            <Money
              data={compareAtPrice}
              as="span"
              withoutCurrency={!showCurrencyCode}
              withoutTrailingZeros
            />
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && showDiscountBadge && discountPercentage > 0 && (
        <span className={cn(
          'discount-badge inline-flex items-center justify-center',
          'bg-red-100 text-red-700 font-semibold rounded-full',
          variant === 'inline' ? 'ml-2' : 'mt-1',
          size === 'xs' && 'px-1.5 py-0.5 text-xs',
          size === 'sm' && 'px-2 py-0.5 text-xs',
          size === 'md' && 'px-2 py-1 text-sm',
          size === 'lg' && 'px-3 py-1 text-base',
          size === 'xl' && 'px-3 py-1.5 text-lg',
        )}>
          -{discountPercentage}%
        </span>
      )}
    </div>
  );
}

/**
 * PriceRange Component
 * For displaying price ranges (e.g., "From $X")
 */
export function PriceRange({
  priceRange,
  className,
  size = 'md',
}: {
  priceRange?: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  } | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (!priceRange) return null;

  const {minVariantPrice, maxVariantPrice} = priceRange;
  const hasRange = parseFloat(minVariantPrice.amount) !== parseFloat(maxVariantPrice.amount);

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={cn('price-range', sizeClasses[size], className)}>
      {hasRange ? (
        <>
          <span className="text-gray-600">From </span>
          <Money
            data={minVariantPrice}
            as="span"
            className="font-semibold text-gray-900"
            withoutTrailingZeros
          />
        </>
      ) : (
        <Money
          data={minVariantPrice}
          as="span"
          className="font-semibold text-gray-900"
          withoutTrailingZeros
        />
      )}
    </div>
  );
}

// Export types for TypeScript
export type {PriceDisplayProps};