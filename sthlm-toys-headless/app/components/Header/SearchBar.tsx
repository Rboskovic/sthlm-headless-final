// app/components/Header/SearchBar.tsx - Fixed left padding
import {Search} from 'lucide-react';
import type {SearchBarProps} from './types';

export function SearchBar({isMobile = false, className = ''}: SearchBarProps) {
  return (
    <div
      className={`flex w-full rounded-full overflow-hidden bg-white ${className}`}
    >
      <input
        type="text"
        placeholder="Sök efter produkt eller varumärke"
        className="flex-1 text-gray-700 bg-white py-3 text-sm"
        style={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          // Increased left padding as requested
          paddingLeft: isMobile ? '20px' : '24px', // Increased from 16px to 20px/24px
          paddingRight: '16px',
        }}
        onFocus={(e) => {
          e.target.style.outline = 'none';
          e.target.style.boxShadow = 'none';
        }}
      />
      <button
        className="bg-yellow-400 hover:bg-yellow-500 font-semibold text-black flex items-center justify-center px-6 transition-colors"
        type="submit"
        aria-label="Sök"
        style={{border: 'none', outline: 'none'}}
      >
        <Search size={16} />
      </button>
    </div>
  );
}
