// FILE: app/components/ui/SectionHeading.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Consistent section headings

import {Link} from 'react-router';
import {cn} from '~/lib/utils';
import {ChevronRight} from 'lucide-react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  separator?: boolean;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * SectionHeading Component
 * Consistent section headers throughout the store
 * 
 * @example
 * // Simple heading
 * <SectionHeading title="Popular Categories" />
 * 
 * // With subtitle and action
 * <SectionHeading 
 *   title="Best Sellers"
 *   subtitle="Our most popular toys this month"
 *   action={{ label: "View All", href: "/collections/best-sellers" }}
 * />
 * 
 * // Centered large heading
 * <SectionHeading 
 *   title="Featured Products"
 *   align="center"
 *   size="lg"
 *   separator
 * />
 */
export function SectionHeading({
  title,
  subtitle,
  action,
  align = 'left',
  size = 'md',
  className,
  separator = false,
  spacing = 'md',
}: SectionHeadingProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const sizeClasses = {
    sm: {
      title: 'text-xl md:text-2xl font-semibold',
      subtitle: 'text-sm text-gray-600 mt-1',
    },
    md: {
      title: 'text-2xl md:text-3xl font-semibold',
      subtitle: 'text-base text-gray-600 mt-2',
    },
    lg: {
      title: 'text-3xl md:text-4xl font-bold',
      subtitle: 'text-lg text-gray-600 mt-2',
    },
    xl: {
      title: 'text-4xl md:text-5xl font-bold',
      subtitle: 'text-xl text-gray-600 mt-3',
    },
  };

  const spacingClasses = {
    none: '',
    sm: 'mb-4',
    md: 'mb-6 md:mb-8',
    lg: 'mb-8 md:mb-12',
  };

  const hasAction = action && align !== 'center';

  return (
    <div className={cn(spacingClasses[spacing], className)}>
      <div
        className={cn(
          'section-heading',
          hasAction && 'flex items-end justify-between',
          !hasAction && alignClasses[align]
        )}
      >
        <div className={hasAction ? '' : alignClasses[align]}>
          <h2
            className={cn(
              'text-gray-900',
              sizeClasses[size].title,
              'font-family-primary' // Will use our CSS variable
            )}
            style={{
              fontFamily: 'var(--font-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                sizeClasses[size].subtitle,
                'font-family-primary'
              )}
              style={{
                fontFamily: 'var(--font-primary)',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {hasAction && (
          <Link
            to={action.href}
            className={cn(
              'inline-flex items-center gap-1',
              'text-blue-600 hover:text-blue-700',
              'font-medium transition-colors',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-base',
              size === 'lg' && 'text-lg',
              size === 'xl' && 'text-xl'
            )}
          >
            {action.label}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Centered action link */}
      {action && align === 'center' && (
        <div className="mt-4 text-center">
          <Link
            to={action.href}
            className={cn(
              'inline-flex items-center gap-1',
              'text-blue-600 hover:text-blue-700',
              'font-medium transition-colors',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-base',
              size === 'lg' && 'text-lg',
              size === 'xl' && 'text-xl'
            )}
          >
            {action.label}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {separator && (
        <div className="mt-4 border-b border-gray-200" />
      )}
    </div>
  );
}

/**
 * PageHeader Component
 * For main page headers with breadcrumbs
 */
export function PageHeader({
  title,
  breadcrumbs,
  children,
  className,
}: {
  title: string;
  breadcrumbs?: Array<{label: string; href?: string}>;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('page-header border-b bg-gray-50', className)}>
      <div className="container py-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                  )}
                  {crumb.href ? (
                    <Link
                      to={crumb.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-bold text-gray-900"
          style={{
            fontFamily: 'var(--font-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>

        {/* Additional content (filters, sorting, etc.) */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}

// Export types for TypeScript
export type {SectionHeadingProps};