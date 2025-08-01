import {Suspense} from 'react';
import {Await} from 'react-router';
import {NewsletterSignup} from './NewsletterSignup';
import {FooterLinks} from './FooterLinks';
import {SocialMedia} from './SocialMedia';
import {FooterLogo} from './FooterLogo';
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
        <div className="max-w-[1272px] mx-auto px-3 py-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Left side - Footer Links (8 columns) */}
            <div className="col-span-8">
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
            </div>

            {/* Right side - Newsletter (4 columns) */}
            <div className="col-span-4">
              <NewsletterSignup />
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-blue-400 mt-8 pt-6">
            <div className="flex justify-between items-center">
              {/* Logo and Social Media */}
              <div className="flex items-center gap-8">
                <FooterLogo shop={header.shop} />
                <SocialMedia />
              </div>

              {/* Copyright */}
              <div className="text-white text-sm">
                © 2025 STHLM Toys & Games. Alla rättigheter förbehållna.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="px-4 py-8">
          {/* Newsletter signup at top */}
          <div className="mb-8">
            <NewsletterSignup isMobile />
          </div>

          {/* Footer links with custom mobile layout */}
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

          {/* Social media */}
          <div className="mt-8 mb-6">
            <SocialMedia isMobile />
          </div>

          {/* Logo and copyright */}
          <div className="text-center">
            <div className="mb-4">
              <FooterLogo shop={header.shop} />
            </div>
            <div className="text-white text-sm">
              © 2025 STHLM Toys & Games. Alla rättigheter förbehållna.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinksFallback() {
  const fallbackSections = [
    {id: 'loading-1'},
    {id: 'loading-2'},
    {id: 'loading-3'},
  ];

  const fallbackItems = [{id: 'item-1'}, {id: 'item-2'}, {id: 'item-3'}];

  return (
    <div className="grid grid-cols-3 gap-8">
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
