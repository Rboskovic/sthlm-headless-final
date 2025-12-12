import {Link} from 'react-router';
import {Heart} from 'lucide-react';
import type {FooterLinksProps} from './types';

interface FooterLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

const FALLBACK_FOOTER_SECTIONS: FooterSection[] = [
  {
    id: 'support',
    title: 'Support',
    links: [
      {id: 'about', title: 'Om oss', url: '/pages/om-oss'},
      {id: 'help', title: 'Hjälp & FAQ', url: '/pages/hjalp'},
      {id: 'contact', title: 'Kontakta oss', url: '/pages/kontakta-oss'},
      {id: 'terms', title: 'Köpvillkor', url: '/pages/kopvillkor'},
      {id: 'shipping', title: 'Leveranspolicy', url: '/pages/leveranspolicy'},
      {id: 'returns', title: 'Retur och återbetalningspolicy', url: '/pages/returpolicy'},
      {id: 'warranty', title: 'Garanti', url: '/pages/garanti'},
      {id: 'privacy', title: 'Integritetspolicy', url: '/pages/integritetspolicy'},
      {id: 'cookies', title: 'Cookies', url: '/pages/cookies'},
      {id: 'legal', title: 'Rättsligt meddelande', url: '/pages/rattsligt-meddelande'},
    ],
  },
  {
    id: 'account',
    title: 'Mitt konto',
    links: [
      {id: 'my-account', title: 'Mitt konto', url: 'https://shopify.com/90088112507/account'}, // ✅ UPDATED: Changed to Shopify URL
      {id: 'track-order', title: 'Spåra min order', url: '/pages/spara-order'}, // ✅ UPDATED: Changed from /account/orders to /pages/spara-order
      {
        id: 'wishlist',
        title: 'Min önskelista',
        url: '/wishlist',
        icon: 'heart',
      },
    ],
  },
];

export function FooterLinks({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
  isMobile = false,
}: FooterLinksProps) {
  const sections = menu?.items && menu.items.length > 0
    ? parseMenuIntoSections(menu.items, primaryDomainUrl, publicStoreDomain)
    : FALLBACK_FOOTER_SECTIONS;

  // ✅ FIXED: Check if URL is external FIRST, then process accordingly
  const isExternalUrl = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const getUrl = (url: string | null | undefined): string => {
    if (!url) return '/';

    // ✅ If it's already an external URL, return as-is
    if (isExternalUrl(url)) {
      return url;
    }

    // Only process internal URLs
    if (
      url.includes('myshopify.com') ||
      url.includes(publicStoreDomain) ||
      url.includes(primaryDomainUrl)
    ) {
      return new URL(url).pathname;
    }
    return url;
  };

  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.id}>
            <h4 className="text-white font-bold text-lg mb-3">
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.links.map((link: FooterLink) => {
                const url = getUrl(link.url);
                const isExternal = isExternalUrl(url);

                return (
                  <li key={link.id}>
                    {isExternal ? (
                      <a
                        href={url}
                        className="flex items-center gap-2 transition-colors text-sm"
                        style={{color: 'white', textDecoration: 'none'}}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.color = '#FCD34D';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.color = 'white';
                        }}
                      >
                        {link.icon === 'heart' && (
                          <Heart size={16} style={{color: 'white'}} />
                        )}
                        {link.title}
                      </a>
                    ) : (
                      <Link
                        to={url}
                        className="flex items-center gap-2 transition-colors text-sm"
                        style={{color: 'white', textDecoration: 'none'}}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.color = '#FCD34D';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.color = 'white';
                        }}
                      >
                        {link.icon === 'heart' && (
                          <Heart size={16} style={{color: 'white'}} />
                        )}
                        {link.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      {sections.map((section) => (
        <div key={section.id}>
          <h4 className="text-white font-bold text-lg mb-4">{section.title}</h4>
          <ul className="space-y-2">
            {section.links.map((link: FooterLink) => {
              const url = getUrl(link.url);
              const isExternal = isExternalUrl(url);

              return (
                <li key={link.id}>
                  {isExternal ? (
                    <a
                      href={url}
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{color: 'white', textDecoration: 'none'}}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = '#FCD34D';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = 'white';
                      }}
                    >
                      {link.icon === 'heart' && (
                        <Heart size={16} style={{color: 'white'}} />
                      )}
                      {link.title}
                    </a>
                  ) : (
                    <Link
                      to={url}
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{color: 'white', textDecoration: 'none'}}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = '#FCD34D';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = 'white';
                      }}
                    >
                      {link.icon === 'heart' && (
                        <Heart size={16} style={{color: 'white'}} />
                      )}
                      {link.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function parseMenuIntoSections(
  menuItems: any[],
  primaryDomainUrl: string,
  publicStoreDomain: string
): FooterSection[] {
  return menuItems.map((section) => {
    const sectionLinks: FooterLink[] = section.items?.map((item: any) => {
      // ✅ FIX: Override specific URLs that we know should go elsewhere
      let url = item.url;
      
      // Fix "Spåra min order" / "Track order" links
      if (
        item.title.toLowerCase().includes('spåra') ||
        item.url?.includes('/account/orders')
      ) {
        url = '/pages/spara-order';
      }
      
      // Fix "Mitt konto" / "My account" links - should go to Shopify
      if (
        item.title.toLowerCase() === 'mitt konto' ||
        item.url?.includes('/account') && !item.url?.includes('/account/orders')
      ) {
        url = 'https://shopify.com/90088112507/account';
      }

      return {
        id: item.id,
        title: item.title,
        url: url,
        icon: item.title.toLowerCase().includes('önskelista') ? 'heart' : undefined,
      };
    }) || [];

    return {
      id: section.id,
      title: section.title,
      links: sectionLinks,
    };
  });
}