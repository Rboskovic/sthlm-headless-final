// FILE: app/components/Header/HeaderMain.tsx
// ✅ EXACT SMYTHS REPLICATION: Matching proportions, spacing, and layout

import {Suspense} from 'react';
import {Link, Await} from 'react-router';
import {Heart, Menu, User, FileText, HelpCircle} from 'lucide-react';
import {SearchBar} from './SearchBar';
import {CartToggle} from './CartToggle';
import {Logo} from './Logo';
import {WishlistsLink} from '../WishlistsLink';
import type {HeaderMainProps} from './types';

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
      {/* Top Utility Bar */}
      <div className="hidden lg:flex justify-end items-center">
        <div
          className="mx-auto w-full max-w-[1272px]"
          style={{paddingLeft: '12px', paddingRight: '40px'}}
        >
          {' '}
          {/* Increased right padding */}
          <div
            className="flex justify-end items-center"
            style={{
              gap: '1rem',
              paddingTop: '4px',
              paddingBottom: '4px',
            }}
          >
            <Suspense fallback={null}>
              <Await resolve={isLoggedIn}>
                {(isLoggedIn) => (
                  <Link
                    to={isLoggedIn ? '/account' : '/account/login'}
                    className="flex items-center text-white hover:bg-white/10 transition-colors"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '18px',
                      gap: '6px',
                      textDecoration: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                    }}
                  >
                    <User size={15} className="text-white" />
                    <span className="text-white">
                      {isLoggedIn
                        ? 'Logga in / Registrera'
                        : 'Logga in / Registrera'}
                    </span>
                  </Link>
                )}
              </Await>
            </Suspense>

            <Link
              to="/pages/order-tracking"
              className="flex items-center text-white hover:bg-white/10 transition-colors"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '18px',
                gap: '6px',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
              }}
            >
              <FileText size={15} className="text-white" />
              <span className="text-white">Mina beställningar</span>
            </Link>

            <Link
              to="/pages/help"
              className="flex items-center text-white hover:bg-white/10 transition-colors"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '18px',
                gap: '6px',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
              }}
            >
              <HelpCircle size={15} className="text-white" />
              <span className="text-white">Hjälp</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Main Header */}
      <div className="hidden lg:block">
        <div
          className="flex items-center mx-auto"
          style={{
            maxWidth: '1272px',
            height: '70px',
            paddingLeft: '12px',
            paddingRight: '40px', // Increased right padding to match utility bar
            gap: '32px',
          }}
        >
          {/* Logo container */}
          <div
            className="flex-shrink-0 flex items-center"
            style={{
              width: '180px',
              justifyContent: 'flex-start',
              paddingLeft: '24px',
            }}
          >
            <Logo
              shop={shop}
              style={{
                height: '45px',
                width: '150px',
              }}
            />
          </div>

          {/* Search bar */}
          <div className="flex-1" style={{minWidth: '400px'}}>
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div
            className="flex-shrink-0 flex items-center"
            style={{
              width: '300px',
              justifyContent: 'flex-end',
            }}
          >
            <div className="flex items-center" style={{gap: '16px'}}>
              <WishlistsLink
                isLoggedIn={isLoggedIn}
                variant="desktop"
                className="flex items-center rounded-full text-white hover:bg-white/10 transition-colors"
                style={{
                  minHeight: '44px',
                  gap: '8px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  textDecoration: 'none',
                }}
              >
                <Heart size={26} className="text-white" />
                <span className="text-white">Önskelista</span>
              </WishlistsLink>

              <CartToggle cart={cart} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div
          className="relative flex items-center justify-between px-4"
          style={{
            height: '60px',
          }}
        >
          <button
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            onClick={onMobileMenuToggle}
            aria-label="Öppna meny"
          >
            <Menu size={24} />
          </button>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Logo shop={shop} className="scale-50" />
          </div>

          <div className="flex items-center gap-2 z-10">
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

        <div className="px-4 pb-4">
          <SearchBar isMobile />
        </div>
      </div>
    </div>
  );
}
