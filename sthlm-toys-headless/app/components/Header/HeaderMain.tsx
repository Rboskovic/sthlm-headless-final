// app/components/Header/HeaderMain.tsx - Updated for fullscreen mobile menu
import {Suspense} from 'react';
import {Link, Await} from 'react-router';
import {Heart, Menu, User, FileText, HelpCircle} from 'lucide-react';
import {SearchBar} from './SearchBar';
import {CartToggle} from './CartToggle';
import {Logo} from './Logo';
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
                      {isLoggedIn ? 'Konto' : 'Logga in'}
                    </span>
                  </Link>
                )}
              </Await>
            </Suspense>
            <Link
              to="/account/orders"
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
              to="/hjalp"
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

      {/* Main Header - Desktop */}
      <div className="hidden lg:flex lg:items-center">
        <div
          className="mx-auto flex items-center"
          style={{
            width: '1272px',
            height: '68px',
            margin: '12px auto 0px',
            paddingLeft: '12px',
            paddingRight: '12px',
            gap: '40px',
          }}
        >
          {/* Logo - Fixed dimensions to prevent cutting */}
          <div className="flex-shrink-0">
            <Logo shop={shop} />
          </div>

          {/* Search Bar - Fixed padding */}
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center" style={{gap: '16px'}}>
            {/* Wishlist */}
            <Link
              to="/account/wishlist"
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
            </Link>

            {/* Cart */}
            <CartToggle cart={cart} />
          </div>
        </div>
      </div>

      {/* Mobile Header - Updated to use fullscreen menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Hamburger Menu - Updated to use onMobileMenuToggle */}
          <button
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={onMobileMenuToggle}
            aria-label="Öppna meny"
          >
            <Menu size={24} />
          </button>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Logo
              shop={shop}
              style={{
                height: '40px',
                width: '120px',
                maxWidth: '120px',
              }}
            />
          </div>

          {/* Right: Wishlist and Cart */}
          <div className="flex items-center gap-2">
            <Link
              to="/account/wishlist"
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Heart size={24} />
            </Link>
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
