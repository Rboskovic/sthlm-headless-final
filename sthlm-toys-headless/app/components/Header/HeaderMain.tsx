// FILE: app/components/Header/HeaderMain.tsx
// ✅ SIMPLIFIED: Always shows "Mitt Konto" - Shopify handles login/account logic

import {Link} from 'react-router';
import {Menu, User, FileText, HelpCircle} from 'lucide-react';
import {SearchBar} from './SearchBar';
import {CartToggle} from './CartToggle';
import {Logo} from './Logo';
import {WishlistIcon} from '~/components/WishlistIcon';
import type {HeaderMainProps} from './types';

interface HeaderMainPropsUpdated extends HeaderMainProps {
  onMobileMenuToggle?: () => void;
}

// ✅ SHOPIFY URLs 
const SHOP_ID = '90088112507';
const SHOPIFY_ACCOUNT_URL = `https://shopify.com/${SHOP_ID}/account`;
const SHOPIFY_ORDERS_URL = `https://shopify.com/${SHOP_ID}/account/orders`;

export function HeaderMain({
  shop,
  cart,
  onMobileMenuToggle,
}: HeaderMainPropsUpdated) {

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
            {/* Account section - Simple, always goes to Shopify account */}
            <a
              href={SHOPIFY_ACCOUNT_URL}
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
              <span className="text-white">Mitt Konto</span>
            </a>

            {/* Orders Link */}
            <a
              href={SHOPIFY_ORDERS_URL}
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
            </a>

            {/* Help Link */}
            <Link
              to="/pages/hjalp"
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
      <div className="hidden lg:block relative">
        <div
          className="flex items-center mx-auto"
          style={{
            maxWidth: '1272px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '20px',
            paddingBottom: '20px',
            gap: '20px',
            alignItems: 'center',
            height: '70px',
          }}
        >
          {/* Left Spacer */}
          <div style={{flex: '0 0 auto', width: '240px'}}></div>

          {/* Search Bar */}
          <div style={{
            flex: '1 1 auto',
            minWidth: 0,
            marginRight: '20px',
          }}>
            <SearchBar />
          </div>

          {/* Right Actions - Session wishlist with text */}
          <div
            className="flex items-center"
            style={{
              flex: '0 0 auto',
              gap: '16px',
              justifyContent: 'flex-end',
            }}
          >
            {/* Session Wishlist with Swedish text */}
            <div className="flex items-center text-white hover:bg-white/10 transition-colors" style={{
              padding: '6px 10px',
              borderRadius: '6px',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}>
              <WishlistIcon />
              <Link 
                to="/wishlist"
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'white',
                }}
              >
                Önskelista
              </Link>
            </div>

            <CartToggle cart={cart} />
          </div>
        </div>

        {/* Logo Overlay */}
        <div 
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
            pointerEvents: 'none',
            width: '100%',
            maxWidth: '1272px',
          }}
        >
          <div style={{
            paddingLeft: '12px',
            paddingRight: '12px',
          }}>
            <div style={{ pointerEvents: 'auto', width: 'fit-content' }}>
              <Logo 
                shop={shop}
                isMobile={false}
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

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div
          className="relative flex items-center"
          style={{
            padding: '16px 16px',
            minHeight: '64px',
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
            <div 
              className="text-white hover:bg-white/10 transition-colors"
              style={{
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <WishlistIcon />
            </div>

            <CartToggle cart={cart} />
          </div>

          {/* Mobile Logo Overlay */}
          <div 
            style={{ 
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              pointerEvents: 'none',
              width: 'fit-content',
            }}
          >
            <div style={{ pointerEvents: 'auto' }}>
              <Logo 
                shop={shop}
                isMobile={true}
                style={{
                  height: '34px',
                  maxWidth: '126px',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                }}
              />
            </div>
          </div>
        </div>

        {/* Second Row: Search Bar */}
        <div
          style={{
            padding: '0 16px 16px 16px',
          }}
        >
          <SearchBar isMobile={true} />
        </div>
      </div>
    </div>
  );
}