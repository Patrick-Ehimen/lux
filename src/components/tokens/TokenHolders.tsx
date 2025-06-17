// components/token/TokenHolders.js
import React, { useState, useEffect, useRef } from "react";
import { API_KEY } from "../../configs";

interface Token {
  address: string;
  [key: string]: any; // Add more specific fields if known
}

interface TokenHoldersProps {
  token: Token;
  chainId: string;
}

const TokenHolders: React.FC<TokenHoldersProps> = ({ token, chainId }) => {
  const [holders, setHolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableHeight, setTableHeight] = useState(400); // Default height
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const resizeRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Block explorer URLs by chain
  const blockExplorers: { [key: string]: string } = {
    "0x1": "https://etherscan.io",
    "0x38": "https://bscscan.com",
    "0x89": "https://polygonscan.com",
    "0xa4b1": "https://arbiscan.io",
    "0xa": "https://optimistic.etherscan.io",
    "0x2105": "https://basescan.org",
    "0xa86a": "https://snowtrace.io",
    "0xe708": "https://lineascan.build",
    "0xfa": "https://ftmscan.com",
    "0x171": "https://scan.pulsechain.com",
    "0x7e4": "https://app.roninchain.com",
    solana: "https://solscan.io",
  };

  const isSolana = chainId === "solana";

  // Initialize resize functionality
  useEffect(() => {
    const resizeHandle = resizeRef.current;
    if (!resizeHandle) return;

    const onMouseDown = (e: any) => {
      startYRef.current = e.clientY;
      startHeightRef.current = tableHeight;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: any) => {
      const deltaY = startYRef.current - e.clientY;
      const newHeight = Math.max(200, startHeightRef.current + deltaY);
      setTableHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    resizeHandle.addEventListener("mousedown", onMouseDown);

    return () => {
      resizeHandle.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [tableHeight]);

  // Fetch holders data when component mounts
  useEffect(() => {
    if (token && token.address && !isSolana) {
      fetchHolders();
    }
  }, [token, chainId]);

  // Fetch holders data
  const fetchHolders = async (nextCursor = null) => {
    if (!token || !token.address || isSolana) return;

    setLoading(true);
    try {
      let url = `https://deep-index.moralis.io/api/v2.2/erc20/${token.address}/owners?chain=${chainId}&order=DESC`;

      if (nextCursor) {
        url += `&cursor=${nextCursor}`;
      }

      console.log("Fetching holders from:", url);

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
      console.log("Holders response:", data);

      if (data && data.result) {
        if (nextCursor) {
          setHolders((prev) => [...prev, ...data.result]);
        } else {
          setHolders(data.result);
        }

        setCursor(data.cursor);
        setHasMore(data.result.length > 0 && data.cursor);
      }
    } catch (err) {
      console.error("Error fetching holders:", err);
      setError("Failed to load holders data");
    } finally {
      setLoading(false);
    }
  };

  // Load more holders
  const loadMore = () => {
    if (cursor && hasMore && !loading) {
      fetchHolders(cursor);
    }
  };

  // Format wallet address (truncate)
  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get wallet explorer URL
  const getWalletExplorerUrl = (walletAddress: string) => {
    const explorer = blockExplorers[chainId] || "";
    if (!explorer) return "#";
    return `${explorer}/address/${walletAddress}`;
  };

  // Format numbers with commas
  const formatNumber = (num: string, decimals = 0) => {
    if (num === undefined || num === null) return "0";

    const parsedNum = parseFloat(num);
    return parsedNum.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format USD values
  const formatUsd = (value: string) => {
    if (!value) return "$0.00";

    const numValue = typeof value === "string" ? parseFloat(value) : value;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  // Format percentage values
  const formatPercentage = (value: string) => {
    if (!value) return "0%";

    const numValue = typeof value === "string" ? parseFloat(value) : value;

    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue / 100);
  };

  if (isSolana) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        Holder data is not available for Solana tokens
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        No token data available
      </div>
    );
  }

  if (loading && holders.length === 0) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        Loading holders data...
      </div>
    );
  }

  if (error && holders.length === 0) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">{error}</div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div
        className="overflow-auto border border-dex-border bg-dex-bg-primary"
        style={{ height: `${tableHeight}px` }}
      >
        <table
          ref={tableRef}
          className="w-full text-sm text-left border-collapse"
        >
          <thead className="text-xs uppercase bg-dex-bg-secondary sticky top-0 z-10">
            <tr className="border-b border-dex-border">
              <th className="px-4 py-3 whitespace-nowrap">RANK</th>
              <th className="px-4 py-3 whitespace-nowrap">WALLET</th>
              <th className="px-4 py-3 whitespace-nowrap">ENTITY</th>
              <th className="px-4 py-3 whitespace-nowrap">TYPE</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                BALANCE
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                VALUE (USD)
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                % OF SUPPLY
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">EXP</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((holder, index) => {
              return (
                <tr
                  key={`${holder.owner_address}_${index}`}
                  className="border-b border-dex-border hover:bg-dex-bg-secondary/50"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={getWalletExplorerUrl(holder.owner_address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono hover:text-dex-blue flex items-center"
                    >
                      <span className="bg-dex-bg-tertiary text-dex-text-primary px-1 rounded mr-1">
                        {holder.is_contract ? "📄" : "👤"}
                      </span>
                      {formatWalletAddress(holder.owner_address)}
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {holder.owner_address_label ? (
                      <div className="flex items-center">
                        {holder.entity_logo && (
                          <img
                            src={holder.entity_logo}
                            alt={holder.entity || "Entity"}
                            className="w-4 h-4 mr-1 rounded-full"
                          />
                        )}
                        <span className="text-dex-text-primary">
                          {holder.owner_address_label}
                        </span>
                      </div>
                    ) : (
                      <span className="text-dex-text-secondary">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {holder.is_contract ? (
                      <span className="bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded text-xs">
                        Contract
                      </span>
                    ) : (
                      <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded text-xs">
                        Wallet
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap font-mono">
                    {formatNumber(holder.balance_formatted, 4)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatUsd(holder.usd_value)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatPercentage(
                      holder.percentage_relative_to_total_supply
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={getWalletExplorerUrl(holder.owner_address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-dex-text-secondary hover:text-dex-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="mt-2 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-dex-bg-secondary hover:bg-dex-blue/20 text-dex-text-primary rounded"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Resize handle */}
      <div
        ref={resizeRef}
        className="h-2 bg-dex-bg-secondary hover:bg-dex-blue cursor-ns-resize flex items-center justify-center"
      >
        <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default TokenHolders;
