// app/components/Header/index.tsx - Restored proper structure
import {useState, useEffect} from 'react';
import {useAside} from '~/components/Aside';
import {HeaderBanner} from './HeaderBanner';
import {HeaderMain} from './HeaderMain';
import {DesktopNav} from './DesktopNav';
import {MobileNav} from './MobileNav';
import type {HeaderProps} from './types';

export function Header({
  header,
  cart,
  isLoggedIn,
  publicStoreDomain,
}: HeaderProps) {
  const {close, type: asideType} = useAside();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Listen to aside state changes
  useEffect(() => {
    setIsMobileNavOpen(asideType === 'mobile');
  }, [asideType]);

  const handleMobileNavClose = () => {
    close();
    setIsMobileNavOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* 1. Main Header - Logo, search, cart, etc. */}
        <HeaderMain shop={header.shop} cart={cart} isLoggedIn={isLoggedIn} />

        {/* 2. Desktop Navigation - Menu items */}
        <DesktopNav
          menu={header.menu}
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        {/* 3. Announcement Banner - Below navigation like Smyths */}
        <HeaderBanner />
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        menu={header.menu}
        isOpen={isMobileNavOpen}
        onClose={handleMobileNavClose}
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
    </>
  );
}

export {Header as default};
