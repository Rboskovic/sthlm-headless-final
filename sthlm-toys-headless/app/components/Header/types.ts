// app/components/Header/types.ts - Simplified without isLoggedIn
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

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
  // ✅ NEW: Added metafields support for shop-level data like free shipping banner
  metafields?: Array<{
    key: string;
    value: string;
    namespace: string;
  } | null> | null;
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
  publicStoreDomain: string;
  popularCollections?: Collection[];
}

export interface HeaderMainProps {
  shop: Shop;
  cart: Promise<CartApiQueryFragment | null>;
  onMobileMenuToggle?: () => void;
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

// Updated interface for fullscreen mobile menu with full drill-down support
export interface MobileMenuFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  popularCollections?: Collection[];
  menu?: Menu | null;
  primaryDomainUrl?: string;
  publicStoreDomain?: string;
}

export type Viewport = 'mobile' | 'desktop';