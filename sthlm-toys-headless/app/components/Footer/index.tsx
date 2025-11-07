import {Suspense} from 'react';
import {Await} from 'react-router';
import {NewsletterSignup} from './NewsletterSignup';
import {FooterLinks} from './FooterLinks';
import {SocialMedia} from './SocialMedia';
import {FooterLogo} from './FooterLogo';
import {PaymentIcons} from './PaymentIcons';
import type {FooterProps} from './types';

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <footer
      className="w-full"
      style={{background: 'linear-gradient(to bottom, #1f96f4, #2171e1)'}}
    >
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-[1272px] mx-auto px-3 py-4">
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left side - Footer Links (5 columns) */}
            <div className="col-span-5">
              <Suspense fallback={<FooterLinksFallback />}>
                <Await resolve={footerPromise}>
                  {(footer) => (
                    <FooterLinks
                      menu={footer?.menu}
                      primaryDomainUrl={header.shop.primaryDomain.url}
                      publicStoreDomain={publicStoreDomain}
                    />
                  )}
                </Await>
              </Suspense>

              {/* Payment Icons */}
              <div className="mt-4">
                <PaymentIcons />
              </div>
            </div>

            {/* Middle - Contact Us (4 columns) */}
            <div className="col-span-4">
              <h4 className="text-white font-bold text-lg mb-4">Kontakta</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:info@klosslabbet.se" 
                    className="text-sm transition-colors"
                    style={{color: 'white', textDecoration: 'none'}}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = '#FCD34D';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = 'white';
                    }}
                  >
                    Mejla oss: info@klosslabbet.se
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+46760070987" 
                    className="text-sm transition-colors"
                    style={{color: 'white', textDecoration: 'none'}}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = '#FCD34D';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = 'white';
                    }}
                  >
                    Ring oss: +46760070987
                  </a>
                </li>
              </ul>
            </div>

            {/* Right side - Newsletter (3 columns) */}
            <div className="col-span-3">
              <NewsletterSignup />
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-blue-400 mt-8 pt-6">
            <div className="flex justify-between items-center">
              {/* Logo and Social Media */}
              <div className="flex items-center gap-8">
                <FooterLogo shop={header.shop as any} />
                <SocialMedia />
              </div>

              {/* Copyright */}
              <div className="text-white text-sm">
                Klosslabbet.se drivs av STHLM Toys och Games AB, Org.nr 559517-5646, Momsreg.nr SE559517564601 Filgränd 8, 13738 Västerhaninge
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="px-4 py-6">
          {/* Newsletter signup at top */}
          <div className="mb-8">
            <NewsletterSignup isMobile />
          </div>

          {/* Footer sections layout - 2x2 grid */}
          <div className="mb-8">
            {/* First row: Support and Mitt konto */}
            <Suspense fallback={<FooterLinksFallback />}>
              <Await resolve={footerPromise}>
                {(footer) => (
                  <FooterLinks
                    menu={footer?.menu}
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                    isMobile
                  />
                )}
              </Await>
            </Suspense>

            {/* Second row: Kontakta and Hitta oss på */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* Kontakta section */}
              <div>
                <h4 className="text-white font-bold text-lg mb-3">Kontakta</h4>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="mailto:info@klosslabbet.se" 
                      className="text-sm transition-colors"
                      style={{color: 'white', textDecoration: 'none'}}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = '#FCD34D';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = 'white';
                      }}
                    >
                      Mejla oss: info@klosslabbet.se
                    </a>
                  </li>
                  <li>
                    <a 
                      href="tel:+46760070987" 
                      className="text-sm transition-colors"
                      style={{color: 'white', textDecoration: 'none'}}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = '#FCD34D';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = 'white';
                      }}
                    >
                      Ring oss: +46760070987
                    </a>
                  </li>
                </ul>
              </div>

              {/* Hitta oss på section */}
              <div>
                <h4 className="text-white font-bold text-lg mb-3">Hitta oss på</h4>
                <SocialMedia isMobile />
              </div>
            </div>
          </div>

          {/* Payment Icons - Mobile */}
          <div className="mt-8">
            <PaymentIcons />
          </div>

          {/* Logo and copyright */}
          <div className="text-center mt-8">
            <div className="mb-4 flex justify-center">
              <FooterLogo shop={header.shop as any} />
            </div>
            <div className="text-white text-sm">
              Klosslabbet.se drivs av STHLM Toys och Games AB, Org.nr 559517-5646, Momsreg.nr SE559517564601 Filgränd 8, 13738 Västerhaninge
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinksFallback() {
  const fallbackSections = [{id: 'loading-1'}, {id: 'loading-2'}];

  const fallbackItems = [
    {id: 'item-1'},
    {id: 'item-2'},
    {id: 'item-3'},
    {id: 'item-4'},
  ];

  return (
    <div className="grid grid-cols-2 gap-8">
      {fallbackSections.map((section) => (
        <div key={section.id} className="space-y-3">
          <div className="h-6 bg-white/20 rounded w-20 animate-pulse"></div>
          <div className="space-y-2">
            {fallbackItems.map((item) => (
              <div
                key={`${section.id}-${item.id}`}
                className="h-4 bg-white/10 rounded w-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export {Footer as default};