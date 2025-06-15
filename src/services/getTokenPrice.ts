import { TokenPriceResponse } from "../types/type";
import { formatChainForApi } from "../configs";
import { API_KEY } from "../configs";

/**
 * @notice Fetches the price of a token from the Moralis API.
 * @param chainId The chain ID of the token.
 * @param tokenAddress The address of the token.
 * @return A promise that resolves to the token price data.
 * @dev This function fetches the token price from the Moralis API.
 */
export const getTokenPrice = async (
  chainId: string,
  tokenAddress: string
): Promise<TokenPriceResponse> => {
  try {
    // Convert chainId for Moralis API format if needed
    const chain = formatChainForApi(chainId);

    const url = `https://deep-index.moralis.io/api/v2.2/tokens/${chain}/${tokenAddress}/price`;
    const response: Response = await fetch(url, {
      headers: {
        accept: "application/json",
        "X-API-Key": API_KEY ?? "",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return (await response.json()) as TokenPriceResponse;
  } catch (error) {
    console.error("Error fetching token price:", error);
    throw error;
  }
};
