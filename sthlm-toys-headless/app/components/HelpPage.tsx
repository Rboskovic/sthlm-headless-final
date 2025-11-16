import {useState} from 'react';
import {ChevronDown, ChevronUp, Mail, Phone} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface HelpPageProps {
  helpPage?: {
    id: string;
    title: string;
    body: string;
    metafields?: Array<{
      key: string;
      value: string;
      type: string;
    }> | null;
  } | null;
  contactInfo?: {
    id: string;
    name: string;
    metafields?: Array<{
      key: string;
      value: string;
    }> | null;
  } | null;
}

// Updated FAQ data in Swedish with focus on returns, refunds, and exchanges
const fallbackFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Hur går en retur till?',
    answer:
      'Kontakta oss först på info@klosslabbet.se med ditt ordernummer och beskriv varför du vill returnera. Vi skickar då returinstruktioner och returetikett. Du har 14 dagars ångerrätt från det att du mottagit varan. Varan ska vara oanvänd och i originalförpackning. För LEGO®-set måste ytterkartongen vara obruten.',
  },
  {
    id: 'faq-2',
    question: 'Hur lång tid tar en återbetalning?',
    answer:
      'Återbetalning sker normalt inom 10 arbetsdagar efter att vi mottagit och godkänt returen, dock alltid senast 14 dagar enligt lag. Pengarna återbetalas automatiskt till samma betalmetod som användes vid köpet (kort, Klarna, PayPal, Shop Pay, etc.). Det kan ta ytterligare 3-10 dagar innan pengarna syns på ditt konto, beroende på din banks handläggningstid.',
  },
  {
    id: 'faq-3',
    question: 'Kan jag byta min produkt?',
    answer:
      'Vi erbjuder för närvarande inte produktbyten. Om du vill ha en annan storlek, färg eller produkt - gör en retur av originalordern och lägg en ny beställning för önskad produkt. Så får du rätt produkt snabbast: lägg först en ny beställning för produkten du vill ha, och initiera sedan returen för originalprodukten.',
  },
  {
    id: 'faq-4',
    question: 'Vad händer om jag får fel eller skadad vara?',
    answer:
      'Kontakta oss direkt på info@klosslabbet.se med foto på skadan och ditt ordernummer. Vi skickar antingen en ersättningsprodukt utan kostnad, eller återbetalar hela beloppet inklusive frakt. Du behöver normalt inte returnera den skadade varan. Vi står alltid för returfrakt vid defekta produkter eller om du fått fel vara.',
  },
  {
    id: 'faq-5',
    question: 'Vad ingår i fri frakt?',
    answer:
      'Vid beställningar över 799 kr är frakt till utlämningsställe kostnadsfri inom Sverige (annars 59 kr). Hemleverans kostar alltid 139kr oavsett ordervärde. Leveranstiden är 2–7 arbetsdagar. Beställ innan kl. 12:00 måndag–fredag så hanterar vi din order samma dag.',
  },
  {
    id: 'faq-6',
    question: 'Hur kommer jag igång med att handla?',
    answer:
      'Att handla hos oss är enkelt! Hitta dina favoritprodukter, lägg dem i varukorgen och gå vidare till kassan. Du kan slutföra ditt köp som gäst eller välja att skapa ett konto. Genom att registrera dig får du möjlighet att följa din orderhistorik, spara produkter i önskelistan och få en snabbare kassaupplevelse nästa gång.',
  },
];

// Helper function to get metafield value
function getMetafieldValue(
  metafields: Array<{key: string; value: string}> | null | undefined,
  key: string,
): string | null {
  if (!metafields) return null;
  const metafield = metafields.find((m) => m.key === key);
  return metafield ? metafield.value : null;
}

// Helper function to parse FAQ data from metafield
function parseFAQData(faqMetafield: string | null): FAQ[] {
  if (!faqMetafield) return fallbackFAQs;

  try {
    const parsed = JSON.parse(faqMetafield);
    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => ({
        id: (item as any).id || `faq-${index + 1}`,
        question: (item as any).question || '',
        answer: (item as any).answer || '',
      }));
    }
  } catch (error) {
    console.error('Failed to parse FAQ data:', error);
  }

  return fallbackFAQs;
}

