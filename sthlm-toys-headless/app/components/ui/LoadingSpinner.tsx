// FILE: app/components/ui/LoadingSpinner.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Consistent loading states

import {cn} from '~/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'current';
  className?: string;
  fullScreen?: boolean;
  text?: string;
  overlay?: boolean;
}

/**
 * LoadingSpinner Component
 * Consistent loading indicator across the application
 * 
 * @example
 * // Simple spinner
 * <LoadingSpinner />
 * 
 * // Full screen loading
 * <LoadingSpinner fullScreen text="Loading products..." />
 * 
 * // Small inline spinner
 * <LoadingSpinner size="sm" />
 * 
 * // Overlay spinner for async sections
 * <LoadingSpinner overlay />
 */
export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className,
  fullScreen = false,
  text,
  overlay = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  const colorClasses = {
    primary: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
    current: 'border-current border-t-transparent',
  };

  const spinnerElement = (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label={text || 'Loading'}
    >
      <span className="sr-only">{text || 'Belastning...'}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        {spinnerElement}
        {text && (
          <p className="mt-4 text-sm font-medium text-gray-600">{text}</p>
        )}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinnerElement}
        {text && (
          <p className="mt-4 text-sm font-medium text-gray-600">{text}</p>
        )}
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center">
        {spinnerElement}
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      </div>
    );
  }

  return spinnerElement;
}

/**
 * LoadingDots Component
 * Alternative loading indicator with animated dots
 */
export function LoadingDots({
  size = 'md',
  color = 'primary',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'space-x-1',
    md: 'space-x-1.5',
    lg: 'space-x-2',
  };

  const dotSizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
  };

  return (
    <div className={cn('flex items-center', sizeClasses[size], className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse rounded-full',
            dotSizeClasses[size],
            colorClasses[color]
          )}
          style={{
            animationDelay: `${index * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonLoader Component
 * For loading placeholders
 */
export function SkeletonLoader({
  className,
  variant = 'rectangular',
}: {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}) {
  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variantClasses[variant],
        className
      )}
    />
  );
}

/**
 * ProductCardSkeleton Component
 * Loading placeholder for product cards
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <SkeletonLoader className="h-64 w-full" variant="rectangular" />
      <SkeletonLoader className="h-4 w-3/4" variant="text" />
      <SkeletonLoader className="h-4 w-1/2" variant="text" />
      <div className="flex items-center space-x-2">
        <SkeletonLoader className="h-5 w-20" variant="text" />
        <SkeletonLoader className="h-5 w-16" variant="text" />
      </div>
    </div>
  );
}

/**
 * CollectionGridSkeleton Component
 * Loading placeholder for collection grids
 */
export function CollectionGridSkeleton({
  count = 8,
  columns = 4,
}: {
  count?: number;
  columns?: 2 | 3 | 4;
}) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridClasses[columns])}>
      {Array.from({length: count}).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Export types for TypeScript
export type {LoadingSpinnerProps};