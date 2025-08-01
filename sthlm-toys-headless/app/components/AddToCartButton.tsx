import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {type FetcherWithComponents} from 'react-router';

export function AddToCartButton({
  children,
  lines,
  onClick,
  disabled = false,
  className = '',
  analytics,
  ...props
}: {
  children: React.ReactNode;
  lines: OptimisticCartLineInput[];
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  analytics?: unknown;
  [key: string]: any;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isSubmitting = fetcher.state === 'submitting';

        return (
          <>
            {analytics && (
              <input
                name="analytics"
                type="hidden"
                value={JSON.stringify(analytics)}
              />
            )}
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled || isSubmitting}
              className={`
                w-full flex items-center justify-center gap-2 h-12 px-6 
                text-sm font-semibold text-white rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  disabled || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-900 hover:bg-blue-800 active:bg-blue-950'
                }
                ${className}
              `}
              style={{
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                backgroundColor:
                  disabled || isSubmitting ? '#9ca3af' : '#1e3a8a', // Dark blue like in the mockup
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.025em',
              }}
              {...props}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Lägger till...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h9"
                    />
                  </svg>
                  {children}
                </>
              )}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
