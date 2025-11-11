// FILE: app/components/Footer/FooterLinks.tsx
// ✅ UPDATED: Added Garanti link to Support section

import {Link} from 'react-router';
import {Heart} from 'lucide-react';
import type {FooterLinksProps} from './types';

const FALLBACK_FOOTER_SECTIONS = [
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
      {id: 'warranty', title: 'Garanti', url: '/pages/garanti'}, // ✅ NEW
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
  const sections = menu?.items
    ? parseMenuIntoSections(menu.items)
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
    // Mobile: Both columns side by side
    return (
      <div className="grid grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.id}>
            <h4 className="text-white font-bold text-lg mb-3">
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
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

  // Desktop: 2 columns instead of 3
  return (
    <div className="grid grid-cols-2 gap-8">
      {sections.map((section) => (
        <div key={section.id}>
          <h4 className="text-white font-bold text-lg mb-4">{section.title}</h4>
          <ul className="space-y-2">
            {section.links.map((link) => (
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

function parseMenuIntoSections(menuItems: any[]) {
  return FALLBACK_FOOTER_SECTIONS;
}