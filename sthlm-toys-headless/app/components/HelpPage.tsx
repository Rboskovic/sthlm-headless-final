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

// Fallback FAQ data in Swedish
const fallbackFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Hur kommer jag igång?',
    answer:
      'När du registrerar dig får du tillgång till vårt fullständiga sortiment av leksaker och spel. Som inloggad medlem får du också tillgång till specialerbjudanden och personlig kundservice.',
  },
  {
    id: 'faq-2',
    question: 'Vad ingår i gratis frakt?',
    answer:
      'Vi erbjuder fri frakt till ombud på beställningar över 1299 kr inom Sverige (kostnad 59 kr för beställningar under 1299 kr). Hemleverans kostar alltid 139 kr. Leveranstiden är vanligtvis 2-7 arbetsdagar.',
  },
  {
    id: 'faq-3',
    question: 'Hur avbokar jag mitt medlemskap?',
    answer:
      'Du kan avboka ditt medlemskap när som helst genom att logga in på ditt konto och gå till "Kontoinställningar". Där hittar du alternativet att avsluta ditt medlemskap.',
  },
  {
    id: 'faq-4',
    question: 'Hur överför jag mitt medlemskap till ett annat konto?',
    answer:
      'Kontakta vår kundservice på info@klosslabbet.se så hjälper vi dig att överföra ditt medlemskap till ett nytt konto. Vi behöver verifiering av båda kontona.',
  },
  {
    id: 'faq-5',
    question: 'Vad är returpolicyn?',
    answer:
      'Vi erbjuder 14 dagars öppet köp på alla produkter. Produkterna ska vara oanvända och i originalförpackning. Kontakta kundservice för att initiera en retur.',
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
    '+46 8 123 456 78';

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