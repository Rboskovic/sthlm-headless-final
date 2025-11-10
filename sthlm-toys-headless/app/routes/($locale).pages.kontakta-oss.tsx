// FILE: app/routes/($locale).pages.kontakta-oss.tsx
// ✅ SHOPIFY NATIVE METAOBJECT APPROACH (Official Hydrogen Standard)
// Reference: https://github.com/juanpprieto/hydrogen-contact-form-metaobject
// Submissions stored directly in Shopify Admin → Content → Metaobjects

import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  data,
} from '@shopify/remix-oxygen';
import {Form, useLoaderData, useActionData, useNavigation} from 'react-router';
import {Mail, Phone, Clock, MapPin, Send} from 'lucide-react';
import {useState} from 'react';
import {SocialMedia} from '~/components/Footer/SocialMedia';

export const meta = () => {
  return [
    {title: 'Kontakta Oss | Klosslabbet'},
    {
      name: 'description',
      content:
        'Har du frågor? Kontakta oss via e-post, telefon eller vårt kontaktformulär. Vi svarar inom 24 timmar.',
    },
  ];
};

type ActionData =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      message: string;
    };

export async function loader({context}: LoaderFunctionArgs) {
  const {shop} = await context.storefront.query(SHOP_CONTACT_QUERY);

  return {
    supportEmail:
      shop.metafields?.find((m) => m?.key === 'support_email')?.value ||
      'info@klosslabbet.se',
    supportPhone:
      shop.metafields?.find((m) => m?.key === 'support_phone')?.value ||
      '+46760070987',
  };
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  // Validation
  if (!name || !email || !message) {
    return data<ActionData>(
      {error: 'Vänligen fyll i alla obligatoriska fält.', success: false},
      {status: 400},
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return data<ActionData>(
      {error: 'Vänligen ange en giltig e-postadress.', success: false},
      {status: 400},
    );
  }

  try {
    const {env} = context;

    // Debug logging
    console.log('🔍 Contact Form Debug:', {
      hasToken: !!env.PRIVATE_ADMIN_API_TOKEN,
      hasVersion: !!env.PRIVATE_ADMIN_API_VERSION,
      tokenPrefix: env.PRIVATE_ADMIN_API_TOKEN?.substring(0, 10),
      version: env.PRIVATE_ADMIN_API_VERSION,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
    });

    // Check for required environment variables
    if (!env.PRIVATE_ADMIN_API_TOKEN || !env.PRIVATE_ADMIN_API_VERSION) {
      throw new Error(
        'Missing PRIVATE_ADMIN_API_TOKEN or PRIVATE_ADMIN_API_VERSION. Please check setup guide.',
      );
    }

    const adminApiUrl = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.PRIVATE_ADMIN_API_VERSION}/graphql.json`;

    console.log('🔍 Admin API URL:', adminApiUrl);

    // GraphQL mutation to create metaobject entry
    const mutation = `
      mutation CreateContactFormEntry($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject {
            id
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      metaobject: {
        type: 'contact_form',
        fields: [
          {key: 'name', value: name},
          {key: 'email', value: email},
          {key: 'phone', value: phone || ''},
          {key: 'subject', value: subject || 'Kontaktformulär'},
          {key: 'message', value: message},
          {key: 'date', value: new Date().toISOString().split('T')[0]},
        ],
      },
    };

    console.log('🔍 Mutation variables:', JSON.stringify(variables, null, 2));

    const response = await fetch(adminApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': env.PRIVATE_ADMIN_API_TOKEN,
      },
      body: JSON.stringify({query: mutation, variables}),
    });

    console.log('🔍 Response status:', response.status);

    const result = (await response.json()) as {
      data?: {
        metaobjectCreate?: {
          metaobject?: {
            id: string;
            handle: string;
          };
          userErrors?: Array<{
            field: string[];
            message: string;
          }>;
        };
      };
      errors?: Array<{
        message: string;
      }>;
    };

    console.log('🔍 Response result:', JSON.stringify(result, null, 2));

    if (result.errors || result.data?.metaobjectCreate?.userErrors?.length) {
      console.error('❌ Metaobject creation error:', result);
      throw new Error(
        result.data?.metaobjectCreate?.userErrors?.[0]?.message ||
          result.errors?.[0]?.message ||
          'Failed to save contact form',
      );
    }

    console.log('✅ Contact form submitted successfully!');

    return data<ActionData>({
      success: true,
      message:
        'Tack för ditt meddelande! Vi återkommer till dig inom 24 timmar.',
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    return data<ActionData>(
      {
        error:
          'Ett fel uppstod när meddelandet skulle skickas. Vänligen försök igen eller kontakta oss direkt via e-post.',
        success: false,
      },
      {status: 500},
    );
  }
}

export default function ContactPage() {
  const {supportEmail, supportPhone} = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  if (actionData?.success && !isSubmitting) {
    setTimeout(() => {
      setFormData({name: '', email: '', phone: '', subject: '', message: ''});
    }, 0);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px'}}>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight" style={{textAlign: 'center !important'}}>
          Kontakta oss
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed" style={{textAlign: 'center !important', maxWidth: '672px', margin: '0 auto'}}>
          Vi finns här för att hjälpa dig med frågor om produkter,
          beställningar och leveranser.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">E-post</h3>
            <p className="text-sm text-gray-600 mb-3">
              Skicka dina frågor direkt till oss
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className="text-blue-600 hover:text-blue-700 font-medium break-all"
            >
              {supportEmail}
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
            <p className="text-sm text-gray-600 mb-3">
              Ring oss under våra öppettider
            </p>
            <a
              href={`tel:${supportPhone}`}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              {supportPhone}
            </a>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Öppettider kundservice
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Måndag–Fredag:</span>
                <span className="font-medium text-gray-900">09:00–17:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lördag–Söndag:</span>
                <span className="font-medium text-gray-900">Stängt</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Vi svarar normalt inom 24 timmar under vardagar.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Företagsinformation
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong className="text-gray-900">
                  Sthlm Toys och Games AB
                </strong>
              </p>
              <p>Org.nr: 559517-5646</p>
              <p>VAT: SE559517564601</p>
              <p className="pt-2">
                Filgränd 8
                <br />
                137 38 Västerhaninge
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Skicka oss ett meddelande
            </h2>
            <p className="text-gray-600 mb-6">
              Fyll i formuläret nedan så återkommer vi så snart som möjligt.
            </p>

            {actionData?.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-600 mt-0.5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-medium text-green-800">
                    {actionData.message}
                  </p>
                </div>
              </div>
            )}

            {actionData && !actionData.success && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-600 mt-0.5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-medium text-red-800">
                    {actionData.error}
                  </p>
                </div>
              </div>
            )}

            <Form method="post" className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Namn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({...formData, name: e.target.value})
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ditt för- och efternamn"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  E-postadress <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({...formData, email: e.target.value})
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="din@email.se"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Telefonnummer <span className="text-gray-400">(valfritt)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({...formData, phone: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+46 70 123 45 67"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ämne <span className="text-gray-400">(valfritt)</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({...formData, subject: e.target.value})
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="T.ex. Fråga om min beställning"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Meddelande <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({...formData, message: e.target.value})
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Beskriv ditt ärende så detaljerat som möjligt..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Genom att skicka detta formulär godkänner du att vi behandlar
                  dina personuppgifter enligt vår{' '}
                  <a
                    href="/pages/integritetspolicy"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    integritetspolicy
                  </a>
                  . Vi använder dina uppgifter endast för att svara på din
                  förfrågan.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Skickar meddelande...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Skicka meddelande</span>
                  </>
                )}
              </button>
            </Form>
          </div>
        </div>
      </div>

      {/* Enhanced Help CTA */}
      <div className="mt-12 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-12 text-white shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-48 h-48 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-3">
            Behöver du hjälp snabbt?
          </h3>
          <p className="text-blue-100 text-lg leading-relaxed" style={{paddingBottom: '32px'}}>
            Kolla våra vanliga frågor för snabba svar på de flesta frågor
          </p>
          
          <a
            href="/pages/hjalp"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold py-4 px-10 rounded-xl hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>Besök vår hjälpsida</span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </a>
          
          {/* Social Media Links */}
          <div className="mt-10 pt-8 border-t border-white/20">
            <p className="text-white/90 text-sm mb-4 font-medium">
              Följ oss på sociala medier
            </p>
            <SocialMedia isMobile={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

const SHOP_CONTACT_QUERY = `#graphql
  query ShopContact($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      id
      name
      metafields(identifiers: [
        {namespace: "custom", key: "support_email"},
        {namespace: "custom", key: "support_phone"}
      ]) {
        key
        value
      }
    }
  }
` as const;