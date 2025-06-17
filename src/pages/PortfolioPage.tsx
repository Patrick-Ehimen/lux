import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletManager from "../components/portfolio/WalletManager";
import NetWorthCard from "../components/portfolio/NetWorthCard";
import ChainSelector from "../components/portfolio/ChainSelector";
import TokenHoldings from "../components/portfolio/TokenHoldings";
import { Token, Wallet } from "../types/type";

import { API_KEY } from "../configs";

// Supported EVM chains
const SUPPORTED_CHAINS = [
  { id: "eth", name: "Ethereum", icon: "💎", color: "#627EEA" },
  { id: "bsc", name: "BSC", icon: "🔶", color: "#F3BA2F" },
  { id: "polygon", name: "Polygon", icon: "🟣", color: "#8247E5" },
  { id: "arbitrum", name: "Arbitrum", icon: "🔵", color: "#28A0F0" },
  { id: "avalanche", name: "Avalanche", icon: "❄️", color: "#E84142" },
  { id: "optimism", name: "Optimism", icon: "⚡", color: "#FF0420" },
  { id: "base", name: "Base", icon: "🅱️", color: "#0052FF" },
  { id: "fantom", name: "Fantom", icon: "👻", color: "#1969FF" },
  { id: "linea", name: "Linea", icon: "🔗", color: "#000000" },
  { id: "pulse", name: "Pulse", icon: "💡", color: "#000000" },
  { id: "ronin", name: "Ronin", icon: "🔥", color: "#000000" },
];

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [netWorth, setNetWorth] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [selectedChain, setSelectedChain] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wallets from localStorage on initial render
  useEffect(() => {
    try {
      const savedWallets = localStorage.getItem("portfolioWallets");
      if (savedWallets) {
        const parsedWallets = JSON.parse(savedWallets);
        setWallets(parsedWallets);

        // Select the first wallet by default if available
        if (parsedWallets.length > 0 && !selectedWallet) {
          setSelectedWallet(parsedWallets[0]);
        }
      }
    } catch (err) {
      console.error("Error parsing saved wallets:", err);
    }
  }, []);

  // Save wallets to localStorage whenever they change
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem("portfolioWallets", JSON.stringify(wallets));
    }
  }, [wallets]);

  // Fetch net worth data when selected wallet changes
  useEffect(() => {
    if (selectedWallet) {
      fetchNetWorth(selectedWallet.address);
    }
  }, [selectedWallet]);

  // Fetch tokens when selected wallet or chain changes
  useEffect(() => {
    if (selectedWallet) {
      if (selectedChain === "all") {
        // If "all" is selected, get tokens from the chain with highest value
        if (netWorth && netWorth.chains && netWorth.chains.length > 0) {
          // Sort chains by networth
          const sortedChains = [...netWorth.chains].sort(
            (a, b) => parseFloat(b.networth_usd) - parseFloat(a.networth_usd)
          );

          // Fetch tokens from the chain with highest value
          fetchTokens(selectedWallet.address, sortedChains[0].chain);
        }
      } else {
        // Fetch tokens for the selected chain
        fetchTokens(selectedWallet.address, selectedChain);
      }
    }
  }, [selectedWallet, selectedChain, netWorth]);

  const fetchNetWorth = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      // Construct query parameters for all supported chains
      const chainParams = SUPPORTED_CHAINS.map(
        (chain, index) => `chains[${index}]=${chain.id}`
      ).join("&");

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

      const data = await response.json();
      setNetWorth(data);

      // If we don't have a selected chain yet, pick the one with highest value
      if (selectedChain === "all" && data.chains && data.chains.length > 0) {
        const sortedChains = [...data.chains].sort(
          (a, b) => parseFloat(b.networth_usd) - parseFloat(a.networth_usd)
        );

        // Update tokens for the highest value chain
        fetchTokens(address, sortedChains[0].chain);
      }
    } catch (err) {
      console.error("Error fetching wallet net worth:", err);
      setError("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTokens = async (address: string, chain: string) => {
    setLoading(true);

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

      const data = await response.json();

      // Add chain information to each token
      const tokensWithChain = data.result.map((token: any) => ({
        ...token,
        chain: chain, // Add the chain ID to each token
      }));

      // Sort tokens by USD value (highest first)
      const sortedTokens = tokensWithChain.sort(
        (a: Token, b: Token) =>
          parseFloat(String(b.usd_value || 0)) -
          parseFloat(String(a.usd_value || 0))
      );

      setTokens(sortedTokens);
    } catch (err) {
      console.error("Error fetching wallet tokens:", err);
      setError("Failed to load token data");
    } finally {
      setLoading(false);
    }
  };

  const addWallet = (newWallet: Wallet) => {
    // Check if wallet already exists
    if (
      wallets.some(
        (wallet) =>
          wallet.address.toLowerCase() === newWallet.address.toLowerCase()
      )
    ) {
      return false;
    }

    // Add the new wallet
    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);

    // Select the newly added wallet
    setSelectedWallet(newWallet);
    return true;
  };

  const removeWallet = (address: string) => {
    const updatedWallets = wallets.filter(
      (wallet) => wallet.address !== address
    );
    setWallets(updatedWallets);

    // If we removed the selected wallet, select the first one from the remaining list
    if (selectedWallet && selectedWallet.address === address) {
      setSelectedWallet(updatedWallets.length > 0 ? updatedWallets[0] : null);
    }
  };

  const handleWalletSelect = (wallet: Wallet) => {
    setSelectedWallet(wallet);
  };

  const handleChainSelect = (chainId: string) => {
    setSelectedChain(chainId);
  };

  const handleTokenClick = (token: Token, chain: string) => {
    // Don't navigate if the current chain is "all" or if the token is a native token
    if (
      chain === "all" ||
      token.token_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    ) {
      console.log('Cannot navigate: chain is "all" or token is native');
      return;
    }

    const getTokenPath = (chain: string, address: string) => {
      const chainPathMap: Record<string, string> = {
        eth: "ethereum",
        bsc: "bsc",
        polygon: "polygon",
        arbitrum: "arbitrum",
        avalanche: "avalanche",
        optimism: "optimism",
        base: "base",
        fantom: "fantom",
      };

      return `/${chainPathMap[chain] || chain}/${address}`;
    };

    const path = getTokenPath(chain, token.token_address);
    if (path) {
      navigate(path);
    }
  };

  // Get current chain data
  const getCurrentChainData = () => {
    if (!netWorth || !netWorth.chains) return null;

    if (selectedChain === "all") {
      return {
        networth_usd: netWorth.total_networth_usd,
        chain: "all",
      };
    }

    return (
      netWorth.chains?.find((chain: any) => chain.chain === selectedChain) ||
      null
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Wallet management */}
        <div className="lg:col-span-1">
          <WalletManager
            wallets={wallets}
            selectedWallet={selectedWallet}
            onAddWallet={addWallet}
            onRemoveWallet={removeWallet}
            onSelectWallet={handleWalletSelect}
          />
        </div>

        {/* Right column - Portfolio data */}
        <div className="lg:col-span-2">
          {selectedWallet ? (
            <>
              {/* Net worth display */}
              <NetWorthCard
                netWorth={netWorth}
                loading={loading}
                error={error ?? undefined}
              />

              {/* Chain selector */}
              <ChainSelector
                chains={netWorth?.chains || []}
                selectedChain={selectedChain}
                onChainSelect={handleChainSelect}
              />

              {/* Token holdings */}
              <TokenHoldings
                tokens={tokens}
                loading={loading}
                error={error}
                onTokenClick={handleTokenClick}
                selectedChain={selectedChain}
              />
            </>
          ) : (
            <div className="bg-dex-bg-secondary rounded-lg p-6 text-center">
              <p className="text-dex-text-secondary text-lg">
                Please add a wallet to view your portfolio
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
