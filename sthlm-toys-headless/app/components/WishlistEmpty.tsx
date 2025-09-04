// app/components/WishlistEmpty.tsx
// ✅ UPDATED: Swedish translation + Better UX + LEGO themes link

import { Link } from 'react-router';
import { Heart, ShoppingBag, Star, Gift, Sparkles } from 'lucide-react';

export function WishlistEmpty() {
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
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/collections"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg transition-colors"
            style={{ color: 'white' }} // Force white text
          >
            <ShoppingBag size={20} className="mr-2" style={{ color: 'white' }} />
            <span style={{ color: 'white' }}>Börja Handla</span>
          </Link>
          
          <Link 
            to="/themes"
            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            <Heart size={20} className="mr-2" />
            Se LEGO Teman
          </Link>
        </div>
      </div>
      
      {/* Popular Section - Like mobile menu/cart */}
      <div className="bg-gray-50 rounded-lg p-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4 text-center">Populära just nu</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Popular Categories */}
          <Link 
            to="/collections/lego-themes"
            className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Star size={24} className="text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 text-sm">LEGO Teman</h4>
            <p className="text-xs text-gray-600 text-center">Upptäck alla teman</p>
          </Link>

          <Link 
            to="/collections/new-arrivals"
            className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <Sparkles size={24} className="text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 text-sm">Nyheter</h4>
            <p className="text-xs text-gray-600 text-center">Senaste produkterna</p>
          </Link>

          <Link 
            to="/collections/gifts"
            className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Gift size={24} className="text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 text-sm">Present Tips</h4>
            <p className="text-xs text-gray-600 text-center">Perfekta presenter</p>
          </Link>
        </div>
      </div>
    </div>
  );
}