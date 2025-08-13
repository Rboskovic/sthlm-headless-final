// FILE: app/components/ProductMetaInfo.tsx
// ✅ CONVERSION-OPTIMIZED: Product meta information display

import {Link} from 'react-router';
import {Tag, Building2, Package} from 'lucide-react';

interface ProductMetaInfoProps {
  vendor?: string | null;
  productType?: string | null;
  tags?: string[] | null;
}

export function ProductMetaInfo({vendor, productType, tags}: ProductMetaInfoProps) {
  if (!vendor && !productType && (!tags || tags.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-3 text-sm">
      {/* Brand/Vendor */}
      {vendor && (
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Brand:</span>
          <Link 
            to={`/collections/all?vendor=${encodeURIComponent(vendor)}`}
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {vendor}
          </Link>
        </div>
      )}

      {/* Category/Product Type */}
      {productType && (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Category:</span>
          <Link 
            to={`/collections/all?product_type=${encodeURIComponent(productType)}`}
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {productType}
          </Link>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex items-start space-x-2">
          <Tag className="w-4 h-4 text-gray-500 mt-0.5" />
          <div className="flex flex-col space-y-1">
            <span className="text-gray-600">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 5).map((tag) => (
                <Link
                  key={tag}
                  to={`/collections/all?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
              {tags.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{tags.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}