import {Suspense} from 'react';
import {Await} from 'react-router';
import {NewsletterSignup} from './NewsletterSignup';
import {FooterLinks} from './FooterLinks';
import {SocialMedia} from './SocialMedia';
import {FooterLogo} from './FooterLogo';
import {PaymentIcons} from './PaymentIcons';
import {ContactUs} from './ContactUs';
import type {FooterProps} from './types';

// Helper to extract field value from metaobject
function getFieldValue(
  fields: Array<{key: string; value: string}> | undefined,
  key: string
): string | null {
  if (!fields) return null;
  const field = fields.find((f) => f.key === key);
  return field?.value || null;
}

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
              <Suspense fallback={<ContactUsFallback />}>
                <Await resolve={footerPromise}>
                  {(footer) => {
                    const settings = footer?.footerSettings?.nodes?.[0];
                    const fields = settings?.fields || [];
                    
                    return (
                      <ContactUs
                        email={getFieldValue(fields, 'email')}
                        phone={getFieldValue(fields, 'broj_telefona')}
                        workingHours={getFieldValue(fields, 'radno_vreme')}
                      />
                    );
                  }}
                </Await>
              </Suspense>
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
                <Suspense fallback={<div className="h-6 w-32 bg-white/10 animate-pulse rounded" />}>
                  <Await resolve={footerPromise}>
                    {(footer) => {
                      const settings = footer?.footerSettings?.nodes?.[0];
                      const fields = settings?.fields || [];
                      
                      return (
                        <SocialMedia
                          facebookUrl={getFieldValue(fields, 'facebook_url')}
                          instagramUrl={getFieldValue(fields, 'instagram_url')}
                          youtubeUrl={getFieldValue(fields, 'youtube_url')}
                          tiktokUrl={getFieldValue(fields, 'tiktok_url')}
                        />
                      );
                    }}
                  </Await>
                </Suspense>
              </div>

              {/* Copyright */}
              <div className="text-white text-sm">
                <Suspense fallback="Klosslabbet.se drivs av STHLM Toys och Games AB, Org.nr 559517-5646, Momsreg.nr SE559517564601 Filgränd 8, 13738 Västerhaninge">
                  <Await resolve={footerPromise}>
                    {(footer) => {
                      const settings = footer?.footerSettings?.nodes?.[0];
                      const fields = settings?.fields || [];
                      const companyInfo = getFieldValue(fields, 'informacije_o_kompaniji');
                      
                      return companyInfo || 'Klosslabbet.se drivs av STHLM Toys och Games AB, Org.nr 559517-5646, Momsreg.nr SE559517564601 Filgränd 8, 13738 Västerhaninge';
                    }}
                  </Await>
                </Suspense>
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
              <Suspense fallback={<ContactUsFallback />}>
                <Await resolve={footerPromise}>
                  {(footer) => {
                    const settings = footer?.footerSettings?.nodes?.[0];
                    const fields = settings?.fields || [];
                    
                    return (
                      <ContactUs
                        email={getFieldValue(fields, 'email')}
                        phone={getFieldValue(fields, 'broj_telefona')}
                        workingHours={getFieldValue(fields, 'radno_vreme')}
                      />
                    );
                  }}
                </Await>
              </Suspense>

              {/* Hitta oss på section */}
              <div>
                <h4 className="text-white font-bold text-lg mb-3">Hitta oss på</h4>
                <Suspense fallback={<div className="h-6 bg-white/10 animate-pulse rounded" />}>
                  <Await resolve={footerPromise}>
                    {(footer) => {
                      const settings = footer?.footerSettings?.nodes?.[0];
                      const fields = settings?.fields || [];
                      
                      return (
                        <SocialMedia
                          facebookUrl={getFieldValue(fields, 'facebook_url')}
                          instagramUrl={getFieldValue(fields, 'instagram_url')}
                          youtubeUrl={getFieldValue(fields, 'youtube_url')}
                          tiktokUrl={getFieldValue(fields, 'tiktok_url')}
                          isMobile
                        />
                      );
                    }}
                  </Await>
                </Suspense>
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
              <Suspense fallback="Klosslabbet.se drivs av STHLM Toys och Games AB, Org.nr 559517-5646, Momsreg.nr SE559517564601 Filgränd 8, 13738 Västerhaninge">
                <Await resolve={footerPromise}>
                  {(footer) => {
                    const settings = footer?.footerSettings?.nodes?.[0];
                    const fields = settings?.fields || [];
                    const companyInfo = getFieldValue(fields, 'informacije_o_kompaniji');
                    
                    return companyInfo || 'Klosslabbet.se drivs av STHLM Toys och Games AB, Org.nr 559517-5646, Momsreg.nr SE559517564601 Filgränd 8, 13738 Västerhaninge';
                  }}
                </Await>
              </Suspense>
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

function ContactUsFallback() {
  return (
    <div className="space-y-3">
      <div className="h-6 bg-white/20 rounded w-24 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-white/10 rounded w-full animate-pulse"></div>
      </div>
    </div>
  );
}

export {Footer as default};