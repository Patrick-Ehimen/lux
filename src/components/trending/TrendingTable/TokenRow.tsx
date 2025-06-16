import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  formatNumber,
  formatAge,
  formatPrice,
} from "../../../utils/formatters";
import { TokenPriceResponse } from "../../../types/type";

const TokenRow = ({
  token,
  rank,
}: {
  token: TokenPriceResponse;
  rank: number;
}) => {
  const navigate = useNavigate();

  const handleTokenClick = () => {
    navigate(`/${token.chainId}/${token.tokenAddress}`, {
      state: {
        tokenData: {
          address: token.tokenAddress,
          name: token.name,
          symbol: token.symbol,
          logo: token.logo,
          decimals: token.decimals,
        },
      },
    });
  };

  const getNestedValue = (obj: any, path: any, defaultValue = 0) => {
    if (!obj) return defaultValue;
    const keys = path.split(".");
    let current = obj;
    for (const key of keys) {
      if (current[key] === undefined || current[key] === null) {
        return defaultValue;
      }
      current = current[key];
    }
    return current;
  };

  return (
    // <tr
    //   onClick={handleTokenClick}
    //   className="cursor-pointer hover:bg-dex-bg-highlight"
    // >
    //   {/* Sticky columns */}
    //   <td className="sticky left-0 z-10 bg-dex-bg-primary px-4 py-3 text-dex-text-tertiary text-center w-8">
    //     {rank}
    //   </td>
    //   <td className="sticky left-44 z-10 bg-dex-bg-primary px-4 py-3 w-36">
    //     <Link
    //       to={`/${token.chainId}/${token.tokenAddress}`}
    //       className="flex items-center"
    //       onClick={(e) => e.stopPropagation()}
    //     >
    //       <div className="flex items-center">
    //         <img
    //           src={token.logo || "/images/tokens/default-token.svg"}
    //           alt={token.symbol}
    //           className="w-8 h-8 rounded-full mr-3 bg-dex-bg-tertiary"
    //           onError={(e) => {
    //             (e.target as HTMLImageElement).onerror = null;
    //             (e.target as HTMLImageElement).src =
    //               "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
    //           }}
    //         />
    //         <div className="">
    //           <div className="font-medium text-dex-text-primary flex items-center">
    //             <span>{token.symbol}</span>
    //             {token.lightning && (
    //               <span className="ml-2 text-yellow-400 text-xs">
    //                 ⚡{token.lightning}
    //               </span>
    //             )}
    //           </div>
    //           <div className="text-xs text-dex-text-secondary">
    //             {token.name}
    //           </div>
    //         </div>
    //       </div>
    //     </Link>
    //   </td>
    //   {/* Scrollable columns */}
    //   <td className="px-4 py-3 text-right">${formatPrice(token.usdPrice)}</td>
    //   <td className="px-4 py-3 text-right text-dex-text-secondary">
    //     {formatAge(token.createdAt * 1000)}
    //   </td>
    //   <td className="px-4 py-3 text-right">
    //     {formatNumber(getNestedValue(token, "transactions.24h", 0))}
    //   </td>
    //   <td className="px-4 py-3 text-right">
    //     ${formatNumber(getNestedValue(token, "totalVolume.24h", 0))}
    //   </td>
    //   <td className="px-4 py-3 text-right">
    //     {formatNumber(
    //       getNestedValue(token, "buyers.24h", 0) +
    //         getNestedValue(token, "sellers.24h", 0)
    //     )}
    //   </td>
    //   <PriceChangeCell value={token.pricePercentChange?.["5m"]} />
    //   <PriceChangeCell value={token.pricePercentChange?.["1h"]} />
    //   <PriceChangeCell value={token.pricePercentChange?.["12h"]} />
    //   <PriceChangeCell value={token.pricePercentChange?.["24h"]} />
    //   <td className="px-4 py-3 text-right">
    //     ${formatNumber(token.liquidityUsd)}
    //   </td>
    //   <td className="px-4 py-3 text-right">${formatNumber(token.marketCap)}</td>
    // </tr>
    <div>13</div>
  );
};

const PriceChangeCell = ({ value }: { value: number }) => (
  <td
    className={`px-4 py-3 text-right ${
      value >= 0 ? "text-green-500" : "text-red-500"
    }`}
  >
    {typeof value === "number"
      ? `${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`
      : "-"}
  </td>
);

export default TokenRow;
