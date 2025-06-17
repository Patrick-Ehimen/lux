// components/token/TokenInfo.js
import React, { useState, useEffect, useRef } from "react";

const API_KEY = process.env.REACT_APP_MORALIS_API_KEY;

interface TokenInfoProps {
  token: any;
  pair: any;
  timeFrame?: string;
  chainId: string;
}

const TokenInfo: React.FC<TokenInfoProps> = ({
  token,
  pair,
  timeFrame,
  chainId,
}) => {
  interface PairStats {
    pricePercentChange?: Record<string, number>;
    buys?: Record<string, number>;
    sells?: Record<string, number>;
    buyVolume?: Record<string, number>;
    sellVolume?: Record<string, number>;
    buyers?: Record<string, number>;
    sellers?: Record<string, number>;
    totalVolume?: Record<string, number>;
    currentUsdPrice?: number;
    currentNativePrice?: number;
    totalLiquidityUsd?: number;
    pairCreated?: string;
    [key: string]: any;
  }

  const [pairStats, setPairStats] = useState<PairStats | null>(null);
  interface TokenMetadata {
    name?: string;
    symbol?: string;
    logo?: string;
    links?: {
      website?: string;
      twitter?: string;
      telegram?: string;
      discord?: string;
      [key: string]: string | undefined;
    };
    categories?: string[];
    fullyDilutedValue?: number;
    fully_diluted_valuation?: number;
    market_cap?: number;
    total_supply_formatted?: string;
    totalSupplyFormatted?: string;
    created_at?: string;
    [key: string]: any;
  }

  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<
    "5m" | "1h" | "4h" | "24h"
  >("24h");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isSolana, setIsSolana] = useState(false);

  // Block explorer URLs by chain
  const blockExplorers: { [key: string]: string } = {
    "0x1": "https://etherscan.io",
    "0x38": "https://bscscan.com",
    "0x89": "https://polygonscan.com",
    "0xa4b1": "https://arbiscan.io",
    "0xa": "https://optimistic.etherscan.io",
    "0x2105": "https://basescan.org",
    "0xa86a": "https://snowtrace.io",
    "0xe708": "https://lineascan.build",
    "0xfa": "https://ftmscan.com",
    "0x171": "https://scan.pulsechain.com",
    "0x7e4": "https://app.roninchain.com",
    solana: "https://solscan.io",
  };

  // Map UI timeframes to API timeframes
  const timeFrameMap = {
    "5m": "5min",
    "1h": "1h",
    "4h": "4h",
    "24h": "24h",
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Fetch token metadata
  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!token || !token.address) return;

      try {
        let url;
        const isSolana = chainId === "solana";
        setIsSolana(isSolana);

        if (isSolana) {
          url = `https://solana-gateway.moralis.io/token/mainnet/${token.address}/metadata`;
        } else {
          url = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chainId}&addresses[0]=${token.address}`;
        }

        console.log("Fetching token metadata from:", url);

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            "X-API-Key": API_KEY ?? "",
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Token metadata response:", data);

        // Handle different response formats
        if (isSolana) {
          setTokenMetadata(data);
        } else {
          // EVM response is an array, take first item
          setTokenMetadata(
            Array.isArray(data) && data.length > 0 ? data[0] : null
          );
        }
      } catch (err) {
        console.error("Error fetching token metadata:", err);
      }
    };

    fetchTokenMetadata();
  }, [token, chainId]);

  // Fetch pair stats
  useEffect(() => {
    const fetchPairStats = async () => {
      if (!pair || !pair.pairAddress) return;

      setLoading(true);
      try {
        let url;
        const isSolana = chainId === "solana";

        if (isSolana) {
          url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pair.pairAddress}/stats`;
        } else {
          url = `https://deep-index.moralis.io/api/v2.2/pairs/${pair.pairAddress}/stats?chain=${chainId}`;
        }

        console.log("Fetching pair stats from:", url);

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            "X-API-Key": API_KEY ?? "",
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Pair stats response:", data);
        setPairStats(data);
      } catch (err) {
        console.error("Error fetching pair stats:", err);
        setError("Failed to load pair statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchPairStats();
  }, [pair, chainId]);

  // Handle time frame selection
  const handleTimeFrameChange = (timeFrame: any) => {
    setSelectedTimeFrame(timeFrame);
  };

  // Format price with appropriate decimal places
  const formatPrice = (price: string) => {
    if (!price) return "$0";

    // Convert to number if it's a string
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    if (numPrice < 0.00001) {
      return "$" + numPrice.toFixed(10).replace(/\.?0+$/, "");
    } else if (numPrice < 0.01) {
      return "$" + numPrice.toFixed(6);
    } else if (numPrice < 1000) {
      return "$" + numPrice.toFixed(4);
    } else {
      return (
        "$" +
        numPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
  };

  // Format token price in terms of the quote token
  const formatTokenPrice = (price: any, symbol: any) => {
    if (!price) return "0";

    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    if (numPrice < 0.00001) {
      return `${numPrice.toFixed(10).replace(/\.?0+$/, "")} ${symbol}`;
    } else {
      const parts = numPrice.toString().split(".");
      if (parts.length > 1) {
        // Take 6 significant digits after the decimal
        return `${parts[0]}.${parts[1].substring(0, 6)} ${symbol}`;
      }
      return `${numPrice} ${symbol}`;
    }
  };

  // Format large numbers with K, M, B suffixes
  const formatNumber = (num: string | number) => {
    if (
      num === undefined ||
      num === null ||
      (typeof num === "string" && num.trim() === "")
    )
      return "0";

    const numValue = typeof num === "string" ? parseFloat(num) : num;

    if (isNaN(numValue)) return "0";

    if (numValue >= 1000000000) {
      return (numValue / 1000000000).toFixed(1) + "B";
    } else if (numValue >= 1000000) {
      return (numValue / 1000000).toFixed(1) + "M";
    } else if (numValue >= 1000) {
      return (numValue / 1000).toFixed(1) + "K";
    } else {
      return numValue.toLocaleString();
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: any) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h ago`;
    } else {
      return `${diffHours}h ${diffMin % 60}m ago`;
    }
  };

  // Format percentage changes
  const formatPercentChange = (value: any) => {
    if (!value && value !== 0) return "-";
    return (value >= 0 ? "+" : "") + value.toFixed(2) + "%";
  };

  // Calculate ratio for progress bars
  const calculateRatio = (a: any, b: any) => {
    if (!a || !b || a + b === 0) return 0.5; // Default to 50% if no data
    return a / (a + b);
  };

  // Get time period data
  const getTimePeriodData = (period: "5m" | "1h" | "4h" | "24h") => {
    const apiPeriod = timeFrameMap[period] || "24h";

    if (!pairStats)
      return {
        priceChange: 0,
        buys: 0,
        sells: 0,
        buyVolume: 0,
        sellVolume: 0,
        buyers: 0,
        sellers: 0,
        totalVolume: 0,
      };

    return {
      priceChange: pairStats.pricePercentChange?.[apiPeriod] || 0,
      buys: pairStats.buys?.[apiPeriod] || 0,
      sells: pairStats.sells?.[apiPeriod] || 0,
      buyVolume: pairStats.buyVolume?.[apiPeriod] || 0,
      sellVolume: pairStats.sellVolume?.[apiPeriod] || 0,
      buyers: pairStats.buyers?.[apiPeriod] || 0,
      sellers: pairStats.sellers?.[apiPeriod] || 0,
      totalVolume: pairStats.totalVolume?.[apiPeriod] || 0,
    };
  };

  // Get token social links
  const getTokenLinks = () => {
    const isSolana = chainId === "solana";

    if (!tokenMetadata) return {};

    if (isSolana) {
      return tokenMetadata.links || {};
    } else {
      return tokenMetadata.links || {};
    }
  };

  // Get market cap or FDV
  const getMarketCapOrFDV = (type = "fdv") => {
    const isSolana = chainId === "solana";

    if (isSolana) {
      // For Solana, we only have fullyDilutedValue
      return tokenMetadata?.fullyDilutedValue || 0;
    } else {
      // For EVM chains
      if (type === "market_cap") {
        return tokenMetadata?.market_cap || 0;
      } else {
        return (
          tokenMetadata?.fully_diluted_valuation ||
          tokenMetadata?.market_cap ||
          0
        );
      }
    }
  };

  // Get current time period data
  const currentPeriodData = getTimePeriodData(selectedTimeFrame);

  // New helper function to shorten address
  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // New helper function to handle copy
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  if (!token || !pair) {
    return (
      <div className="p-4 text-dex-text-secondary">No token data available</div>
    );
  }

  // Extract token symbols for the pair
  const quoteToken = (() => {
    const isSolana = chainId === "solana";
    if (isSolana) return "SOL";

    const defaultQuoteTokens: Record<string, string> = {
      "0x1": "ETH",
      "0x38": "BNB",
      "0x89": "MATIC",
      "0xa86a": "AVAX",
      "0xa": "OP",
      "0xa4b1": "ARB",
      "0x2105": "ETH",
      "0xe708": "ETH",
      "0xfa": "FTM",
      "0x171": "PULSE",
      "0x7e4": "RON",
      solana: "SOL",
    };

    return defaultQuoteTokens[chainId] || "ETH";
  })();

  // Get token price and market info
  const usdPrice = pairStats?.currentUsdPrice || pair.usdPrice || 0;
  const nativePrice = pairStats?.currentNativePrice || pair.nativePrice || 0;
  const totalLiquidity = pairStats?.totalLiquidityUsd || pair.liquidityUsd || 0;

  // Get market cap from metadata or estimate
  const marketCap = getMarketCapOrFDV();

  // Get token links
  const tokenLinks = getTokenLinks();

  // Get token categories (EVM only)
  const tokenCategories =
    !isSolana && tokenMetadata?.categories ? tokenMetadata.categories : [];

  // Get creation time
  const creationTime =
    pairStats?.pairCreated || tokenMetadata?.created_at || null;

  // Get the block explorer URL
  const getExplorerUrl = (address: string, type = "address") => {
    const isSolana = chainId === "solana";
    const explorer = blockExplorers[chainId] || "";

    if (!explorer) return "#";

    if (isSolana) {
      return `${explorer}/${type === "token" ? "token" : "account"}/${address}`;
    } else {
      return `${explorer}/${type === "token" ? "token" : "address"}/${address}`;
    }
  };

  // Get total supply and tokens in pair
  const getTokenSupply = () => {
    const isSolana = chainId === "solana";

    if (isSolana) {
      return tokenMetadata?.totalSupplyFormatted || "0";
    } else {
      return tokenMetadata?.total_supply_formatted || "0";
    }
  };

  return (
    <div
      ref={containerRef}
      className="text-dex-text-primary h-full overflow-y-auto text-sm"
    >
      {/* Token Header */}
      <div className="p-3 border-b border-dex-border">
        <div className="flex items-center mb-2">
          <img
            src={
              token.logo ||
              tokenMetadata?.logo ||
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg=="
            }
            alt={token.symbol}
            className="w-8 h-8 mr-2 rounded-full bg-dex-bg-tertiary"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
            }}
          />
          <div>
            <h1 className="text-lg font-bold flex items-center">
              {tokenMetadata?.name || token.name}
              <span className="ml-2 text-sm text-dex-text-secondary">
                ({tokenMetadata?.symbol || token.symbol})
              </span>
            </h1>
            <div className="text-sm text-dex-text-secondary">
              {pair.pairLabel} on {pair.exchangeName}
            </div>
          </div>
        </div>

        {/* Token Categories for EVM */}
        {tokenCategories && tokenCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 mb-2">
            {tokenCategories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded-full text-dex-text-secondary"
              >
                {category}
              </span>
            ))}
            {tokenCategories.length > 3 && (
              <span className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded-full text-dex-text-secondary">
                +{tokenCategories.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex space-x-2 mt-3">
          {tokenLinks.website && (
            <a
              href={tokenLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
            >
              Website
            </a>
          )}
          {tokenLinks.twitter && (
            <a
              href={tokenLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
            >
              Twitter
            </a>
          )}
          {tokenLinks.telegram && (
            <a
              href={tokenLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
            >
              Telegram
            </a>
          )}
          {!tokenLinks.telegram && !tokenLinks.discord && (
            <a
              href="#"
              className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
            >
              Telegram
            </a>
          )}
        </div>
      </div>

      {/* Price Information */}
      <div className="grid grid-cols-2 p-3 border-b border-dex-border">
        <div className="col-span-1">
          <div className="text-xs text-dex-text-secondary mb-0.5">
            PRICE USD
          </div>
          <div className="text-sm font-medium">{formatPrice(usdPrice)}</div>
        </div>
        <div className="col-span-1">
          <div className="text-xs text-dex-text-secondary mb-0.5">
            PRICE {quoteToken}
          </div>
          <div className="text-sm font-medium">
            {formatTokenPrice(nativePrice, quoteToken)}
          </div>
        </div>
      </div>

      {/* Liquidity & Volume */}
      <div className="grid grid-cols-3 p-3 border-b border-dex-border">
        <div className="col-span-1">
          <div className="text-xs text-dex-text-secondary mb-0.5">
            LIQUIDITY
          </div>
          <div className="text-xs font-medium flex items-center">
            ${formatNumber(totalLiquidity)}
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-xs text-dex-text-secondary mb-0.5">FDV</div>
          <div className="text-xs font-medium">
            ${formatNumber(getMarketCapOrFDV("fdv"))}
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-xs text-dex-text-secondary mb-0.5">MKT CAP</div>
          <div className="text-xs font-medium">
            ${formatNumber(getMarketCapOrFDV("market_cap"))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 border-b border-dex-border">
        {(["5m", "1h", "4h", "24h"] as Array<"5m" | "1h" | "4h" | "24h">).map(
          (period) => {
            const periodData = getTimePeriodData(period);
            const isActive = selectedTimeFrame === period;
            return (
              <div
                key={period}
                className={`col-span-1 p-2 text-center cursor-pointer ${
                  isActive ? "bg-dex-bg-secondary" : ""
                }`}
                onClick={() => handleTimeFrameChange(period)}
              >
                <div className="text-xs text-dex-text-secondary mb-0.5">
                  {period}
                </div>
                <div
                  className={`text-sm font-medium ${
                    periodData.priceChange >= 0
                      ? "text-dex-green"
                      : "text-dex-red"
                  }`}
                >
                  {formatPercentChange(periodData.priceChange)}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Stats grid section */}
      <div className="grid grid-cols-3 border-b border-dex-border">
        {/* TXNS section */}
        <div className="col-span-1 border-r border-dex-border p-2">
          <div className="text-xs text-dex-text-secondary mb-0.5">TXNS</div>
          <div className="text-sm font-medium">
            {formatNumber(currentPeriodData.buys + currentPeriodData.sells)}
          </div>
        </div>

        {/* BUYS section */}
        <div className="col-span-2 p-2">
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <div className="text-xs text-dex-text-secondary mb-0.5">BUYS</div>
              <div className="text-xs">
                {formatNumber(currentPeriodData.buys)}
              </div>
            </div>
            <div className="col-span-1 text-right">
              <div className="text-xs text-dex-text-secondary mb-0.5">
                SELLS
              </div>
              <div className="text-xs">
                {formatNumber(currentPeriodData.sells)}
              </div>
            </div>
          </div>
          <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div
                className="h-full bg-dex-green"
                style={{
                  width: `${
                    calculateRatio(
                      currentPeriodData.buys,
                      currentPeriodData.sells
                    ) * 100
                  }%`,
                }}
              ></div>
              <div
                className="h-full bg-dex-red"
                style={{
                  width: `${
                    calculateRatio(
                      currentPeriodData.sells,
                      currentPeriodData.buys
                    ) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* VOLUME section */}
      <div className="grid grid-cols-3 border-b border-dex-border">
        <div className="col-span-1 border-r border-dex-border p-2">
          <div className="text-xs text-dex-text-secondary mb-0.5">VOLUME</div>
          <div className="text-sm font-medium">
            ${formatNumber(currentPeriodData.totalVolume)}
          </div>
        </div>

        <div className="col-span-2 p-2">
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <div className="text-xs text-dex-text-secondary mb-0.5">
                BUY VOL
              </div>
              <div className="text-xs">
                ${formatNumber(currentPeriodData.buyVolume)}
              </div>
            </div>
            <div className="col-span-1 text-right">
              <div className="text-xs text-dex-text-secondary mb-0.5">
                SELL VOL
              </div>
              <div className="text-xs">
                ${formatNumber(currentPeriodData.sellVolume)}
              </div>
            </div>
          </div>
          <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div
                className="h-full bg-dex-green"
                style={{
                  width: `${
                    calculateRatio(
                      currentPeriodData.buyVolume,
                      currentPeriodData.sellVolume
                    ) * 100
                  }%`,
                }}
              ></div>
              <div
                className="h-full bg-dex-red"
                style={{
                  width: `${
                    calculateRatio(
                      currentPeriodData.sellVolume,
                      currentPeriodData.buyVolume
                    ) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* MAKERS section */}
      <div className="grid grid-cols-3 border-b border-dex-border">
        <div className="col-span-1 border-r border-dex-border p-2">
          <div className="text-xs text-dex-text-secondary mb-0.5">MAKERS</div>
          <div className="text-sm font-medium">
            {formatNumber(currentPeriodData.buyers + currentPeriodData.sellers)}
          </div>
        </div>

        <div className="col-span-2 p-2">
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <div className="text-xs text-dex-text-secondary mb-0.5">
                BUYERS
              </div>
              <div className="text-xs">
                {formatNumber(currentPeriodData.buyers)}
              </div>
            </div>
            <div className="col-span-1 text-right">
              <div className="text-xs text-dex-text-secondary mb-0.5">
                SELLERS
              </div>
              <div className="text-xs">
                {formatNumber(currentPeriodData.sellers)}
              </div>
            </div>
          </div>
          <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div
                className="h-full bg-dex-green"
                style={{
                  width: `${
                    calculateRatio(
                      currentPeriodData.buyers,
                      currentPeriodData.sellers
                    ) * 100
                  }%`,
                }}
              ></div>
              <div
                className="h-full bg-dex-red"
                style={{
                  width: `${
                    calculateRatio(
                      currentPeriodData.sellers,
                      currentPeriodData.buyers
                    ) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pair Details Section - Shows when scrolled down */}
      <div className="border-b border-dex-border">
        {creationTime && (
          <div className="p-2 border-b border-dex-border flex justify-between items-center">
            <div className="text-xs text-dex-text-secondary">Pair created</div>
            <div className="text-xs">{formatTimeAgo(creationTime)}</div>
          </div>
        )}

        {/* Pooled Tokens */}
        {pair.pair && pair.pair.length > 0 && (
          <>
            {pair.pair.map((pairToken: any, index: any) => (
              <div
                key={index}
                className="p-2 border-b border-dex-border flex justify-between items-center"
              >
                <div className="text-xs text-dex-text-secondary">
                  Pooled {pairToken.tokenSymbol}
                </div>
                <div className="text-xs">
                  ${formatNumber(pairToken.liquidityUsd)}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Pair Address with Copy and Explorer Link */}
        <div className="p-2 border-b border-dex-border">
          <div className="flex justify-between items-center">
            <div className="text-xs text-dex-text-secondary">Pair</div>
            <div className="flex items-center space-x-1">
              <span className="font-mono text-xs">
                {shortenAddress(pair.pairAddress)}
              </span>
              <button
                onClick={() => handleCopy(pair.pairAddress)}
                className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <a
                href={getExplorerUrl(pair.pairAddress, "token")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
              >
                EXP
              </a>
            </div>
          </div>
        </div>

        {/* Token Address */}
        <div className="p-2 border-b border-dex-border">
          <div className="flex justify-between items-center">
            <div className="text-xs text-dex-text-secondary">
              {token.symbol}
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-mono text-xs">
                {shortenAddress(token.address)}
              </span>
              <button
                onClick={() => handleCopy(token.address)}
                className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <a
                href={getExplorerUrl(token.address, "token")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
              >
                EXP
              </a>
            </div>
          </div>
        </div>

        {/* Quote Token Address */}
        {pair.pair &&
          pair.pair.find(
            (t: any) =>
              t.tokenAddress.toLowerCase() !== token.address.toLowerCase()
          ) && (
            <div className="p-2">
              <div className="flex justify-between items-center">
                <div className="text-xs text-dex-text-secondary">
                  {
                    pair.pair.find(
                      (t: any) =>
                        t.tokenAddress.toLowerCase() !==
                        token.address.toLowerCase()
                    ).tokenSymbol
                  }
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-mono text-xs">
                    {shortenAddress(
                      pair.pair.find(
                        (t: any) =>
                          t.tokenAddress.toLowerCase() !==
                          token.address.toLowerCase()
                      ).tokenAddress
                    )}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        pair.pair.find(
                          (t: any) =>
                            t.tokenAddress.toLowerCase() !==
                            token.address.toLowerCase()
                        ).tokenAddress
                      )
                    }
                    className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                  <a
                    href={getExplorerUrl(
                      pair.pair.find(
                        (t: any) =>
                          t.tokenAddress.toLowerCase() !==
                          token.address.toLowerCase()
                      ).tokenAddress,
                      "token"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
                  >
                    EXP
                  </a>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Action Buttons */}
      <div className="p-3 grid grid-cols-2 gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=Check%20out%20${
            token.symbol
          }%20on%20DEXScreener&url=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center p-2 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-xs"
        >
          <span className="mr-1">🐦</span>
          <span>Search on Twitter</span>
        </a>

        <button
          className="flex justify-center items-center p-2 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-xs"
          onClick={() => {
            /* Handle showing other pairs */
          }}
        >
          <span className="mr-1">🔍</span>
          <span>Other pairs</span>
        </button>
      </div>
    </div>
  );
};

export default TokenInfo;
