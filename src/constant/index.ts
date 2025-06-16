import {
  Solana,
  Base,
  Arbitrum,
  Avalance,
  Binance,
  Ethereum,
  Fantom,
  Polygon,
  Linea,
  Optimism,
  Pulse,
  Ronin,
} from "../assets/network-chains";
export const CHAINS = [
  { id: "solana", name: "Solana", icon: Solana },
  { id: "0x1", name: "Ethereum", icon: Ethereum },
  { id: "0x38", name: "BSC", icon: Binance },
  { id: "0x2105", name: "Base", icon: Base },
  { id: "0xa4b1", name: "Arbitrum", icon: Arbitrum },
  { id: "0x89", name: "Polygon", icon: Polygon },
  { id: "0xa86a", name: "Avalanche", icon: Avalance },
  { id: "0xa", name: "Optimism", icon: Optimism },
  { id: "0xe708", name: "Linea", icon: Linea },
  { id: "0xfa", name: "Fantom", icon: Fantom },
  { id: "0x171", name: "Pulse", icon: Pulse },
  { id: "0x7e4", name: "Ronin", icon: Ronin },
];

// Map chain IDs to URL paths
export const CHAIN_PATH_MAP: Record<string, string> = {
  solana: "solana",
  "0x1": "ethereum",
  "0x7e4": "ronin",
  "0x38": "binance",
  "0x2105": "base",
  "0xa4b1": "arbitrum",
  "0x89": "polygon",
  "0xa86a": "avalanche",
  "0xa": "optimism",
  "0xe708": "linea",
  "0xfa": "fantom",
  "0x171": "pulse",
};

// Network buttons with their routes
export const networks = [
  { id: "", name: "All Chains", icon: "🌐" },
  { id: "solana", name: "Solana", icon: Solana },
  { id: "ethereum", name: "Ethereum", icon: Ethereum },
  { id: "base", name: "Base", icon: Base },
  { id: "bsc", name: "BSC", icon: Binance },
  { id: "ronin", name: "Ronin", icon: Ronin },
];

// Page navigation buttons
export const pages = [
  { id: "portfolio", name: "Portfolio", icon: "💼" },
  { id: "pumpfun", name: "Pump.fun", icon: "🚀" },
];

// Available metrics for filtering
export const AVAILABLE_METRICS = [
  { value: "tokenAge", label: "Token Age" },
  { value: "holders", label: "Holders" },
  { value: "buyers", label: "Buyers" },
  { value: "sellers", label: "Sellers" },
  { value: "netBuyers", label: "Net Buyers" },
  { value: "experiencedBuyers", label: "Experienced Buyers" },
  { value: "experiencedSellers", label: "Experienced Sellers" },
  { value: "netExperiencedBuyers", label: "Net Experienced Buyers" },
  { value: "fullyDilutedValuation", label: "Fully Diluted Valuation" },
  { value: "marketCap", label: "Market Cap" },
  { value: "usdPricePercentChange", label: "Price Change %" },
  { value: "liquidityChange", label: "Liquidity Change" },
  { value: "liquidityChangeUSD", label: "Liquidity Change USD" },
  { value: "volumeUsd", label: "Volume USD" },
  { value: "buyVolumeUsd", label: "Buy Volume USD" },
  { value: "sellVolumeUsd", label: "Sell Volume USD" },
  { value: "netVolumeUsd", label: "Net Volume USD" },
  { value: "securityScore", label: "Security Score" },
];

// Available time frames
export const TIME_FRAMES = [
  { value: "tenMinutes", label: "10 Minutes" },
  { value: "thirtyMinutes", label: "30 Minutes" },
  { value: "oneHour", label: "1 Hour" },
  { value: "fourHours", label: "4 Hours" },
  { value: "twelveHours", label: "12 Hours" },
  { value: "oneDay", label: "1 Day" },
  { value: "oneWeek", label: "1 Week" },
  { value: "oneMonth", label: "1 Month" },
];

// Comparison operators
export const OPERATORS = [
  { value: "gt", label: "Greater Than" },
  { value: "lt", label: "Less Than" },
  { value: "eq", label: "Equal To" },
];

// Chain options
export const FILTER_CHAINS = [
  { value: "0x1", label: "Ethereum" },
  { value: "solana", label: "Solana" },
  { value: "0x38", label: "BSC" },
  { value: "0x89", label: "Polygon" },
  { value: "0x2105", label: "Base" },
  { value: "0xa4b1", label: "Arbitrum" },
  { value: "0xa", label: "Optimism" },
  { value: "0xa86a", label: "Avalanche" },
  { value: "0x171", label: "Pulse" },
  { value: "0x7e4", label: "Ronin" },
];
