// FILE: app/components/Aside.tsx
// ✅ UPDATED: Cart title color changed to white on blue background + Click outside to close

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

  // Different header styles for cart vs other types
  const isCart = type === 'cart';
  
  return (
    <div
      aria-modal
      className={`overlay ${expanded ? "expanded" : ""}`}
      role="dialog"
      onClick={close} // ✅ NEW: Click outside to close
    >
      <aside onClick={(e) => e.stopPropagation()}> {/* ✅ NEW: Prevent closing when clicking inside */}
        {/* ✅ FIXED: Cart header with blue background and white text */}
        <header 
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isCart 
              ? 'bg-blue-600 border-blue-500' // Blue background for cart
              : 'bg-white border-gray-200'    // White background for others
          }`}
        >
          <div className="flex items-center gap-2">
            {/* Cart icon for cart type */}
            {isCart && (
              <ShoppingCart size={20} className="text-white" />
            )}
            <h3 className={`text-lg font-semibold ${
              isCart 
                ? 'text-white'      // White text for cart
                : 'text-gray-900'   // Dark text for others
            }`}>
              {heading}
            </h3>
          </div>
          <button 
            className={`p-2 rounded-lg transition-colors ${
              isCart 
                ? 'hover:bg-blue-700 text-white'        // White icon, darker blue hover for cart
                : 'hover:bg-gray-100 text-gray-600'     // Gray for others
            }`}
            onClick={close} 
            aria-label="Stäng"
          >
            <X size={20} className={isCart ? 'text-white' : 'text-gray-600'} />
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