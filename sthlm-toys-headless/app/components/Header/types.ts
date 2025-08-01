// app/components/Header/types.ts - Updated with Logo support
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export interface MenuItem {
  id: string;
  resourceId?: string | null;
  items: MenuItem[];
  url?: string;
  title: string;
  type: string;
  tags?: string[];
}

export interface Shop {
  id: string;
  name: string;
  description?: string;
  primaryDomain: {
    url: string;
  };
  brand?: {
    logo?: {
      image?: {
        url: string;
      };
    };
  } | null;
}

export interface Menu {
  id: string;
  items: MenuItem[];
}

export interface HeaderData {
  shop: Shop;
  menu?: Menu | null;
}

export interface HeaderProps {
  header: HeaderData;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export interface HeaderMainProps {
  shop: Shop;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
}

export interface DesktopNavProps {
  menu?: Menu | null;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}

export interface MobileNavProps {
  menu?: Menu | null;
  isOpen: boolean;
  onClose: () => void;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}

export interface MegaMenuProps {
  menu?: Menu | null;
  activeMenu: string | null;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}

export interface CartToggleProps {
  cart: Promise<CartApiQueryFragment | null>;
}

export interface SearchBarProps {
  isMobile?: boolean;
  className?: string;
}

export type Viewport = 'mobile' | 'desktop';
