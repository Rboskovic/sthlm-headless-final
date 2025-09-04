// app/components/WishlistEmpty.tsx
// ✅ UPDATED: Swedish translation + Better UX + Cart-style popular section

import { Link } from 'react-router';
import { Heart, ShoppingBag } from 'lucide-react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface WishlistEmptyProps {
  popularCollections?: Collection[];
}

export function WishlistEmpty({ popularCollections = [] }: WishlistEmptyProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="mb-8">
        {/* Empty State Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-gray-100 rounded-full flex items-center justify-center">
            <Heart size={40} className="text-gray-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
            <ShoppingBag size={20} className="text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Din önskelista är tom
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Spara produkter du älskar för senare och missa aldrig vad du vill ha!
        </p>
        
        {/* ✅ UPDATED: Single CTA with padding and themes link */}
        <div className="pt-4">
          <Link 
            to="/themes"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg transition-colors"
            style={{ color: 'white' }} // Force white text
          >
            <ShoppingBag size={20} className="mr-2" style={{ color: 'white' }} />
            <span style={{ color: 'white' }}>Börja Handla</span>
          </Link>
        </div>
      </div>
      
      {/* ✅ UPDATED: Popular Section using inline grid styles since CSS classes may not be available */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="mb-4">
          <h4 className="text-base font-medium text-gray-900 text-center">Populära just nu</h4>
        </div>
        
        <PopularCategoriesGrid collections={popularCollections} />
      </div>
    </div>
  );
}

/**
 * Popular Categories Grid Component (Same as Cart - Using CSS classes)
 */
function PopularCategoriesGrid({
  collections = [],
}: {
  collections?: Collection[];
}) {
  // Helper functions from mobile menu
  const getMetafieldValue = (
    metafields: Array<{key: string; value: string; namespace: string} | null> | null | undefined,
    key: string
  ): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;
    const metafield = metafields.find((field) => field && field.key === key);
    return metafield && metafield.value ? metafield.value : null;
  };

  const isTrueValue = (value: string | null): boolean => {
    if (!value) return false;
    const normalizedValue = value.toLowerCase().trim();
    return (
      normalizedValue === 'true' ||
      normalizedValue === 'True' ||
      normalizedValue === '1' ||
      normalizedValue === 'yes'
    );
  };

  // Get featured collections from metafields
  const featuredCollections =
    collections
      ?.filter((collection) => {
        const featuredValue = getMetafieldValue(
          collection.metafields,
          'mobile_menu_featured',
        );
        return isTrueValue(featuredValue);
      })
      ?.slice(0, 9) || [];

  // Fallback items (should only show if no real collections found)
  const fallbackItems = [
    {id: 'deals', title: 'Erbjudanden', image: null, handle: 'deals'},
    {id: 'new', title: 'Nytt & Populärt', image: null, handle: 'new'},
    {id: 'all-toys', title: 'Alla Leksaker', image: null, handle: 'all-toys'},
    {id: 'lego', title: 'LEGO', image: null, handle: 'lego'},
    {id: 'minecraft', title: 'Minecraft', image: null, handle: 'minecraft'},
    {id: 'sonic', title: 'Sonic', image: null, handle: 'sonic'},
    {id: 'spiderman', title: 'Spiderman', image: null, handle: 'spiderman'},
    {id: 'disney', title: 'Disney', image: null, handle: 'disney'},
    {id: 'outdoor', title: 'Utomhus', image: null, handle: 'outdoor'},
  ];

  const displayItems =
    featuredCollections.length > 0 ? featuredCollections : fallbackItems;

  return (
    <div className="mobile-menu-popular-grid">
      {displayItems.map((item) => {
        const customImageUrl = 'metafields' in item ? getMetafieldValue(
          item.metafields,
          'mobile_menu_image'
        ) : null;
        
        const imageUrl = customImageUrl || item.image?.url;

        return (
          <Link
            key={item.id}
            to={`/collections/${item.handle}`}
            className="mobile-menu-popular-item"
          >
            <div
              className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden mb-2"
              style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: imageUrl ? 'transparent' : '#f3f4f6',
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 font-medium text-xs text-center px-1 leading-tight">
                  {item.title}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-gray-900 leading-tight text-center block">
              {item.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}