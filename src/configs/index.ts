export const API_KEY = process.env.REACT_APP_MORALIS_API_KEY;

/**
 * Helper to format chain ID for API
 * @param {string} chainId - Chain ID in URL format
 * @returns {string} Chain ID in API format
 */
export const formatChainForApi = (chainId: string) => {
  // Map URL format to API format
  const chainMap: { [key: string]: string } = {
    ethereum: "0x1",
    eth: "0x1",
    bsc: "0x38",
    polygon: "0x89",
    arbitrum: "0xa4b1",
    optimism: "0xa",
    base: "0x2105",
    solana: "solana",
  };

  return chainMap[chainId] || chainId;
};
