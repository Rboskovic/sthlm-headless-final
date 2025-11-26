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
      {id: 'my-account', title: 'Mitt konto', url: '/account'},
      {id: 'track-order', title: 'Spåra min order', url: '/account/orders'},
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

  const getUrl = (url: string | null | undefined): string => {
    if (!url) return '/';

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
              {section.links.map((link: FooterLink) => (
                <li key={link.id}>
                  <Link
                    to={getUrl(link.url)}
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
                </li>
              ))}
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
            {section.links.map((link: FooterLink) => (
              <li key={link.id}>
                <Link
                  to={getUrl(link.url)}
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
              </li>
            ))}
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
    const sectionLinks: FooterLink[] = section.items?.map((item: any) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      icon: item.title.toLowerCase().includes('önskelista') ? 'heart' : undefined,
    })) || [];

    return {
      id: section.id,
      title: section.title,
      links: sectionLinks,
    };
  });
}