/**
 * Format a number with K, M, B suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num: number) => {
  if (!num) return "0";

  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

/**
 * Format a unix timestamp into a human-readable age (e.g., "2h", "3d", "1mo")
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted age
 */
export const formatAge = (timestamp: number) => {
  if (!timestamp) return "N/A";

  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSec = diffMs / 1000;

  if (diffSec < 60) return Math.floor(diffSec) + "s";
  if (diffSec < 3600) return Math.floor(diffSec / 60) + "m";
  if (diffSec < 86400) return Math.floor(diffSec / 3600) + "h";
  if (diffSec < 2592000) return Math.floor(diffSec / 86400) + "d";
  if (diffSec < 31536000) return Math.floor(diffSec / 2592000) + "mo";
  return Math.floor(diffSec / 31536000) + "y";
};

/**
 * Format a price value (especially for small crypto prices)
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
export const formatPrice = (price: number) => {
  if (!price) return "$0";

  // For very small prices, use scientific notation
  if (price < 0.000001) {
    return price.toExponential(2);
  }

  // For small prices, show more decimals
  if (price < 0.01) {
    return price.toFixed(
      Math.min(8, 2 + Math.abs(Math.floor(Math.log10(price))))
    );
  }

  // For medium prices
  if (price < 1000) {
    return price.toFixed(Math.max(2, 4 - Math.floor(Math.log10(price))));
  }

  // For large prices
  return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

/**
 * Format percent change with colors and sign
 * @param {number} value - Percent value
 * @param {boolean} withColor - Whether to include color HTML
 * @returns {string} Formatted percent change
 */
export const formatPercentChange = (value: number, withColor = false) => {
  if (value === undefined || value === null) return "-";

  const formatted = `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

  if (withColor) {
    const colorClass = value >= 0 ? "text-green-500" : "text-red-500";
    return `<span class="${colorClass}">${formatted}</span>`;
  }

  return formatted;
};

/**
 * Generate a chain logo path from chainId
 * @param {string} chainId - Chain identifier
 * @returns {string} Path to chain logo
 */
export const getChainLogoPath = (chainId: string) => {
  const chainMap: Record<string, string> = {
    "0x1": "ethereum",
    solana: "solana",
    bsc: "binance",
    polygon: "polygon",
    arbitrum: "arbitrum",
    optimism: "optimism",
    base: "base",
  };

  const chain = chainMap[chainId] || "generic";
  return `/images/chains/${chain}.svg`;
};

/**
 * Map chainId to a URL path
 * @param {string} chainId - Chain identifier
 * @returns {string} URL path component
 */
export const chainIdToPath = (chainId: string) => {
  const chainMap: Record<string, string> = {
    "0x1": "ethereum",
    solana: "solana",
    bsc: "bsc",
    polygon: "polygon",
    arbitrum: "arbitrum",
    optimism: "optimism",
    base: "base",
  };

  return chainMap[chainId] || chainId;
};

/**
 * Truncate an address/account string
 * @param {string} address - Full address
 * @param {number} start - Characters to show at start
 * @param {number} end - Characters to show at end
 * @returns {string} Truncated address
 */
export const truncateAddress = (address: string, start = 6, end = 4) => {
  if (!address) return "";
  if (address.length <= start + end) return address;

  return `${address.slice(0, start)}...${address.slice(-end)}`;
};
