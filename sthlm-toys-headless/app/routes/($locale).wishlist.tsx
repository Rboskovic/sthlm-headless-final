// app/routes/($locale).wishlist.tsx
// ✅ UPDATED: Use ProductItem + Swedish translations + Better UX

import { type MetaFunction } from '@shopify/remix-oxygen';
import { useSessionWishlist } from '~/hooks/useSessionWishlist';
import { ProductItem } from '~/components/ProductItem';
import { WishlistHeader } from '~/components/WishlistHeader';
import { WishlistEmpty } from '~/components/WishlistEmpty';

export const meta: MetaFunction = () => [
  { title: 'Min Önskelista | STHLM Toys & Games' },
  { name: 'description', content: 'Dina sparade favoritprodukter' }
];

export default function WishlistPage() {
  const {
    wishlistItems,
    isLoading,
    wishlistCount,
    clearWishlist,
    createShareableLink,
    shareWishlist,
    copyShareLink
  } = useSessionWishlist();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wishlistCount === 0) {
    return <WishlistEmpty />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <WishlistHeader 
        count={wishlistCount}
        onClear={clearWishlist}
        onShare={shareWishlist}
        onCopyLink={copyShareLink}
        createShareableLink={createShareableLink}
      />
      
      {/* ✅ Use ProductItem instead of custom grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item, index) => (
          <ProductItem
            key={`${item.id}-${item.variantId || 'default'}-${index}`}
            product={item}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}