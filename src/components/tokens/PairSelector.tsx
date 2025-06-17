import React, { useState } from "react";

type Pair = {
  pairAddress: string;
  pairLabel: string;
  exchangeLogo?: string;
  exchangeName: string;
  liquidityUsd: number;
};

type PairSelectorProps = {
  pairs: Pair[];
  selectedPair: Pair;
  onSelect: (pairAddress: string) => void;
};

const PairSelector: React.FC<PairSelectorProps> = ({
  pairs,
  selectedPair,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatLiquidity = (value: any) => {
    if (!value) return "$0";

    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (pairAddress: any) => {
    onSelect(pairAddress);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full p-2 bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight transition-colors"
        onClick={toggleDropdown}
      >
        <div className="flex flex-col">
          <div className="flex items-center">
            <img
              src={
                selectedPair?.exchangeLogo ||
                "/images/exchanges/default-exchange.svg"
              }
              alt={selectedPair?.exchangeName}
              className="w-5 h-5 mr-2 rounded-full"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
              }}
            />
            <span className="font-medium">{selectedPair?.pairLabel}</span>
          </div>
          <span className="text-dex-text-secondary text-xs ml-7">
            on {selectedPair?.exchangeName}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-dex-text-secondary text-xs mr-3">
            Liquidity: {formatLiquidity(selectedPair?.liquidityUsd)}
          </span>
          <svg
            className="inline-block w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-dex-bg-tertiary rounded-md shadow-lg max-h-60 overflow-auto">
          {pairs.map((pair: any) => (
            <button
              key={pair.pairAddress}
              className={`flex items-center justify-between w-full p-3 text-left hover:bg-dex-bg-highlight ${
                selectedPair?.pairAddress === pair.pairAddress
                  ? "bg-dex-bg-highlight"
                  : ""
              }`}
              onClick={() => handleSelect(pair.pairAddress)}
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <img
                    src={
                      pair.exchangeLogo ||
                      "/images/exchanges/default-exchange.svg"
                    }
                    alt={pair.exchangeName}
                    className="w-5 h-5 mr-2 rounded-full"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.onerror = null;
                      img.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
                    }}
                  />
                  <span className="font-medium">{pair.pairLabel}</span>
                </div>
                <span className="text-dex-text-secondary text-xs ml-7">
                  on {pair.exchangeName}
                </span>
              </div>
              <div className="text-dex-text-secondary text-xs">
                {formatLiquidity(pair.liquidityUsd)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PairSelector;
