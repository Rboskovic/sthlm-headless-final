// app/components/Header/HeaderBanner.tsx - Updated with metaobject rotation support
import {useState, useEffect} from 'react';
import {Truck} from 'lucide-react';

interface HeaderBannerMetaobject {
  id: string;
  handle: string;
  fields: Array<{
    key: string;
    value: string;
  }>;
}

interface HeaderBannerProps {
  banners?: HeaderBannerMetaobject[];
}

// Helper to extract field value from metaobject
function getFieldValue(
  fields: Array<{key: string; value: string}>,
  key: string
): string | null {
  const field = fields.find((f) => f.key === key);
  return field?.value || null;
}

export function HeaderBanner({banners = []}: HeaderBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter for text content (exclude empty texts)
  const bannerTexts = banners
    .map((banner) => getFieldValue(banner.fields, 'text'))
    .filter((text): text is string => text !== null && text.trim() !== '');

  // Fallback if no banners
  const displayText = bannerTexts.length > 0 
    ? bannerTexts[currentIndex] 
    : 'Fri frakt till ombud över 799 kr';

  // Auto-rotate every 5 seconds if multiple banners
  useEffect(() => {
    if (bannerTexts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerTexts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerTexts.length]);

  return (
    <div className="w-full bg-gray-100 text-black border-b border-gray-200">
      <div className="mx-auto flex justify-center text-sm font-medium max-w-[1272px] px-3 py-2">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-blue-600" />
          <span key={currentIndex} className="animate-fadeIn">
            {displayText}
          </span>
        </div>
      </div>
    </div>
  );
}