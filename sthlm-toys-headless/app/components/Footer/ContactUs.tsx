// FILE: app/components/Footer/ContactUs.tsx
// ✅ UPDATED: Added dynamic props while keeping exact DOM structure

interface ContactUsProps {
  email?: string | null;
  phone?: string | null;
  workingHours?: string | null;
}

export function ContactUs({
  email = 'info@klosslabbet.se',
  phone = '+46760070987',
  workingHours = 'Måndag–Fredag: 09:00–17:00',
}: ContactUsProps) {
  return (
    <div>
      <h4 className="text-white font-bold text-lg mb-4">Kontakta</h4>
      <ul className="space-y-2">
        <li>
          <div className="flex items-center gap-2 text-sm" style={{color: 'white'}}>
            Mejla oss:{' '}
            <a 
              href={`mailto:${email}`}
              className="transition-colors"
              style={{color: 'white', textDecoration: 'underline'}}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#FCD34D';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'white';
              }}
            >
              {email}
            </a>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-2 text-sm" style={{color: 'white'}}>
            Ring oss:{' '}
            <a 
              href={`tel:${phone?.replace(/\s/g, '')}`}
              className="transition-colors"
              style={{color: 'white', textDecoration: 'underline'}}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#FCD34D';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'white';
              }}
            >
              {phone}
            </a>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-2 text-sm" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
            {workingHours}
          </div>
        </li>
      </ul>
    </div>
  );
}