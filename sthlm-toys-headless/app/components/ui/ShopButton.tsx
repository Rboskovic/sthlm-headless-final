// FILE: app/components/ui/ShopButton.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Reusable button component with consistent styling

import {forwardRef} from 'react';
import {Link} from 'react-router';
import type {LinkProps} from 'react-router';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '~/lib/utils';

// Button variant styles using class-variance-authority for type safety
const buttonVariants = cva(
  // Base styles - applied to all buttons
  `inline-flex items-center justify-center font-medium transition-all duration-200 
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
   disabled:pointer-events-none disabled:opacity-50 active:scale-95`,
  {
    variants: {
      variant: {
        primary: `bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600
                  shadow-sm hover:shadow-md`,
        secondary: `bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500
                    border border-gray-200`,
        outline: `border-2 border-gray-300 bg-transparent text-gray-700 
                  hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500`,
        ghost: `bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900
                focus-visible:ring-gray-500`,
        danger: `bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600
                 shadow-sm hover:shadow-md`,
        success: `bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600
                  shadow-sm hover:shadow-md`,
        link: `text-blue-600 underline-offset-4 hover:underline hover:text-blue-700
               focus-visible:ring-blue-600 p-0 h-auto`,
      },
      size: {
        xs: 'h-7 px-2 text-xs rounded-md gap-1',
        sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
        md: 'h-11 px-5 text-base rounded-lg gap-2',
        lg: 'h-12 px-7 text-lg rounded-xl gap-2.5',
        xl: 'h-14 px-9 text-xl rounded-xl gap-3',
        icon: 'h-10 w-10 rounded-lg', // Square icon button
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      loading: {
        true: 'cursor-wait',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      loading: false,
    },
  }
);

// TypeScript interfaces
export interface ShopButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface ShopLinkButtonProps
  extends Omit<LinkProps, 'className'>,
    VariantProps<typeof buttonVariants> {
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * ShopButton Component
 * 
 * @example
 * // Primary button
 * <ShopButton variant="primary" size="lg">
 *   Add to Cart
 * </ShopButton>
 * 
 * // Button with icon
 * <ShopButton leftIcon={<ShoppingCart />}>
 *   Shop Now
 * </ShopButton>
 * 
 * // Loading state
 * <ShopButton loading={true}>
 *   Processing...
 * </ShopButton>
 * 
 * // As a link
 * <ShopLinkButton to="/collections/all" variant="outline">
 *   View All Products
 * </ShopLinkButton>
 */
export const ShopButton = forwardRef<HTMLButtonElement, ShopButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        {...props}
      >
        {loading ? (
          <>
            <LoadingIcon className="animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

ShopButton.displayName = 'ShopButton';

/**
 * ShopLinkButton Component
 * Button styled component that renders as a React Router Link
 */
export const ShopLinkButton = forwardRef<HTMLAnchorElement, ShopLinkButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Link
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </Link>
    );
  }
);

ShopLinkButton.displayName = 'ShopLinkButton';

// Loading Icon Component
function LoadingIcon({className}: {className?: string}) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Export types for TypeScript
export type {ShopButtonProps, ShopLinkButtonProps};