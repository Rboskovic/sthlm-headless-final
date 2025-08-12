// FILE: app/components/Header/HeaderMain.tsx
// ✅ ENHANCED: Fixed positioning + Added mobile search & wishlist + Smyths layout

import {Suspense, useState} from 'react';
import {Link, Await} from 'react-router';
import {Heart, Menu, User, FileText, HelpCircle, ChevronDown, Search} from 'lucide-react';
import {SearchBar} from './SearchBar';
import {CartToggle} from './CartToggle';
import {Logo} from './Logo';
import {WishlistsLink} from '../WishlistsLink';
import type {HeaderMainProps} from './types';
import type {CustomerFragment} from 'customer-accountapi.generated';

interface HeaderMainPropsUpdated extends HeaderMainProps {
  onMobileMenuToggle?: () => void;
  customer?: CustomerFragment | null;
}

export function HeaderMain({
  shop,
  cart,
  isLoggedIn,
  onMobileMenuToggle,
  customer,
}: HeaderMainPropsUpdated) {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const closeAccountDropdown = () => {
    setIsAccountDropdownOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <div
      className="w-full"
      style={{background: 'linear-gradient(to bottom, #1f96f4, #2171e1)'}}
    >
      {/* Top Utility Bar - Desktop Only */}
      <div className="hidden lg:flex justify-end items-center">
        <div
          className="mx-auto w-full max-w-[1272px]"
          style={{paddingLeft: '12px', paddingRight: '40px'}}
        >
          <div
            className="flex justify-end items-center"
            style={{
              gap: '1rem',
              paddingTop: '4px',
              paddingBottom: '4px',
            }}
          >
            {/* Account section with dropdown */}
            <Suspense fallback={null}>
              <Await resolve={isLoggedIn}>
                {(isLoggedIn) => (
                  <div className="relative">
                    {isLoggedIn && customer ? (
                      <>
                        <button
                          onClick={toggleAccountDropdown}
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
                            Hej, {customer.firstName || 'Customer'}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`text-white transition-transform ${
                              isAccountDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Dropdown Menu */}
                        {isAccountDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={closeAccountDropdown}
                            />
                            <div
                              className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] z-50"
                              style={{
                                animation: 'fadeIn 0.2s ease-out',
                              }}
                            >
                              <div className="py-2">
                                <Link
                                  to="/account"
                                  onClick={closeAccountDropdown}
                                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                  style={{
                                    fontSize: '14px',
                                    gap: '8px',
                                    textDecoration: 'none',
                                  }}
                                >
                                  <User size={16} />
                                  <span>Min profil</span>
                                </Link>
                                <Link
                                  to="/account/orders"
                                  onClick={closeAccountDropdown}
                                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                  style={{
                                    fontSize: '14px',
                                    gap: '8px',
                                    textDecoration: 'none',
                                  }}
                                >
                                  <FileText size={16} />
                                  <span>Mina beställningar</span>
                                </Link>
                                <Link
                                  to="/account/wishlist"
                                  onClick={closeAccountDropdown}
                                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                  style={{
                                    fontSize: '14px',
                                    gap: '8px',
                                    textDecoration: 'none',
                                  }}
                                >
                                  <Heart size={16} />
                                  <span>Önskelista</span>
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <Link
                        to="/account/login"
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
                        <span className="text-white">Hej, Logga in</span>
                      </Link>
                    )}
                  </div>
                )}
              </Await>
            </Suspense>

            <Link
              to="/account/orders"
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

      {/* Desktop Main Header - Improved Layout */}
      <div className="hidden lg:block">
        <div
          className="flex items-center mx-auto"
          style={{
            maxWidth: '1272px',
            paddingLeft: '12px',
            paddingRight: '40px',
            paddingTop: '20px',
            paddingBottom: '20px',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          {/* Logo - Fixed Sizing */}
          <div style={{flex: '0 0 auto', width: '180px'}}>
            <Logo 
              shop={shop}
              style={{
                height: '45px',
                maxWidth: '180px',
              }}
            />
          </div>

          {/* Search Bar - Centered with Fixed Width */}
          <div style={{
            flex: '1 1 auto', 
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            <SearchBar />
          </div>

          {/* Right Actions - Fixed Positioning */}
          <div
            className="flex items-center"
            style={{
              flex: '0 0 auto',
              gap: '20px',
              minWidth: '200px',
              justifyContent: 'flex-end',
            }}
          >
            <WishlistsLink
              className="flex items-center text-white hover:bg-white/10 transition-colors"
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              <Heart size={20} className="text-white" />
              <span
                className="text-white"
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                Önskelista
              </span>
            </WishlistsLink>

            <CartToggle cart={cart} />
          </div>
        </div>
      </div>

      {/* Mobile Header - Enhanced with Search & Wishlist */}
      <div className="lg:hidden">
        {/* Mobile Search Bar - Collapsible */}
        {isMobileSearchOpen && (
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <SearchBar isMobile={true} />
          </div>
        )}

        {/* Main Mobile Header Row */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '12px 16px',
            gap: '12px',
            minHeight: '60px',
          }}
        >
          {/* Left: Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="text-white hover:bg-white/10 transition-colors flex-shrink-0"
            style={{
              padding: '8px',
              borderRadius: '4px',
            }}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Center: Mobile Logo */}
          <div style={{
            flex: '1 1 auto', 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Logo 
              shop={shop}
              style={{
                height: '36px',
                maxWidth: '140px',
              }}
            />
          </div>

          {/* Right: Search, Wishlist, Cart */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={toggleMobileSearch}
              className="text-white hover:bg-white/10 transition-colors"
              style={{
                padding: '8px',
                borderRadius: '4px',
              }}
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>

            {/* Mobile Wishlist */}
            <WishlistsLink
              className="text-white hover:bg-white/10 transition-colors"
              style={{
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <Heart size={20} className="text-white" />
            </WishlistsLink>

            {/* Mobile Cart */}
            <CartToggle cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}