import { API_KEY } from "../configs";

/**
 * @notice Fetches the list of tokens held by a specific wallet address on a given blockchain.
 * @dev Makes a GET request to the Moralis API to retrieve wallet token balances.
 * @param address The wallet address to query for token balances.
 * @param chain The blockchain network identifier (e.g., 'eth', 'bsc', etc.).
 * @returns A promise that resolves to the JSON response containing the wallet's tokens.
 * @throws Will throw an error if the API request fails or returns a non-OK status.
 */
export const getWalletTokens = async (address: string, chain: string) => {
  try {
    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=${chain}`;

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "X-API-Key": API_KEY ?? "",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching wallet tokens:", error);
    throw error;
  }
};
