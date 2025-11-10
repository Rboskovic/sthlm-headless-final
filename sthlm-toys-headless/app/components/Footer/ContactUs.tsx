// FILE: app/components/Footer/ContactUs.tsx
// ✅ UPDATED: Added phone number per user request

export function ContactUs() {
  return (
    <div className="text-white text-sm space-y-2">
      <h3 className="font-semibold text-base">Kontakta</h3>
      <p>
        Mejla oss:{' '}
        <a href="mailto:info@klosslabbet.se" className="underline hover:text-yellow-300">
          info@klosslabbet.se
        </a>
      </p>
      <p>
        Ring oss:{' '}
        <a href="tel:+46760070987" className="underline hover:text-yellow-300">
          +46760070987
        </a>
      </p>
    </div>
  );
}