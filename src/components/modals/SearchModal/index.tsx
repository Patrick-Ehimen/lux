// components/modals/searchModal/index.js
import React, { useState, useEffect, useRef } from "react";
import SearchResults from "./SearchResults";
import { getTrendingTokens } from "../../../services/getTrendingTokens";
import { API_KEY } from "../../../configs";
import { SearchModalProps } from "../../../types/type";

const API_ENDPOINT = "https://deep-index.moralis.io/api/v2.2/tokens/search";

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<TokenResult[]>([]);
  const [trendingTokens, setTrendingTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef(null);

  // Pre-fetch trending tokens when component mounts
  useEffect(() => {
    fetchTrendingTokens();
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }

    // Add event listeners for escape key and outside clicks
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        modalRef.current &&
        e.target instanceof Node &&
        !(modalRef.current as HTMLElement).contains(e.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        searchTokens(searchTerm);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchTrendingTokens = async () => {
    try {
      // Fetch a limited number of trending tokens
      const data = await getTrendingTokens("", 10);
      setTrendingTokens(data);
    } catch (error) {
      console.error("Error fetching trending tokens:", error);
    }
  };

  interface TokenResult {
    address: string;
    name: string;
    symbol: string;
    logo?: string;
    [key: string]: any;
  }

  interface SearchResponse {
    result: TokenResult[];
    [key: string]: any;
  }

  const searchTokens = async (query: string): Promise<void> => {
    if (!query) return;

    setLoading(true);
    try {
      const response: Response = await fetch(
        `${API_ENDPOINT}?query=${encodeURIComponent(
          query
        )}&chains=eth,bsc,polygon,arbitrum,optimism,solana,base`,
        {
          headers: {
            accept: "application/json",
            "X-API-Key": API_KEY ?? "",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data: SearchResponse = await response.json();
      setResults(data.result || []);
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to empty results if API fails
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="bg-dex-bg-secondary rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-dex-border">
          <div className="flex items-center">
            <div className="flex-1 flex items-center bg-dex-bg-primary rounded-lg px-3 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-dex-text-secondary mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for tokens (e.g. ETH, BTC, PEPE)"
                className="bg-transparent w-full focus:outline-none text-dex-text-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-dex-text-secondary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(80vh-70px)]">
          {searchTerm.trim() ? (
            loading ? (
              <div className="p-4 text-center text-dex-text-secondary">
                Searching...
              </div>
            ) : (
              <SearchResults results={results} onClose={onClose} />
            )
          ) : (
            <div>
              <div className="p-4 border-b border-dex-border">
                <h3 className="text-dex-text-primary font-medium">
                  Trending Tokens
                </h3>
                <p className="text-dex-text-secondary text-sm">
                  Popular tokens right now
                </p>
              </div>
              <SearchResults results={trendingTokens} onClose={onClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
