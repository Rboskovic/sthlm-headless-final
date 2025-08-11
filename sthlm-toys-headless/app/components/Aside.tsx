// FILE: app/components/Aside.tsx
// ✅ FINAL: Swedish translation with wider cart

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { X, ShoppingCart } from "lucide-react";

type AsideType = "search" | "cart" | "mobile" | "closed";
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * En sidopanel-komponent med överlägg
 * @example
 * ```jsx
 * <Aside type="search" heading="SÖK">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const { type: activeType, close } = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        "keydown",
        function handler(event: KeyboardEvent) {
          if (event.key === "Escape") {
            close();
          }
        },
        { signal: abortController.signal }
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? "expanded" : ""}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside>
        {/* Förbättrad header för att matcha skärmbilder */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            {/* Kundvagnsikon för kundvagnstyp */}
            {type === 'cart' && (
              <ShoppingCart size={20} className="text-gray-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{heading}</h3>
          </div>
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
            onClick={close} 
            aria-label="Stäng"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>("closed");

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType("closed"),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error("useAside must be used within an AsideProvider");
  }
  return aside;
}