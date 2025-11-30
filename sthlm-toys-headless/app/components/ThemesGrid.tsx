// FILE: app/components/ThemesGrid.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Reusable ThemesGrid component for LEGO® themes

import {Link} from 'react-router';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface ThemesGridProps {
  collections: Collection[];
  onItemClick?: () => void; // Optional callback for link clicks (useful for modals/aside)
}

/**
 * ThemesGrid Component
 * 
 * Displays LEGO® theme collections in a responsive grid layout.
 * Collections come pre-filtered from metaobject - no filtering needed here.
 * 
 * Features:
 * - Responsive grid: 2 per row (small mobile) → 3 per row (mobile) → 4 per row (desktop)
 * - Uses theme_image metafield for custom images
 * - Shows all collections from metaobject
 * - Hover effects and smooth transitions
 * 
 * @param collections - Array of collections from Shopify (already filtered by metaobject)
 * @param onItemClick - Optional callback when theme item is clicked
 */
export function ThemesGrid({
  collections,
  onItemClick,
}: ThemesGridProps) {
  
  // Show message if no themes found
  if (collections.length === 0) {
    return (
      <div className="themes-grid-empty">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl font-bold mb-4">LEGO®</div>
          <p className="text-gray-600 text-lg">
            No LEGO® themes available at the moment.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Check back soon for exciting new collections!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="themes-grid">
      {/* Responsive Grid Layout
          Requirements met:
          - Desktop: 4 per row (lg:grid-cols-4) ✅
          - Mobile: 3 per row (sm:grid-cols-3) ✅
          - Small mobile: 2 per row (grid-cols-2) ✅
          - Tablet: Adjusts naturally between mobile and desktop ✅
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {collections.map((collection) => (
          <ThemeCard
            key={collection.id}
            collection={collection}
            onItemClick={onItemClick}
          />
        ))}
      </div>

      {/* Collection Count Info (for debugging/admin purposes - remove if not needed) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 text-center text-xs text-gray-400">
          Showing {collections.length} LEGO® themes
        </div>
      )}
    </div>
  );
}

/**
 * ThemeCard Component
 * 
 * Individual theme card with image, title, and hover effects.
 * Matches the layout shown in the provided screenshots.
 */
function ThemeCard({
  collection,
  onItemClick,
}: {
  collection: Collection;
  onItemClick?: () => void;
}) {
  
  // Helper function to get metafield value
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string} | null> | null | undefined,
    key: string
  ): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;
    const metafield = metafields.find((field) => field && field.key === key);
    return metafield && metafield.value ? metafield.value : null;
  };

  // Get theme_image metafield
  const customImageUrl = getMetafieldValue(
    collection.metafields,
    'theme_image'
  );
  
  // Fallback to collection image if no theme_image
  const imageUrl = customImageUrl || collection.image?.url;

  return (
    <Link
      to={`/collections/${collection.handle}`}
      onClick={onItemClick}
      className="theme-card group block"
    >
      <div className="flex flex-col items-center text-center">
        
        {/* Theme Image Container */}
        <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3 group-hover:shadow-lg transition-all duration-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={collection.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
              decoding="async"
            />
          ) : (
            // Fallback design when no image available
            <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-gray-400 text-2xl sm:text-3xl lg:text-4xl font-bold">
                LEGO®
              </div>
            </div>
          )}
        </div>

        {/* Theme Title */}
        <h3 className="text-sm lg:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight px-1">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
}

/**
 * ThemesGridSkeleton Component
 * 
 * Loading state for the themes grid - shows skeleton cards
 * while data is being fetched.
 */
export function ThemesGridSkeleton({count = 8}: {count?: number}) {
  return (
    <div className="themes-grid-skeleton">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({length: count}).map((_, index) => (
          <div key={index} className="theme-card-skeleton">
            <div className="flex flex-col items-center text-center">
              {/* Image Skeleton */}
              <div className="w-full aspect-square bg-gray-200 rounded-xl mb-3 animate-pulse" />
              
              {/* Title Skeleton */}
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 max-w-[120px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}