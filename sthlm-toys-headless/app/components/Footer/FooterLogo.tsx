import {Link} from 'react-router';
import {Heart} from 'lucide-react';
import type {FooterLinksProps} from './types';

const FALLBACK_FOOTER_SECTIONS = [
  {
    id: 'support',
    title: 'Support',
    links: [
      {id: 'gift-guides', title: 'Presentguider', url: '/gift-guides'},
      {id: 'help', title: 'Hjälp', url: '/help'},
      {id: 'shipping', title: 'Frakt', url: '/shipping'},
      {id: 'returns', title: 'Returer & byten', url: '/returns'},
      {id: 'contact', title: 'Kontakta oss', url: '/contact'},
    ],
  },
  {
    id: 'account',
    title: 'Konto',
    links: [
      {id: 'my-account', title: 'Mitt konto', url: '/account'},
      {id: 'track-order', title: 'Spåra min order', url: '/account/orders'},
      {
        id: 'wishlist',
        title: 'Min önskelista',
        url: '/account/wishlist',
        icon: 'heart',
      },
    ],
  },
  {
    id: 'about',
    title: 'Om oss',
    links: [
      {id: 'our-story', title: 'Vår historia', url: '/about'},
      {id: 'terms', title: 'Villkor', url: '/terms'},
      {id: 'privacy', title: 'Integritetspolicy', url: '/privacy'},
      {
        id: 'privacy-choices',
        title: 'Dina integritetsval',
        url: '/privacy-choices',
      },
      {id: 'cookies', title: 'Cookie-inställningar', url: '/cookies'},
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
    // Split sections: Support & Konto in first row, Om oss in second row
    const firstRowSections = sections.filter(
      (s) => s.id === 'support' || s.id === 'account',
    );
    const secondRowSections = sections.filter((s) => s.id === 'about');

    return (
      <div className="space-y-6">
        {/* First row: Support & Konto side by side */}
        <div className="grid grid-cols-2 gap-6">
          {firstRowSections.map((section) => (
            <div key={section.id}>
              <h4 className="text-white font-bold text-lg mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={getUrl(link.url)}
                      className="flex items-center gap-2 transition-colors"
                      style={{color: 'white', textDecoration: 'none'}}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#FCD34D';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'white';
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

        {/* Second row: Om oss centered to left */}
        <div className="flex justify-start">
          {secondRowSections.map((section) => (
            <div key={section.id} className="w-1/2">
              <h4 className="text-white font-bold text-lg mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={getUrl(link.url)}
                      className="flex items-center gap-2 transition-colors"
                      style={{color: 'white', textDecoration: 'none'}}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#FCD34D';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'white';
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
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-8">
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
                    e.target.style.color = '#FCD34D';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'white';
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
export function FooterLogo({shop}: {shop: any}) {
  return (
    <div className="flex items-center">
      <span className="text-white font-bold text-lg">
        {shop?.name || 'STHLM Toys & Games'}
      </span>
    </div>
  );
}
