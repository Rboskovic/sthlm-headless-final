// FILE: app/components/Header/HeaderMain.tsx
// ✅ SHOPIFY STANDARD: Updated to work with proper Shopify logo implementation

import {Suspense} from 'react';
import {Link, Await} from 'react-router';
import {Heart, Menu, User, FileText, HelpCircle} from 'lucide-react';
import {SearchBar} from './SearchBar';
import {CartToggle} from './CartToggle';
import {Logo} from './Logo';
import {WishlistsLink} from '../WishlistsLink';
import type {HeaderMainProps} from './types';

// Updated interface to include mobile menu toggle
interface HeaderMainPropsUpdated extends HeaderMainProps {
  onMobileMenuToggle?: () => void;
}

export function HeaderMain({
  shop,
  cart,
  isLoggedIn,
  onMobileMenuToggle,
}: HeaderMainPropsUpdated) {
  return (
    <div
      className="w-full"
      style={{background: 'linear-gradient(to bottom, #1f96f4, #2171e1)'}}
    >
      {/* Top Utility Bar - Desktop Only */}
      <div className="hidden lg:flex justify-end items-center">
        <div className="mx-auto w-full max-w-[1272px] px-3">
          <div
            className="flex justify-end items-center py-2"
            style={{gap: '1.25rem'}}
          >
            <Suspense fallback={null}>
              <Await resolve={isLoggedIn}>
                {(isLoggedIn) => (
                  <Link
                    to={isLoggedIn ? '/account' : '/account/login'}
                    className="flex items-center rounded-full text-white hover:bg-white/10 transition-colors px-3 py-2"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '18.9px',
                      gap: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <User size={16} className="text-white" />
                    <span className="text-white">
                      {isLoggedIn ? 'Logga in / Registrera' : 'Logga in / Registrera'}
                    </span>
                  </Link>
                )}
              </Await>
            </Suspense>

            <Link
              to="/pages/order-tracking"
              className="flex items-center rounded-full text-white hover:bg-white/10 transition-colors px-3 py-2"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '18.9px',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              <FileText size={16} className="text-white" />
              <span className="text-white">Mina beställningar</span>
            </Link>

            <Link
              to="/pages/help"
              className="flex items-center rounded-full text-white hover:bg-white/10 transition-colors px-3 py-2"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '18.9px',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              <HelpCircle size={16} className="text-white" />
              <span className="text-white">Hjälp</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Main Header - ✅ FIXED: Proper logo positioning and sizing */}
      <div className="hidden lg:block">
        <div
          className="flex items-center justify-between mx-auto"
          style={{
            maxWidth: '1272px',
            // ✅ FIXED: Increased height to accommodate larger logo
            height: '100px', 
            margin: '8px auto 8px',
            paddingLeft: '12px',
            paddingRight: '12px',
          }}
        >
          {/* Logo - ✅ FIXED: Move logo to the right within its container */}
          <div className="flex-shrink-0 flex justify-center items-center" style={{width: '300px'}}>
            <Logo shop={shop} />
          </div>

          {/* Search Bar - Centered */}
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center" style={{gap: '16px', width: '300px', justifyContent: 'flex-end'}}>
            {/* ✅ FIXED: Smart Wishlist Link */}
            <WishlistsLink
              isLoggedIn={isLoggedIn}
              variant="desktop"
              className="flex items-center rounded-full text-white hover:bg-white/10 transition-colors"
              style={{
                minHeight: '48px',
                gap: '8px',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '21.6px',
                textDecoration: 'none',
              }}
            >
              <Heart size={32} className="text-white" />
              <span className="text-white">Önskelista</span>
            </WishlistsLink>

            {/* Cart */}
            <CartToggle cart={cart} />
          </div>
        </div>
      </div>

      {/* Mobile Header - ✅ FIXED: Logo centered to screen, not between components */}
      <div className="lg:hidden">
        <div 
          className="relative flex items-center justify-between px-4"
          style={{
            // ✅ SHOPIFY STANDARD: Standard mobile header height
            height: '60px',
          }}
        >
          {/* Left: Hamburger Menu */}
          <button
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            onClick={onMobileMenuToggle}
            aria-label="Öppna meny"
          >
            <Menu size={24} />
          </button>

          {/* Center: Logo - ✅ FIXED: Absolutely centered to screen */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Logo shop={shop} className="scale-55" />
          </div>

          {/* Right: Wishlist and Cart - Stay in exact same position */}
          <div className="flex items-center gap-2 z-10">
            {/* ✅ FIXED: Smart Wishlist Link for Mobile */}
            <WishlistsLink
              isLoggedIn={isLoggedIn}
              variant="mobile"
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Heart size={24} />
            </WishlistsLink>
            <CartToggle cart={cart} />
          </div>
        </div>

        {/* Mobile Search - Fixed padding from left */}
        <div className="px-4 pb-4">
          <SearchBar isMobile />
        </div>
      </div>
    </div>
  );
}