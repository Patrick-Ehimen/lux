import React, { useState, useEffect } from "react";

interface Token {
  isNew: boolean;
  logo?: string;
  symbol?: string;
  name?: string;
  priceUsd: number;
  liquidity: number;
  fullyDilutedValuation: number;
  createdAt: string | number | Date;
}

interface NewTokenCardProps {
  token: Token;
  formatPrice: (price: number) => string;
  formatNumber: (num: number) => string;
  formatTimeAgo: (date: string | number | Date) => string;
  onClick?: () => void;
}

const NewTokenCard: React.FC<NewTokenCardProps> = ({
  token,
  formatPrice,
  formatNumber,
  formatTimeAgo,
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(!token.isNew);

  // Animation for new tokens
  useEffect(() => {
    if (token.isNew) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [token.isNew]);

  return (
    <div
      className={`bg-dex-bg-secondary rounded-lg overflow-hidden border border-dex-border cursor-pointer transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      } hover:border-green-500 ${token.isNew ? "animate-pulse-green" : ""}`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-green-800 mr-3 flex items-center justify-center overflow-hidden">
            {token.logo ? (
              <img
                src={token.logo}
                alt={token.symbol}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.onerror = null;
                  img.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzJmNGEyNSIvPjwvc3ZnPg==";
                }}
              />
            ) : (
              <span className="text-white font-bold">
                {token.symbol ? token.symbol.charAt(0) : "?"}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-white">{token.symbol}</h3>
            <p className="text-sm text-dex-text-secondary truncate max-w-[200px]">
              {token.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-dex-text-secondary">Price</p>
            <p className="font-medium text-white">
              {formatPrice(token.priceUsd)}
            </p>
          </div>
          <div>
            <p className="text-xs text-dex-text-secondary">Liquidity</p>
            <p className="font-medium text-white">
              {formatNumber(token.liquidity)}
            </p>
          </div>
          <div>
            <p className="text-xs text-dex-text-secondary">FDV</p>
            <p className="font-medium text-white">
              {formatNumber(token.fullyDilutedValuation)}
            </p>
          </div>
          <div>
            <p className="text-xs text-dex-text-secondary">Created</p>
            <p className="font-medium text-white">
              {formatTimeAgo(token.createdAt)}
            </p>
          </div>
        </div>

        <div className="text-xs bg-green-900/30 text-green-400 py-1 px-2 rounded-full inline-block">
          New Token
        </div>
      </div>
    </div>
  );
};

export default NewTokenCard;
