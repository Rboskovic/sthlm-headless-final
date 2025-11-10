// FILE: app/components/Footer/ContactUs.tsx
// ✅ FIXED: Matches FooterLinks styling exactly with inline styles

export function ContactUs() {
  return (
    <div>
      <h4 className="text-white font-bold text-lg mb-4">Kontakta</h4>
      <ul className="space-y-2">
        <li>
          <span className="text-sm" style={{color: 'white'}}>
            Mejla oss:{' '}
            <a 
              href="mailto:info@klosslabbet.se" 
              className="underline transition-colors text-sm"
              style={{color: 'white', textDecoration: 'underline'}}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#FCD34D';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'white';
              }}
            >
              info@klosslabbet.se
            </a>
          </span>
        </li>
        <li>
          <span className="text-sm" style={{color: 'white'}}>
            Ring oss:{' '}
            <a 
              href="tel:+46760070987" 
              className="underline transition-colors text-sm"
              style={{color: 'white', textDecoration: 'underline'}}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#FCD34D';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'white';
              }}
            >
              +46760070987
            </a>
          </span>
        </li>
        <li>
          <span className="text-xs" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
            Måndag–Fredag: 09:00–17:00
          </span>
        </li>
      </ul>
    </div>
  );
}