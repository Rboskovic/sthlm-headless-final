// FILE: app/components/Footer/ContactUs.tsx
// ✅ FIXED: Exact DOM structure match with FooterLinks for proper alignment

export function ContactUs() {
  return (
    <div>
      <h4 className="text-white font-bold text-lg mb-4">Kontakta</h4>
      <ul className="space-y-2">
        <li>
          <div className="flex items-center gap-2 text-sm" style={{color: 'white'}}>
            Mejla oss:{' '}
            <a 
              href="mailto:info@klosslabbet.se" 
              className="transition-colors"
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
          </div>
        </li>
        <li>
          <div className="flex items-center gap-2 text-sm" style={{color: 'white'}}>
            Ring oss:{' '}
            <a 
              href="tel:+46760070987" 
              className="transition-colors"
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
          </div>
        </li>
        <li>
          <div className="flex items-center gap-2 text-sm" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
            Måndag–Fredag: 09:00–17:00
          </div>
        </li>
      </ul>
    </div>
  );
}