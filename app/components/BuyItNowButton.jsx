import { useState } from "react";
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
*   buyIt?:string;
* }}
*/
export function BuyItNowButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  style = {},
  className = "",
  buyIt,
}) {
  const [alertVisible, setAlertVisible] = useState(false);
  const productId = buyIt?.match(/(\d+)/)?.[0];

  const handleBuyNow = () => {
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 2000);
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
              window.location.href = `https://0jy3vv-zc.myshopify.com/cart/${productId}:1`;
            }}
            disabled={disabled ?? fetcher.state !== "idle"}
            className={`bg-black text-white px-6 py-3 rounded-lg font-bold ${className}`}
            style={style}
          >
            {children}
          </button>

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