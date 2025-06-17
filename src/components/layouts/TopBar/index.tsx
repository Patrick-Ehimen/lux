// components/layout/TopBar/index.js
import React from "react";
import { useNavigate } from "react-router-dom";
import FilterTools from "./FilterTools";
import { networks, pages } from "../../../constant";

const TopBar = ({
  chainId,
  isFiltered,
  openFiltersModal,
  sortBy,
  onSortChange,
}: {
  chainId: string | undefined;
  isFiltered: boolean;
  openFiltersModal: () => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-dex-bg-secondary border-b border-dex-border p-4 sticky top-0 z-20">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Network buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex space-x-2">
            {networks.map((network) => (
              <button
                key={network.id}
                className={`flex items-center px-3 py-2 rounded text-sm ${
                  (network.id === "" && chainId === undefined) ||
                  chainId === network.id
                    ? "bg-dex-blue text-white"
                    : "bg-dex-bg-tertiary text-dex-text-primary hover:bg-dex-bg-highlight"
                }`}
                onClick={() => navigate(`/${network.id}`)}
              >
                <img
                  src={network.icon}
                  alt={network.name}
                  className="mr-1 w-4 h-4"
                />
                {network.name}
              </button>
            ))}
          </div>
        </div>

        {/* Page navigation buttons - now centered */}
        {/* <div className="flex items-center justify-center">
          <div className="flex space-x-2">
            {pages.map((page) => (
              <button
                key={page.id}
                className="flex items-center bg-dex-bg-tertiary hover:bg-dex-bg-highlight text-dex-text-primary rounded px-3 py-2 text-sm"
                onClick={() => navigate(`/${page.id}`)}
              >
                <span className="mr-1">{page.icon}</span>
                {page.name}
              </button>
            ))}
          </div>
        </div> */}

        {/* Sorting and filtering tools */}
        <div className="flex items-center">
          <FilterTools
            isFiltered={isFiltered}
            openFiltersModal={openFiltersModal}
            sortBy={sortBy}
            onSortChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
