// FILE: app/components/ui/ShopButton.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: FIXED - asChild prop support

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
        addToCart: `bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600
                    shadow-sm hover:shadow-md font-semibold tracking-wide`,
        cta: `bg-yellow-500 text-black hover:bg-yellow-600 focus-visible:ring-yellow-500
              shadow-sm hover:shadow-md font-bold tracking-wide border-2 border-transparent
              hover:border-yellow-700`,
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
 * ✅ FIXED: Properly handles asChild prop
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
      asChild = false,
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(buttonVariants({ variant, size, fullWidth, loading, className }));
    
    // ✅ FIXED: Handle asChild prop properly
    if (asChild) {
      // When asChild is true, render children directly with button styles
      // This allows for <a> tags or other elements to inherit button styling
      const childElement = children as React.ReactElement;
      if (React.isValidElement(childElement)) {
        return React.cloneElement(childElement, {
          className: cn(buttonClasses, childElement.props.className),
          ...props,
        });
      }
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClasses}
        {...props}
      >
        {loading ? (
          <>
            <LoadingIcon className="animate-spin mr-2" />
            <span>Belastning....</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0 mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0 ml-2">{rightIcon}</span>}
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
        {leftIcon && <span className="inline-flex shrink-0 mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex shrink-0 ml-2">{rightIcon}</span>}
      </Link>
    );
  }
);

ShopLinkButton.displayName = 'ShopLinkButton';

// Loading Icon Component
function LoadingIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ✅ FIXED: Add React import for cloneElement
import React from 'react';

// Export utility function for combining class names
export {cn};