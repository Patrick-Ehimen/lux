// components/layout/TopBar/FilterTools.js
import React from "react";

const FilterTools = ({
  isFiltered,
  openFiltersModal,
  sortBy,
  onSortChange,
}: {
  isFiltered: boolean;
  openFiltersModal: () => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}) => {
  // Handle sort selection change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSortChange(value);
  };

  return (
    <div className="flex space-x-2">
      <div className="flex items-center text-dex-text-secondary">
        <span className="mr-2">Sort by:</span>
        <select
          className="bg-dex-bg-tertiary rounded px-2 py-1 text-dex-text-primary"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">No sorting</option>
          <option value="volumeUsd.oneDay">Volume 24H</option>
          <option value="marketCap">Market Cap</option>
          <option value="transactions.oneDay">Transactions 24H</option>
          <option value="liquidityUsd">Liquidity</option>
          <option value="usdPricePercentChange.oneDay">Price Change 24H</option>
          <option value="buyers.oneDay">Makers</option>
        </select>
      </div>

      <button
        className="bg-dex-bg-tertiary hover:bg-dex-bg-highlight text-dex-text-primary rounded px-3 py-1"
        onClick={openFiltersModal}
      >
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          Advanced Filters{" "}
          {isFiltered && <span className="ml-1 text-dex-blue">•</span>}
        </span>
      </button>
    </div>
  );
};

export default FilterTools;
