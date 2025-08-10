// FILE: app/components/Header/HeaderMain.tsx
// ✅ ENHANCED: Added customer dropdown with Smyths styling + fixed orders link

import {Suspense, useState} from 'react';
import {Link, Await} from 'react-router';
import {Heart, Menu, User, FileText, HelpCircle, ChevronDown} from 'lucide-react';
import {SearchBar} from './SearchBar';
import {CartToggle} from './CartToggle';
import {Logo} from './Logo';
import {WishlistsLink} from '../WishlistsLink';
import type {HeaderMainProps} from './types';
import type {CustomerFragment} from 'customer-accountapi.generated';

interface HeaderMainPropsUpdated extends HeaderMainProps {
  onMobileMenuToggle?: () => void;
  customer?: CustomerFragment | null; // ✅ ENHANCED: Optional customer data
}

export function HeaderMain({
  shop,
  cart,
  isLoggedIn,
  onMobileMenuToggle,
  customer,
}: HeaderMainPropsUpdated) {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const closeAccountDropdown = () => {
    setIsAccountDropdownOpen(false);
  };

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
          <div
            className="flex justify-end items-center"
            style={{
              gap: '1rem',
              paddingTop: '4px',
              paddingBottom: '4px',
            }}
          >
            {/* ✅ ENHANCED: Account section with dropdown */}
            <Suspense fallback={null}>
              <Await resolve={isLoggedIn}>
                {(isLoggedIn) => (
                  <div className="relative">
                    {isLoggedIn && customer ? (
                      // ✅ LOGGED IN: Show "Hi [Name]" with dropdown
                      <div>
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
                            Hi, {customer.firstName || 'Vale'}
                          </span>
                          <ChevronDown size={14} className="text-white" />
                        </button>

                        {/* ✅ DROPDOWN MENU: Smyths-style dropdown */}
                        {isAccountDropdownOpen && (
                          <>
                            {/* Backdrop to close dropdown */}
                            <div
                              className="fixed inset-0 z-40"
                              onClick={closeAccountDropdown}
                            />
                            
                            {/* Dropdown content */}
                            <div 
                              className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-50 min-w-[200px]"
                              style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                              }}
                            >
                              <div className="py-2">
                                <Link
                                  to="/account"
                                  onClick={closeAccountDropdown}
                                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    gap: '8px',
                                  }}
                                >
                                  <User size={16} className="text-gray-600" />
                                  My Account
                                </Link>
                                
                                <Link
                                  to="/account/wishlist"
                                  onClick={closeAccountDropdown}
                                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    gap: '8px',
                                  }}
                                >
                                  <Heart size={16} className="text-gray-600" />
                                  Wishlist
                                </Link>

                                <div className="border-t border-gray-100 my-1" />
                                
                                <form method="POST" action="/account/logout">
                                  <button
                                    type="submit"
                                    onClick={closeAccountDropdown}
                                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                    style={{
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      gap: '8px',
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Logout
                                  </button>
                                </form>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : isLoggedIn ? (
                      // ✅ LOGGED IN but no customer data: Generic greeting
                      <Link
                        to="/account"
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
                        <span className="text-white">Hi, Vale</span>
                      </Link>
                    ) : (
                      // ✅ NOT LOGGED IN: Login link
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
                        <span className="text-white">Logga in / Registrera</span>
                      </Link>
                    )}
                  </div>
                )}
              </Await>
            </Suspense>

            {/* ✅ FIXED: Correct orders link */}
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

      {/* Desktop Main Header */}
      <div className="hidden lg:block">
        <div
          className="flex items-center mx-auto"
          style={{
            maxWidth: '1272px',
            paddingLeft: '12px',
            paddingRight: '40px',
            paddingTop: '24px',
            paddingBottom: '24px',
            gap: '24px',
          }}
        >
          {/* Logo */}
          <div style={{flex: '0 0 auto'}}>
            <Logo shop={shop} />
          </div>

          {/* Search Bar */}
          <div style={{flex: '1 1 auto', maxWidth: '600px'}}>
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div
            className="flex items-center"
            style={{
              flex: '0 0 auto',
              gap: '16px',
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

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div
          className="flex items-center justify-between"
          style={{
            padding: '16px 16px',
            gap: '16px',
          }}
        >
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="text-white hover:bg-white/10 transition-colors"
            style={{
              padding: '8px',
              borderRadius: '4px',
            }}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Mobile Logo */}
          <div style={{flex: '1 1 auto', textAlign: 'center'}}>
            <Logo shop={shop} />
          </div>

          {/* Mobile Cart */}
          <CartToggle cart={cart} />
        </div>
      </div>
    </div>
  );
}