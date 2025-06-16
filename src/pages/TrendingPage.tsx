// pages/TrendingPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/layouts/TopBar";
import { getTrendingTokens } from "../services/getTrendingTokens";
import FiltersModal from "../components/modals/FiltersModal";
import TrendingTable from "../components/trending";

// Map URL path segments to chain IDs for API
const PATH_TO_CHAIN_ID: Record<string, string> = {
  ethereum: "0x1",
  binance: "0x38",
  bsc: "0x38", // Alternative name
  polygon: "0x89",
  solana: "solana",
  arbitrum: "0xa4b1",
  base: "0x2105",
  avalanche: "0xa86a",
  optimism: "0xa",
  linea: "0xe708",
  fantom: "0xfa",
  pulse: "0x171",
  ronin: "0x7e4",
};

const TrendingPage = () => {
  const { chainId } = useParams();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isFiltersModalOpen, setFiltersModalOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  // Add the handler for applying filters
  const handleApplyFilters = (filteredTokens: any) => {
    setTokens(filteredTokens);
    setIsFiltered(true);
  };

  useEffect(() => {
    fetchTokens();
  }, [chainId]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      // Convert URL path parameter to chain ID for API
      const apiChainId = chainId ? PATH_TO_CHAIN_ID[chainId] || chainId : "";
      console.log(
        `Fetching tokens for chain: ${apiChainId} (from URL: ${chainId})`
      );

      const data = await getTrendingTokens(apiChainId);
      setTokens(data);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (column: any) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar
        chainId={chainId}
        isFiltered={isFiltered}
        openFiltersModal={() => setFiltersModalOpen(true)}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
      <TrendingTable
        tokens={tokens}
        loading={loading}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default TrendingPage;
