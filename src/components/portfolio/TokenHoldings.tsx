import React from "react";
import { useNavigate } from "react-router-dom";

interface TokenHoldingsProps {
  tokens: any[];
  loading: boolean;
  error: string | null | undefined;
  onTokenClick: (token: any, chain: string) => void;
  selectedChain: string;
}

const TokenHoldings: React.FC<TokenHoldingsProps> = ({
  tokens,
  loading,
  error,
  onTokenClick,
  selectedChain,
}) => {
  // Format currency for display
  const formatCurrency = (value: any) => {
    if (!value && value !== 0) return "$0.00";

    const numValue = parseFloat(value);

    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(2)}K`;
    } else {
      return `$${numValue.toFixed(2)}`;
    }
  };

  // Format token amount
  const formatTokenAmount = (amount: any, decimals = 18) => {
    if (!amount) return "0";

    const formattedAmount = parseFloat(amount) / Math.pow(10, decimals);

    if (formattedAmount < 0.00001) {
      return formattedAmount.toExponential(2);
    } else if (formattedAmount < 1) {
      return formattedAmount.toFixed(6);
    } else if (formattedAmount < 10000) {
      return formattedAmount.toFixed(4);
    } else {
      return formattedAmount.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
    }
  };

  // Format percentage change
  const formatPercentChange = (value: any) => {
    if (!value && value !== 0) return "-";
    return (value >= 0 ? "+" : "") + value.toFixed(2) + "%";
  };

  if (loading && tokens.length === 0) {
    return (
      <div className="bg-dex-bg-secondary rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-dex-bg-tertiary rounded w-1/4 mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center mb-4">
            <div className="w-10 h-10 bg-dex-bg-tertiary rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-dex-bg-tertiary rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-dex-bg-tertiary rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && tokens.length === 0) {
    return (
      <div className="bg-dex-bg-secondary rounded-lg p-6">
        <div className="text-dex-red">{error}</div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="bg-dex-bg-secondary rounded-lg p-6 text-center">
        <p className="text-dex-text-secondary">
          No tokens found for this wallet
          {selectedChain !== "all" && ` on ${selectedChain.toUpperCase()}`}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-dex-bg-secondary rounded-lg overflow-hidden">
      <div className="p-4 border-b border-dex-border">
        <h2 className="font-medium">Token Holdings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs text-dex-text-secondary uppercase border-b border-dex-border">
            <tr>
              <th className="p-3 text-left">Token</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">24h</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-right">Value</th>
              <th className="p-3 text-right">Portfolio %</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr
                key={token.token_address}
                className="border-b border-dex-border hover:bg-dex-bg-tertiary cursor-pointer"
                onClick={() =>
                  onTokenClick(
                    token,
                    selectedChain === "all"
                      ? token.chain || "eth"
                      : selectedChain
                  )
                }
              >
                <td className="p-3">
                  <div className="flex items-center">
                    <img
                      src={
                        token.logo ||
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg=="
                      }
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full mr-3"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
                      }}
                    />
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-dex-text-secondary">
                        {token.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-right">
                  ${parseFloat(token.usd_price).toFixed(8)}
                </td>
                <td
                  className={`p-3 text-right ${
                    token.usd_price_24hr_percent_change >= 0
                      ? "text-dex-green"
                      : "text-dex-red"
                  }`}
                >
                  {formatPercentChange(token.usd_price_24hr_percent_change)}
                </td>
                <td className="p-3 text-right">
                  {formatTokenAmount(token.balance, token.decimals)}
                </td>
                <td className="p-3 text-right font-medium">
                  {formatCurrency(token.usd_value)}
                </td>
                <td className="p-3 text-right">
                  {token.portfolio_percentage?.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenHoldings;
