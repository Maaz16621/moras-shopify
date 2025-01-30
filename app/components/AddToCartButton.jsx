import { useState, useEffect } from "react";
import { CartForm } from "@shopify/hydrogen";

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
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  style = {}, // Allow passing custom inline styles
  className = "", // Allow passing custom class names
}) {
  const [alertVisible, setAlertVisible] = useState(false);

  const handleAddToCart = () => {
    // Custom alert logic
    setAlertVisible(true);

    // Hide the alert after 2 seconds
    setTimeout(() => {
      setAlertVisible(false);
    }, 2000);
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
              e.preventDefault();
              handleAddToCart(); // Trigger the custom alert
              fetcher.submit();
              if (onClick) onClick(); // Call the passed onClick handler if any
            }}
            disabled={disabled ?? fetcher.state !== "idle"}
            className={className}
            style={style}
          >
            {children}
          </button>

          {/* Custom Alert with Fade Animation */}
          {alertVisible && (
            <div
              className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 mt-10 bg-[#7A0202] text-white py-2 px-4 rounded shadow-lg text-center w-full max-w-xs transition-opacity opacity-100 duration-300 ease-in-out"
              style={{
                animation: "fadeIn 0.5s, fadeOut 1s 1.5s forwards",
              }}
            >
              Item added to cart!
            </div>
          )}
        </>
      )}
    </CartForm>
  );
}

/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
