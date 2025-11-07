// app/routes/($locale).wishlist.shared.tsx
// ✅ FIXED: 500 error + Swedish translation

import { type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import { useLoaderData, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { WishlistSharing } from '~/lib/wishlist-sharing';
import { WishlistStorage } from '~/lib/wishlist-storage';

export const meta: MetaFunction = () => [
  { title: 'Delad Önskelista | Klosslabbet' },
  { name: 'description', content: 'Kolla in denna delade önskelista!' }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const encodedData = url.searchParams.get('data');
  
  // Return simple Response instead of json() to avoid import issues
  return new Response(JSON.stringify({ encodedData }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export default function SharedWishlistPage() {
  const data = useLoaderData<{ encodedData: string | null }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (data.encodedData) {
      // Load shared wishlist data
      const sharedItems = WishlistSharing.loadFromShareUrl(data.encodedData);
      
      if (sharedItems) {
        // Merge with existing wishlist
        const existingItems = WishlistStorage.getWishlist();
        const mergedItems = [...sharedItems, ...existingItems];
        
        // Remove duplicates
        const uniqueItems = mergedItems.filter((item, index, arr) => 
          arr.findIndex(i => i.id === item.id && i.variantId === item.variantId) === index
        );
        
        WishlistStorage.saveWishlist(uniqueItems);
        
        // Redirect to regular wishlist page
        navigate('/wishlist');
      } else {
        // Invalid shared data, redirect to empty wishlist
        navigate('/wishlist');
      }
    } else {
      navigate('/wishlist');
    }
  }, [data.encodedData, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Laddar delad önskelista...</p>
      </div>
    </div>
  );
}