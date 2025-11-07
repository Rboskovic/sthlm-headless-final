// FILE: app/components/ui/SectionHeading.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Reusable section heading component

import { cn } from '~/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * SectionHeading Component
 * Consistent section headings across all pages
 * 
 * @example
 * // Basic heading
 * <SectionHeading 
 *   title="Featured Products" 
 *   subtitle="Discover our favorites"
 * />
 * 
 * // Large centered heading
 * <SectionHeading 
 *   title="Sale Products"
 *   subtitle="Limited time offers"
 *   size="large"
 *   alignment="center"
 * />
 * 
 * // Custom heading level
 * <SectionHeading 
 *   title="Shop By Brand"
 *   as="h3"
 *   size="small"
 * />
 */
export function SectionHeading({
  title,
  subtitle,
  alignment = 'left',
  size = 'medium',
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  as = 'h2',
}: SectionHeadingProps) {
  
  // Dynamic styles based on props
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const sizeClasses = {
    small: {
      title: 'text-xl lg:text-2xl',
      subtitle: 'text-sm',
      spacing: 'mb-2',
    },
    medium: {
      title: 'text-2xl lg:text-3xl',
      subtitle: 'text-base',
      spacing: 'mb-3',
    },
    large: {
      title: 'text-3xl lg:text-4xl xl:text-5xl',
      subtitle: 'text-lg lg:text-xl',
      spacing: 'mb-4',
    },
  };

  const HeadingTag = as;
  const styles = sizeClasses[size];

  return (
    <div className={cn(alignmentClasses[alignment], className)}>
      {/* Main Title */}
      <HeadingTag 
        className={cn(
          'font-bold text-gray-900 tracking-tight leading-tight',
          styles.title,
          styles.spacing,
          titleClassName
        )}
      >
        {title}
      </HeadingTag>

      {/* Subtitle */}
      {subtitle && (
        <p 
          className={cn(
            'text-gray-600 leading-relaxed max-w-3xl',
            styles.subtitle,
            alignment === 'center' && 'mx-auto',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * SectionHeadingSkeleton Component
 * Loading state for section headings
 */
export function SectionHeadingSkeleton({
  size = 'medium',
  alignment = 'left',
  showSubtitle = true,
}: {
  size?: 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
  showSubtitle?: boolean;
}) {
  const sizeClasses = {
    small: { title: 'h-6', subtitle: 'h-4', width: 'w-48' },
    medium: { title: 'h-8', subtitle: 'h-5', width: 'w-64' },
    large: { title: 'h-10', subtitle: 'h-6', width: 'w-80' },
  };

  const alignmentClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  };

  const styles = sizeClasses[size];

  return (
    <div className={cn('flex flex-col', alignmentClasses[alignment])}>
      {/* Title skeleton */}
      <div 
        className={cn(
          'bg-gray-200 rounded mb-3',
          styles.title,
          styles.width
        )}
      />
      
      {/* Subtitle skeleton */}
      {showSubtitle && (
        <div 
          className={cn(
            'bg-gray-200 rounded',
            styles.subtitle,
            'w-3/4'
          )}
        />
      )}
    </div>
  );
}

export type { SectionHeadingProps };