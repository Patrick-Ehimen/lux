import React from "react";

import { NetWorthCardProps } from "../../types/type";

const NetWorthCard: React.FC<NetWorthCardProps> = ({
  netWorth,
  loading,
  error,
}) => {
  const formatCurrency = (value: string) => {
    if (!value) return "$0.00";

    const numValue = parseFloat(value);

    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(2)}K`;
    } else {
      return `$${numValue.toFixed(2)}`;
    }
  };

  if (loading && !netWorth) {
    return (
      <div className="bg-dex-bg-secondary rounded-lg p-6 mb-4 animate-pulse">
        <div className="h-8 bg-dex-bg-tertiary rounded w-2/3 mb-4"></div>
        <div className="h-12 bg-dex-bg-tertiary rounded w-1/2"></div>
      </div>
    );
  }

  if (error && !netWorth) {
    return (
      <div className="bg-dex-bg-secondary rounded-lg p-6 mb-4">
        <div className="text-dex-red">{error}</div>
      </div>
    );
  }

  if (!netWorth) {
    return (
      <div className="bg-dex-bg-secondary rounded-lg p-6 mb-4">
        <div className="text-dex-text-secondary">Wallet data not available</div>
      </div>
    );
  }

  return (
    <div className="bg-dex-bg-secondary rounded-lg p-6 mb-4">
      <h2 className="text-dex-text-secondary text-sm mb-1">TOTAL NET WORTH</h2>
      <div className="text-3xl font-bold mb-4">
        {formatCurrency(netWorth.total_networth_usd)}
      </div>

      {netWorth.chains && netWorth.chains.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {netWorth.chains.map((chain) => (
            <div
              key={chain.chain}
              className="bg-dex-bg-tertiary rounded-lg p-3"
            >
              <div className="flex items-center mb-1">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center mr-2"
                  style={{
                    backgroundColor: getChainColor(chain.chain),
                  }}
                >
                  <img
                    src={getChainIcon(chain.chain)}
                    alt={chain.chain}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs font-medium uppercase">
                  {chain.chain}
                </div>
              </div>
              <div className="text-lg font-medium">
                {formatCurrency(chain.networth_usd)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getChainIcon = (chainId: string) => {
  const chainMap = {
    eth: "ethereum",
    "0x1": "ethereum",
    solana: "solana",
    bsc: "binance",
    "0x38": "binance",
    polygon: "polygon",
    "0x89": "polygon",
    base: "base",
    "0x2105": "base",
    arbitrum: "arbitrum",
    "0xa4b1": "arbitrum",
    optimism: "optimism",
    "0xa": "optimism",
    linea: "linea",
    "0xe708": "linea",
    fantom: "fantom",
    "0xfa": "fantom",
    pulse: "pulse",
    "0x171": "pulse",
    ronin: "ronin",
    "0x7e4": "ronin",
    avalanche: "avalanche",
    "0xa86a": "avalanche",
  };

  const chain = chainMap[chainId as keyof typeof chainMap] || "generic";
  return `/images/chains/${chain}.svg`;
};

const getChainColor = (chainId: string) => {
  const colorMap = {
    eth: "#627EEA",
    bsc: "#F3BA2F",
    polygon: "#8247E5",
    arbitrum: "#28A0F0",
    avalanche: "#E84142",
    optimism: "#FF0420",
    base: "#0052FF",
    fantom: "#1969FF",
  };

  return colorMap[chainId as keyof typeof colorMap] || "#888888";
};

export default NetWorthCard;
