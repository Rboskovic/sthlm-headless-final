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
        <div className="max-w-[1272px] mx-auto px-3 py-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Left side - Footer Links (7 columns) - adjusted for 2 column layout */}
            <div className="col-span-7">
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

            {/* Right side - Newsletter (5 columns) */}
            <div className="col-span-5">
              <NewsletterSignup />
            </div>
          </div>

          {/* ✅ NEW: Payment Methods Section */}
          <Suspense fallback={<PaymentIconsFallback />}>
            <Await resolve={footerPromise}>
              {(footer) => (
                <div className="border-t border-blue-400 mt-8 pt-6 mb-6">
                  {footer?.shop?.paymentSettings?.acceptedCardBrands && (
                    <PaymentIcons 
                      acceptedCardBrands={footer.shop.paymentSettings.acceptedCardBrands}
                    />
                  )}
                </div>
              )}
            </Await>
          </Suspense>

          {/* Bottom section */}
          <div className="border-t border-blue-400 pt-6">
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

          {/* Footer links with custom mobile layout - both columns side by side */}
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

          {/* ✅ NEW: Payment Methods Section - Mobile */}
          <Suspense fallback={<PaymentIconsFallback />}>
            <Await resolve={footerPromise}>
              {(footer) => (
                <div className="border-t border-blue-400 mt-8 pt-6 mb-6">
                  {footer?.shop?.paymentSettings?.acceptedCardBrands && (
                    <PaymentIcons 
                      acceptedCardBrands={footer.shop.paymentSettings.acceptedCardBrands}
                      isMobile
                    />
                  )}
                </div>
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
              © 2025 STHLM Toys &amp; Games AB. Alla rättigheter förbehållna.
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

// ✅ NEW: Payment icons loading fallback
function PaymentIconsFallback() {
  return (
    <div className="text-center">
      <h3 className="text-white text-lg font-semibold mb-4">Our payment methods</h3>
      <div className="flex items-center justify-center gap-3">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white/20 rounded-lg h-12 w-16 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export {Footer as default};