export function HelpPage({helpPage, contactInfo}: HelpPageProps) {
  const [openFAQ, setOpenFAQ] = useState<string | null>('faq-1'); // First FAQ open by default

  // Parse FAQ data from metafields or use fallback
  const faqData = getMetafieldValue(helpPage?.metafields, 'faq_items');
  const faqs = parseFAQData(faqData);

  // Get contact information from metafields or use fallback
  const supportEmail =
    getMetafieldValue(contactInfo?.metafields, 'support_email') ||
    'info@klosslabbet.se';
  const supportPhone =
    getMetafieldValue(contactInfo?.metafields, 'support_phone') ||
    '+46760070987';

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container */}
      <div
        className="mx-auto"
        style={{
          width: '1272px',
          maxWidth: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}
      >
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1
            className="text-black font-medium mb-4"
            style={{
              fontSize: '48px',
              fontWeight: 600,
              lineHeight: '57.6px',
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              color: 'rgb(32, 34, 35)',
            }}
          >
            {helpPage?.title || 'Hjälp & FAQ'}
          </h1>

          {helpPage?.body && (
            <div
              className="text-gray-600 max-w-2xl mx-auto text-center"
              style={{
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: '24.3px',
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
              dangerouslySetInnerHTML={{__html: helpPage.body}}
            />
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2
            className="text-black font-medium mb-8"
            style={{
              fontSize: '32px',
              fontWeight: 600,
              lineHeight: '38.4px',
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              color: 'rgb(32, 34, 35)',
              textAlign: 'center',
            }}
          >
            Vanliga frågor
          </h2>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
                style={{
                  borderRadius: '12px',
                  border: '1px solid rgb(229, 231, 235)',
                }}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                  style={{
                    padding: '18px',
                    backgroundColor:
                      openFAQ === faq.id ? 'rgb(249, 250, 251)' : 'white',
                  }}
                >
                  <span
                    className="font-medium text-black"
                    style={{
                      fontSize: '18px',
                      fontWeight: 500,
                      lineHeight: '24.3px',
                      fontFamily:
                        "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                      color: 'rgb(32, 34, 35)',
                    }}
                  >
                    {faq.question}
                  </span>
                  {openFAQ === faq.id ? (
                    <ChevronUp
                      size={24}
                      className="text-gray-500 flex-shrink-0 ml-4"
                    />
                  ) : (
                    <ChevronDown
                      size={24}
                      className="text-gray-500 flex-shrink-0 ml-4"
                    />
                  )}
                </button>

                {/* Answer Content */}
                {openFAQ === faq.id && (
                  <div
                    className="px-6 pb-6 bg-gray-50"
                    style={{
                      padding: '0 18px 18px 18px',
                      backgroundColor: 'rgb(249, 250, 251)',
                    }}
                  >
                    <p
                      className="text-gray-700"
                      style={{
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '21.6px',
                        fontFamily:
                          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                        color: 'rgb(55, 65, 81)',
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-black font-medium mb-8"
            style={{
              fontSize: '32px',
              fontWeight: 600,
              lineHeight: '38.4px',
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              color: 'rgb(32, 34, 35)',
              textAlign: 'center',
            }}
          >
            Behöver du mer hjälp?
          </h2>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Card */}
            <div
              className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-200"
              style={{
                borderRadius: '12px',
                border: '1px solid rgb(229, 231, 235)',
                padding: '40px 28px',
              }}
            >
              <div
                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  backgroundColor: 'rgb(219, 234, 254)',
                  width: '64px',
                  height: '64px',
                  marginBottom: '24px',
                }}
              >
                <Mail size={32} className="text-blue-600" />
              </div>

              <h3
                className="font-medium text-black mb-4"
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: '28.8px',
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: 'rgb(32, 34, 35)',
                  marginBottom: '16px',
                }}
              >
                Mejla oss
              </h3>

              <p
                className="text-gray-600 mb-6"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '21.6px',
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  marginBottom: '24px',
                }}
              >
                Skicka dina frågor till oss så svarar vi inom 24 timmar
              </p>

              <a
                href={`mailto:${supportEmail}`}
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium"
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  backgroundColor: 'rgb(37, 99, 235)',
                  borderRadius: '9999px',
                  padding: '12px 32px',
                  textDecoration: 'none',
                  color: 'white',
                }}
              >
                {supportEmail}
              </a>
            </div>

            {/* Phone Card */}
            <div
              className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-200"
              style={{
                borderRadius: '12px',
                border: '1px solid rgb(229, 231, 235)',
                padding: '40px 28px',
              }}
            >
              <div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  backgroundColor: 'rgb(220, 252, 231)',
                  width: '64px',
                  height: '64px',
                  marginBottom: '24px',
                }}
              >
                <Phone size={32} className="text-green-600" />
              </div>

              <h3
                className="font-medium text-black mb-4"
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: '28.8px',
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  color: 'rgb(32, 34, 35)',
                  marginBottom: '16px',
                }}
              >
                Ring oss
              </h3>

              <p
                className="text-gray-600 mb-6"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '21.6px',
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  marginBottom: '24px',
                }}
              >
                Vårt team finns tillgängligt måndag-fredag 9:00-17:00
              </p>

              <a
                href={`tel:${supportPhone}`}
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors duration-200 font-medium"
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  fontFamily:
                    "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                  backgroundColor: 'rgb(22, 163, 74)',
                  borderRadius: '9999px',
                  padding: '12px 32px',
                  textDecoration: 'none',
                  color: 'white',
                }}
              >
                {supportPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}