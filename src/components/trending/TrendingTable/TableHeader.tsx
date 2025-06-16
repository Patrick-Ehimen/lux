import React from "react";

interface TableHeaderProps {
  sortBy: string;
  sortDirection: string;
  onSortChange: (column: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  sortBy,
  sortDirection,
  onSortChange,
}) => {
  const renderSortIcon = (column: any) => {
    if (sortBy !== column) return null;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <tr className="text-xs uppercase text-dex-text-secondary border-b border-dex-border">
      {/* Sticky columns */}
      <th className="sticky left-0  bg-dex-bg-primary px-4 py-3 text-left w-4">
        #
      </th>
      <th className="sticky left-44 bg-dex-bg-primary px-4 py-3 text-left w-36">
        TOKEN
      </th>
      {/* Scrollable columns */}
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[100px]"
        onClick={() => onSortChange("usdPrice")}
      >
        PRICE {renderSortIcon("usdPrice")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[80px]"
        onClick={() => onSortChange("createdAt")}
      >
        AGE {renderSortIcon("createdAt")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[90px]"
        onClick={() => onSortChange("transactions.24h")}
      >
        TXNS {renderSortIcon("transactions.24h")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[110px]"
        onClick={() => onSortChange("totalVolume.24h")}
      >
        VOLUME {renderSortIcon("totalVolume.24h")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[90px]"
        onClick={() => onSortChange("buyers.24h")}
      >
        MAKERS {renderSortIcon("buyers.24h")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[70px]"
        onClick={() => onSortChange("pricePercentChange.5m")}
      >
        5M {renderSortIcon("pricePercentChange.5m")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[70px]"
        onClick={() => onSortChange("pricePercentChange.1h")}
      >
        1H {renderSortIcon("pricePercentChange.1h")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[70px]"
        onClick={() => onSortChange("pricePercentChange.12h")}
      >
        12H {renderSortIcon("pricePercentChange.12h")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[70px]"
        onClick={() => onSortChange("pricePercentChange.24h")}
      >
        24H {renderSortIcon("pricePercentChange.24h")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[110px]"
        onClick={() => onSortChange("liquidityUsd")}
      >
        LIQUIDITY {renderSortIcon("liquidityUsd")}
      </th>
      <th
        className="px-4 py-3 text-right cursor-pointer min-w-[110px]"
        onClick={() => onSortChange("marketCap")}
      >
        MCAP {renderSortIcon("marketCap")}
      </th>
    </tr>
  );
};

export default TableHeader;
