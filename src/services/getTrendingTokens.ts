import { API_KEY } from "../configs";

/**
 * Fetch trending tokens
 * @param {string} chain - Optional chain ID filter
 * @param {number} limit - Number of results to return
 * @returns {Promise} Promise resolving to trending tokens data
 */
// services/api.js
export const getTrendingTokens = async (chain = "", limit = 100) => {
  try {
    // Only add chain parameter if it's not empty
    const chainParam = chain ? `&chain=${chain}` : "";
    const url = `https://deep-index.moralis.io/api/v2.2/tokens/trending?limit=${limit}${chainParam}`;
    console.log("Fetching trending tokens from:", url);

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
    return Array.isArray(data) ? data : data.result || [];
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    throw error;
  }
};
