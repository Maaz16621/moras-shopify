import { useState } from "react";
import { CartForm } from "@shopify/hydrogen";
import { useRouteLoaderData } from '@remix-run/react';
/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 *   style?: React.CSSProperties;
 *   className?: string;
 * }}
 */
export function BuyItButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  style = {}, // Allow custom inline styles
  className = "", // Allow custom class names
}) {
  const [alertVisible, setAlertVisible] = useState(false);
  const data = useRouteLoaderData('root');
  console.log(data);
  const checkoutUrl = data.consent.checkoutDomain;
  console.log(checkoutUrl);
  const handleBuyNow = () => {
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 2000);
    window.location.href = checkoutURL;
  };

  return (
    <CartForm
      route="/cart"
      inputs={{ lines }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={(e) => {
              onClick;
              handleBuyNow();
             
            }}
            disabled={disabled ?? fetcher.state !== "idle"}
            className={`bg-black text-white px-6 py-3 rounded-lg font-bold ${className}`}
            style={style}
          >
            {children}
          </button>

          {/* Custom Alert */}
          {alertVisible && (
            <div
              className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 mt-10 bg-[#7A0202] text-white py-2 px-4 rounded shadow-lg text-center w-full max-w-xs transition-opacity opacity-100 duration-300 ease-in-out"
              style={{
                animation: "fadeIn 0.5s, fadeOut 1s 1.5s forwards",
              }}
            >
              Redirecting to checkout...
            </div>
          )}
        </>
      )}
    </CartForm>
  );
}

/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
