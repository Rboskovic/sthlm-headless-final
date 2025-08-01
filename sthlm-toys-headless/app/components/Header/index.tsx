// app/components/Header/index.tsx - Updated with fullscreen mobile menu
import {useState} from 'react';
import {HeaderBanner} from './HeaderBanner';
import {HeaderMain} from './HeaderMain';
import {DesktopNav} from './DesktopNav';
import {MobileMenuFullscreen} from './MobileMenuFullscreen';
import type {HeaderProps} from './types';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

// Extended interface to include collections for mobile menu
interface HeaderPropsExtended extends HeaderProps {
  popularCollections?: Collection[];
}

export function Header({
  header,
  cart,
  isLoggedIn,
  publicStoreDomain,
  popularCollections = [],
}: HeaderPropsExtended) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* 1. Main Header - Logo, search, cart, etc. */}
        <HeaderMain
          shop={header.shop}
          cart={cart}
          isLoggedIn={isLoggedIn}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        {/* 2. Desktop Navigation - Menu items */}
        <DesktopNav
          menu={header.menu}
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        {/* 3. Announcement Banner - Below navigation like Smyths */}
        <HeaderBanner />
      </header>

      {/* Fullscreen Mobile Navigation */}
      <MobileMenuFullscreen
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        shop={header.shop}
        isLoggedIn={isLoggedIn}
        popularCollections={popularCollections}
      />
    </>
  );
}

export {Header as default};
