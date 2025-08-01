// app/components/Header/HeaderMain.tsx - Fixed all header issues
import {Suspense} from 'react';
import {Link, Await} from 'react-router';
import {Heart, Menu, User, FileText, HelpCircle} from 'lucide-react';
import {useAside} from '~/components/Aside';
import {SearchBar} from './SearchBar';
import {CartToggle} from './CartToggle';
import {Logo} from './Logo';
import type {HeaderMainProps} from './types';

export function HeaderMain({shop, cart, isLoggedIn}: HeaderMainProps) {
  const {open} = useAside();

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
                  <button
                    className="flex items-center rounded-full text-white hover:bg-white/10 transition-colors px-3 py-2"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '18.9px',
                      gap: '8px',
                    }}
                  >
                    <User size={16} className="text-white" />
                    <span className="text-white">
                      {isLoggedIn ? 'Konto' : 'Logga in'}
                    </span>
                  </button>
                )}
              </Await>
            </Suspense>
            <button
              className="flex items-center rounded-full text-white hover:bg-white/10 transition-colors px-3 py-2"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '18.9px',
                gap: '8px',
              }}
            >
              <FileText size={16} className="text-white" />
              <span className="text-white">Mina beställningar</span>
            </button>
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
            <button
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
              }}
            >
              <Heart size={32} className="text-white" />
              <span className="text-white">Önskelista</span>
            </button>

            {/* Cart */}
            <CartToggle cart={cart} />
          </div>
        </div>
      </div>

      {/* Mobile Header - Fixed Layout: Hamburger Left, Logo Center, Actions Right */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Hamburger Menu */}
          <button
            className="text-white p-2"
            onClick={() => open('mobile')}
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
            <button className="text-white p-2">
              <Heart size={24} />
            </button>
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
