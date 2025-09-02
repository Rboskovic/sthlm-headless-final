import type {CartApiQueryFragment} from 'storefrontapi.generated';

export interface FooterMenu {
  id: string;
  items: Array<{
    id: string;
    resourceId?: string | null;
    tags: string[];
    title: string;
    type: string;
    url?: string | null;
    items: Array<any>;
  }>;
}

// ✅ UPDATED: Added shop with paymentSettings for official payment icons
export interface FooterQuery {
  menu?: FooterMenu | null;
  shop?: {
    paymentSettings?: {
      acceptedCardBrands: string[];
    } | null;
  } | null;
}

export interface Shop {
  primaryDomain: {
    url: string;
  };
  name?: string;
  brand?: {
    logo?: {
      image?: {
        url: string;
      };
    };
  } | null;
}

export interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: {shop: Shop};
  publicStoreDomain: string;
}

export interface FooterLinksProps {
  menu?: FooterMenu | null;
  primaryDomainUrl: string;
  publicStoreDomain: string;
  isMobile?: boolean;
}