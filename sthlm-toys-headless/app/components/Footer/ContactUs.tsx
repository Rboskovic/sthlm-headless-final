// FILE: app/components/Footer/ContactUs.tsx
// ✅ UPDATED: Force white color with !important to override any global styles

export function ContactUs() {
  return (
    <div className="text-white text-sm space-y-2">
      <h3 className="font-semibold text-base">Kontakta</h3>
      <p>
        Mejla oss:{' '}
        <a href="mailto:info@klosslabbet.se" className="!text-white underline hover:text-yellow-300">
          info@klosslabbet.se
        </a>
      </p>
      <p>
        Ring oss:{' '}
        <a href="tel:+46760070987" className="!text-white underline hover:text-yellow-300">
          +46760070987
        </a>
      </p>
      <p className="text-xs text-white/80 pt-1">
        Måndag–Fredag: 09:00–17:00
      </p>
    </div>
  );
}