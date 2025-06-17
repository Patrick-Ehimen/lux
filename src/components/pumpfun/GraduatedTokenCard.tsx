import React from "react";

type GraduatedTokenCardProps = {
  token: {
    logo?: string;
    symbol?: string;
    name?: string;
    priceUsd: number;
    liquidity: number;
    fullyDilutedValuation: number;
    graduatedAt: string | number | Date;
  };
  formatPrice: (price: number) => string;
  formatNumber: (value: number) => string;
  formatTimeAgo: (date: string | number | Date) => string;
  onClick?: () => void;
};

const GraduatedTokenCard: React.FC<GraduatedTokenCardProps> = ({
  token,
  formatPrice,
  formatNumber,
  formatTimeAgo,
  onClick,
}) => {
  return (
    <div
      className="bg-dex-bg-secondary rounded-lg overflow-hidden border border-dex-border cursor-pointer transition-all hover:border-purple-500"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-purple-800 mr-3 flex items-center justify-center overflow-hidden">
            {token.logo ? (
              <img
                src={token.logo}
                alt={token.symbol}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.onerror = null;
                  img.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzQzMmE3NCIvPjwvc3ZnPg==";
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
            <p className="text-xs text-dex-text-secondary">Graduated</p>
            <p className="font-medium text-white">
              {formatTimeAgo(token.graduatedAt)}
            </p>
          </div>
        </div>

        <div className="text-xs bg-purple-900/30 text-purple-400 py-1 px-2 rounded-full inline-block">
          Graduated Token
        </div>
      </div>
    </div>
  );
};

export default GraduatedTokenCard;
