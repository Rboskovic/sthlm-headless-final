// FILE: app/components/Header/HeaderMain.tsx
// ✅ FIXED: Mobile search always visible in second row + Logo centered + Desktop sizing

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
                            padding: '6px 10px',
                            borderRadius: '4px',
                          }}
                        >
                          <User size={15} className="text-white" />
                          <span className="text-white">
                            Hej, {customer.firstName || 'Användare'}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`text-white transition-transform ${
                              isAccountDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Account Dropdown */}
                        {isAccountDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={closeAccountDropdown}
                            />
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg py-2 z-20 min-w-[180px]">
                              <Link
                                to="/account"
                                onClick={closeAccountDropdown}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mitt konto
                              </Link>
                              <Link
                                to="/account/orders"
                                onClick={closeAccountDropdown}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mina beställningar
                              </Link>
                              <Link
                                to="/account/logout"
                                onClick={closeAccountDropdown}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Logga ut
                              </Link>
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
                        <span className="text-white">Logga in</span>
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

      {/* Desktop Main Header - Logo as overlay, compact layout */}
      <div className="hidden lg:block relative">
        <div
          className="flex items-center mx-auto"
          style={{
            maxWidth: '1272px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '20px', // Increased from 16px
            paddingBottom: '20px', // Increased from 16px  
            gap: '20px',
            alignItems: 'center',
            height: '70px', // Increased from 60px for better spacing
          }}
        >
          {/* Left Spacer - More space for logo breathing room */}
          <div style={{flex: '0 0 auto', width: '240px'}}></div> {/* Increased from 200px */}

          {/* Search Bar - Full width */}
          <div style={{
            flex: '1 1 auto',
            minWidth: 0,
            marginRight: '20px',
          }}>
            <SearchBar />
          </div>

          {/* Right Actions - Compact */}
          <div
            className="flex items-center"
            style={{
              flex: '0 0 auto',
              gap: '16px',
              justifyContent: 'flex-end',
            }}
          >
            <WishlistsLink
              className="flex items-center text-white hover:bg-white/10 transition-colors"
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                gap: '6px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <Heart size={18} className="text-white" />
              <span
                className="text-white"
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                Önskelista
              </span>
            </WishlistsLink>

            <CartToggle cart={cart} />
          </div>
        </div>

        {/* Logo Overlay - Fixed: Proper responsive padding like content */}
        <div 
          style={{
            position: 'absolute',
            left: '50%', // Center the container
            top: '50%',
            transform: 'translate(-50%, -50%)', // Center the container
            zIndex: 20,
            pointerEvents: 'none', // Container doesn't block clicks
            width: '100%',
            maxWidth: '1272px', // Match container max-width
          }}
        >
          <div style={{
            paddingLeft: '12px', // Match container padding
            paddingRight: '12px',
          }}>
            {/* Logo with click events enabled */}
            <div style={{ pointerEvents: 'auto', width: 'fit-content' }}> {/* Only logo area clickable */}
              <Logo 
                shop={shop}
                style={{
                  height: '75px',
                  maxWidth: '220px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header - Smaller logo overlay */}
      <div className="lg:hidden">
        {/* First Row: Menu, Actions */}
        <div
          className="relative flex items-center"
          style={{
            padding: '16px 16px', // Increased from 12px
            minHeight: '64px', // Increased from 56px
            position: 'relative',
          }}
        >
          {/* Left: Mobile Menu Button */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
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
          </div>

          {/* Right: Wishlist, Cart */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
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

            <CartToggle cart={cart} />
          </div>

          {/* Mobile Logo Overlay - Fixed: Only logo area, not full width */}
          <div 
            style={{ 
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              pointerEvents: 'none', // Container doesn't block clicks
              width: 'fit-content', // Only as wide as logo
            }}
          >
            {/* Logo with click events enabled */}
            <div style={{ pointerEvents: 'auto' }}> {/* Only logo can be clicked */}
              <Logo 
                shop={shop}
                style={{
                  height: '34px', // Increased by 5% from 32px
                  maxWidth: '126px', // Increased by 5% from 120px
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                }}
              />
            </div>
          </div>
        </div>

        {/* Second Row: Always Visible Search Bar */}
        <div
          style={{
            padding: '0 16px 16px 16px', // Increased bottom padding
          }}
        >
          <SearchBar isMobile={true} />
        </div>
      </div>
    </div>
  );
}