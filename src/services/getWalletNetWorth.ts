import { API_KEY } from "../configs";

/**
 * @notice Fetches the net worth of a wallet across multiple chains using the Moralis API.
 * @param address The address of the wallet to fetch the net worth for.
 * @return A promise that resolves to the net worth data as a JSON object.
 * @dev This function constructs a Moralis API URL with query parameters for multiple chains and fetches the wallet's net worth.
 */
export const getWalletNetWorth = async (address: string) => {
  try {
    // Construct query parameters for all supported chains
    const chains = [
      "eth",
      "bsc",
      "polygon",
      "arbitrum",
      "avalanche",
      "optimism",
      "linea",
      "pulse",
      "ronin",
      "base",
      "fantom",
    ];
    const chainParams = chains
      .map((chain, index) => `chains[${index}]=${chain}`)
      .join("&");

    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/net-worth?${chainParams}&exclude_spam=true&exclude_unverified_contracts=true`;

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
    console.error("Error fetching wallet net worth:", error);
    throw error;
  }
};
