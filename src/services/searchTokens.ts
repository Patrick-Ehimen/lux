import { API_KEY } from "../configs";
/**
 * Search for tokens using the Moralis API
 * @param {string} query - Search query
 * @param {Array} chains - Array of chain IDs to search
 * @param {number} limit - Number of results to return
 * @returns {Promise} Promise resolving to search results
 */
export const searchTokens = async (
  query: string,
  chains = ["eth", "solana", "bsc", "base"],
  limit = 20
) => {
  try {
    const chainsParam = chains.join(",");
    const url = `https://deep-index.moralis.io/api/v2.2/tokens/search?query=${encodeURIComponent(
      query
    )}&chains=${chainsParam}&limit=${limit}`;

    const response: Response = await fetch(url, {
      headers: {
        accept: "application/json",
        "X-API-Key": API_KEY ?? "",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Error searching tokens:", error);
    throw error;
  }
};
