// FILE: app/components/ProductBreadcrumbs.tsx
// ✅ CONVERSION-OPTIMIZED: Breadcrumb navigation for PDP

import {Link} from 'react-router';
import {ChevronRight, Home} from 'lucide-react';

interface ProductBreadcrumbsProps {
  collection: {
    id: string;
    title: string;
    handle: string;
  };
  productTitle: string;
}

export function ProductBreadcrumbs({collection, productTitle}: ProductBreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 py-4">
      <Link 
        to="/"
        className="flex items-center hover:text-gray-900 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="ml-1">Home</span>
      </Link>
      
      <ChevronRight className="w-4 h-4 text-gray-400" />
      
      <Link 
        to={`/collections/${collection.handle}`}
        className="hover:text-gray-900 transition-colors"
      >
        {collection.title}
      </Link>
      
      <ChevronRight className="w-4 h-4 text-gray-400" />
      
      <span className="text-gray-900 font-medium truncate max-w-xs">
        {productTitle}
      </span>
    </nav>
  );
}