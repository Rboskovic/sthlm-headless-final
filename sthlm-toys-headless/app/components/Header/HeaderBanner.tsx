// app/components/Header/HeaderBanner.tsx - Updated with metafield support
import {Truck} from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  metafields?: Array<{
    key: string;
    value: string;
    namespace: string;
  } | null> | null;
}

interface HeaderBannerProps {
  shop?: Shop;
}

// Helper function to extract metafield values (same pattern as your other components)
function getMetafieldValue(
  metafields: Array<{key: string; value: string; namespace: string} | null> | null | undefined,
  key: string,
  namespace: string = 'custom'
): string | null {
  if (!metafields || !Array.isArray(metafields)) return null;
  const metafield = metafields.find((m) => m?.key === key && m?.namespace === namespace);
  return metafield?.value || null;
}

export function HeaderBanner({shop}: HeaderBannerProps) {
  // Get the banner text from metafield with fallback to current hardcoded text
  const bannerText = getMetafieldValue(shop?.metafields, 'free_shipping_banner') || 
    'Fri frakt till ombud över 1299 kr';

  return (
    <div className="w-full bg-gray-100 text-black border-b border-gray-200">
      <div className="mx-auto flex justify-center text-sm font-medium max-w-[1272px] px-3 py-2">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-blue-600" />
          <span>{bannerText}</span>
        </div>
      </div>
    </div>
  );
}