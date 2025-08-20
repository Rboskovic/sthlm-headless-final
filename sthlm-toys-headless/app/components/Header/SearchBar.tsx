// app/components/Header/SearchBar.tsx - FIXED: Force full width
import {Search} from 'lucide-react';
import {SearchForm} from '~/components/SearchForm';
import type {SearchBarProps} from './types';

export function SearchBar({isMobile = false, className = ''}: SearchBarProps) {
  return (
    <SearchForm 
      action="/search"
      style={{ 
        width: '100%',
        maxWidth: 'none', // Remove any default form max-width
        minWidth: 0,
      }}
    >
      {({inputRef}) => (
        <div
          className={`flex w-full rounded-full overflow-hidden bg-white ${className}`}
          style={{ 
            width: '100%',
            maxWidth: 'none', // Ensure no width constraints
          }}
        >
          <input
            ref={inputRef}
            type="search"
            name="q"
            placeholder="Sök efter produkt eller varumärke"
            className="flex-1 text-gray-700 bg-white py-3 text-sm"
            style={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              paddingLeft: isMobile ? '20px' : '24px',
              paddingRight: '16px',
              width: '100%', // Ensure input takes full width
              maxWidth: 'none', // Remove any input constraints
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
      )}
    </SearchForm>
  );
}