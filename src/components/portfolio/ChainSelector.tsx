// components/portfolio/ChainSelector.js
import React, { useRef, useState, useEffect } from "react";

interface Chain {
  chain: string;
  networth_usd: string;
}

const ChainSelector = ({
  chains,
  selectedChain,
  onChainSelect,
}: {
  chains: Chain[];
  selectedChain: string;
  onChainSelect: (chain: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  interface ChainIconMap {
    [key: string]: string;
  }

  const getChainIcon = (chainId: string) => {
    const chainMap: ChainIconMap = {
      eth: "ethereum",
      "0x1": "ethereum",
      solana: "solana",
      bsc: "binance",
      "0x38": "binance",
      polygon: "polygon",
      "0x89": "polygon",
      base: "base",
      "0x2105": "base",
      arbitrum: "arbitrum",
      "0xa4b1": "arbitrum",
      optimism: "optimism",
      "0xa": "optimism",
      linea: "linea",
      "0xe708": "linea",
      fantom: "fantom",
      "0xfa": "fantom",
      pulse: "pulse",
      "0x171": "pulse",
      ronin: "ronin",
      "0x7e4": "ronin",
      avalanche: "avalanche",
      "0xa86a": "avalanche",
    };

    const chain = chainMap[chainId] || "generic";
    return `/images/chains/${chain}.svg`;
  };

  // Get current chain display name
  interface ChainDisplayMap {
    [key: string]: string;
  }

  const getCurrentChainDisplay = () => {
    if (selectedChain === "all") {
      return "All Chains";
    }

    const chainMap: ChainDisplayMap = {
      eth: "Ethereum",
      bsc: "BSC",
      polygon: "Polygon",
      arbitrum: "Arbitrum",
      avalanche: "Avalanche",
      optimism: "Optimism",
      base: "Base",
      fantom: "Fantom",
    };

    return chainMap[selectedChain] || selectedChain.toUpperCase();
  };

  // Format currency for display
  const formatCurrency = (value: string | number | null | undefined) => {
    if (!value) return "$0.00";

    const numValue = parseFloat(String(value));

    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(2)}K`;
    } else {
      return `$${numValue.toFixed(2)}`;
    }
  };

  // Sort chains by value
  const sortedChains = [...(chains || [])].sort(
    (a, b) => parseFloat(b.networth_usd) - parseFloat(a.networth_usd)
  );

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full bg-dex-bg-secondary rounded-lg p-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {selectedChain !== "all" && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2"></div>
          )}
          <span className="font-medium">{getCurrentChainDisplay()}</span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-dex-bg-secondary rounded-lg shadow-lg overflow-hidden">
          <div
            className={`p-3 cursor-pointer hover:bg-dex-bg-highlight ${
              selectedChain === "all" ? "bg-dex-bg-highlight" : ""
            }`}
            onClick={() => {
              onChainSelect("all");
              setIsOpen(false);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">All Chains</div>
            </div>
          </div>

          {sortedChains.map((chain) => (
            <div
              key={chain.chain}
              className={`p-3 cursor-pointer hover:bg-dex-bg-highlight ${
                selectedChain === chain.chain ? "bg-dex-bg-highlight" : ""
              }`}
              onClick={() => {
                onChainSelect(chain.chain);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2">
                    <img
                      src={getChainIcon(chain.chain)}
                      alt={chain.chain}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-medium">
                    {chain.chain === "eth"
                      ? "Ethereum"
                      : chain.chain.toUpperCase()}
                  </div>
                </div>
                <div className="text-sm">
                  {formatCurrency(chain.networth_usd)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainSelector;
