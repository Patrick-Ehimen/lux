import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NewTokenCard from "../components/pumpfun/NewTokenCard";
import BondingTokenCard from "../components/pumpfun/BondingTokenCard";
import GraduatedTokenCard from "../components/pumpfun/GraduatedTokenCard";
import { API_KEY } from "../configs";

const PumpFunPage = () => {
  const navigate = useNavigate();
  type Token = {
    tokenAddress: string;
    isNew: boolean;
    priceUsd: number;
    liquidity: number;
    fullyDilutedValuation: number;
    createdAt: string;
    [key: string]: any;
  };

  const [newTokens, setNewTokens] = useState<Token[]>([]);
  const [bondingTokens, setBondingTokens] = useState<Token[]>([]);
  const [graduatedTokens, setGraduatedTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTokensIds, setNewTokensIds] = useState(new Set());
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  // Load tokens on initial render
  useEffect(() => {
    fetchAllTokens();

    // Set up polling to check for new tokens every 30 seconds
    pollingInterval.current = setInterval(fetchAllTokens, 30000);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  const fetchAllTokens = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchNewTokens(),
        fetchBondingTokens(),
        fetchGraduatedTokens(),
      ]);
    } catch (err) {
      console.error("Error fetching pump.fun tokens:", err);
      setError("Failed to load pump.fun tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNewTokens = async () => {
    try {
      const url =
        "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/new?limit=100";
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

      // Check for new tokens that we haven't seen before
      const currentTokenIds = new Set(
        newTokens.map((token) => token.tokenAddress)
      );
      const incomingTokens = data.result || [];

      // Store previous token IDs
      const previousTokenIds = new Set(newTokensIds);

      // Update the set of known token IDs
      setNewTokensIds(
        new Set([
          ...Array.from(previousTokenIds),
          ...incomingTokens.map((token: any) => token.tokenAddress),
        ])
      );

      // Find new tokens that weren't in our previous list
      const brandNewTokens = incomingTokens.filter(
        (token: any) => !previousTokenIds.has(token.tokenAddress)
      );

      // Add isNew flag to brand new tokens for animation
      const tokensWithFlag = incomingTokens.map((token: any) => ({
        ...token,
        isNew: brandNewTokens.some(
          (newToken: any) => newToken.tokenAddress === token.tokenAddress
        ),
      }));

      setNewTokens(tokensWithFlag);
    } catch (err) {
      console.error("Error fetching new tokens:", err);
      throw err;
    }
  };

  const fetchBondingTokens = async () => {
    try {
      const url =
        "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/bonding?limit=100";
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
      setBondingTokens(data.result || []);
    } catch (err) {
      console.error("Error fetching bonding tokens:", err);
      throw err;
    }
  };

  const fetchGraduatedTokens = async () => {
    try {
      const url =
        "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/graduated?limit=100";
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
      setGraduatedTokens(data.result || []);
    } catch (err) {
      console.error("Error fetching graduated tokens:", err);
      throw err;
    }
  };

  const handleTokenClick = (token: any) => {
    navigate(`/solana/${token.tokenAddress}`);
  };

  // Format price with appropriate decimals
  const formatPrice = (price: any) => {
    if (!price) return "$0";

    const numPrice = parseFloat(price);

    if (numPrice < 0.000001) {
      return "$" + numPrice.toExponential(4);
    } else if (numPrice < 0.001) {
      return "$" + numPrice.toFixed(8);
    } else if (numPrice < 1) {
      return "$" + numPrice.toFixed(6);
    } else {
      return "$" + numPrice.toFixed(4);
    }
  };

  // Format liquidity and market cap
  const formatNumber = (num: any) => {
    if (!num) return "$0";

    const numValue = parseFloat(num);

    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(2)}K`;
    } else {
      return `$${numValue.toFixed(2)}`;
    }
  };

  // Format date to relative time
  const formatTimeAgo = (dateString: any) => {
    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds}s ago`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ago`;
    } else if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)}h ago`;
    } else {
      return `${Math.floor(seconds / 86400)}d ago`;
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {loading &&
      newTokens.length === 0 &&
      bondingTokens.length === 0 &&
      graduatedTokens.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Tokens Column */}
          <div className="space-y-4">
            <div className="bg-dex-bg-secondary rounded-t-lg p-4 border-b-2 border-green-500">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">🆕</span> Newly Created Tokens
              </h2>
            </div>

            <div className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
              {newTokens.length === 0 ? (
                <div className="text-center py-10 text-dex-text-secondary">
                  No new tokens available
                </div>
              ) : (
                newTokens.map((token) => (
                  <NewTokenCard
                    key={token.tokenAddress}
                    token={token}
                    formatPrice={formatPrice}
                    formatNumber={formatNumber}
                    formatTimeAgo={formatTimeAgo}
                    onClick={() => handleTokenClick(token)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Bonding Tokens Column */}
          <div className="space-y-4">
            <div className="bg-dex-bg-secondary rounded-t-lg p-4 border-b-2 border-blue-500">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">⚡</span> Bonding Tokens
              </h2>
            </div>

            <div className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
              {bondingTokens.length === 0 ? (
                <div className="text-center py-10 text-dex-text-secondary">
                  No bonding tokens available
                </div>
              ) : (
                bondingTokens.map((token) => (
                  <BondingTokenCard
                    key={token.tokenAddress}
                    token={token}
                    formatPrice={formatPrice}
                    formatNumber={formatNumber}
                    onClick={() => handleTokenClick(token)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Graduated Tokens Column */}
          <div className="space-y-4">
            <div className="bg-dex-bg-secondary rounded-t-lg p-4 border-b-2 border-purple-500">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">🎓</span> Graduated Tokens
              </h2>
            </div>

            <div className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
              {graduatedTokens.length === 0 ? (
                <div className="text-center py-10 text-dex-text-secondary">
                  No graduated tokens available
                </div>
              ) : (
                graduatedTokens.map((token) => (
                  <GraduatedTokenCard
                    key={token.tokenAddress}
                    token={{
                      ...token,
                      graduatedAt: token.graduatedAt ?? token.createdAt ?? "",
                    }}
                    formatPrice={formatPrice}
                    formatNumber={formatNumber}
                    formatTimeAgo={formatTimeAgo}
                    onClick={() => handleTokenClick(token)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PumpFunPage;
