// app/components/Header/index.tsx - Simplified without isLoggedIn
import {useState} from 'react';
import {HeaderBanner} from './HeaderBanner';
import {HeaderMain} from './HeaderMain';
import {DesktopNav} from './DesktopNav';
import {MobileMenuFullscreen} from './MobileMenuFullscreen';
import type {HeaderProps} from './types';

export function Header({
  header,
  cart,
  publicStoreDomain,
  popularCollections = [],
}: HeaderProps) {
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
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        {/* 2. Desktop Navigation - Menu items */}
        <DesktopNav
          menu={header.menu}
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        {/* 3. Announcement Banner - Now with shop metafield support */}
        <HeaderBanner shop={header.shop} />
      </header>

      {/* Fullscreen Mobile Navigation - Drill-down with Shopify menu */}
      <MobileMenuFullscreen
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        shop={header.shop}
        popularCollections={popularCollections}
        menu={header.menu}
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
    </>
  );
}

export {Header as default};