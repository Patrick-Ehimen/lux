// components/token/TokenSnipers.js
import React, { useState, useEffect, useRef } from "react";
import { API_KEY } from "../../configs";

interface TokenSnipersProps {
  pair: {
    pairAddress?: string;
    [key: string]: any;
  };
  chainId: string;
}

interface Sniper {
  walletAddress: string;
  realizedProfitPercentage: number;
  realizedProfitUsd: number;
  totalSnipedTransactions: number;
  totalSellTransactions: number;
  totalSnipedUsd: number;
  totalSoldUsd: number;
  currentBalanceUsdValue: number;
  snipedTransactions: Array<{
    transactionTimestamp: string | number;
    [key: string]: any;
  }>;
  [key: string]: any;
}

const TokenSnipers: React.FC<TokenSnipersProps> = ({ pair, chainId }) => {
  const [snipers, setSnipers] = useState<Sniper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableHeight, setTableHeight] = useState(400); // Default height
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

    (resizeHandle as HTMLDivElement).addEventListener("mousedown", onMouseDown);

    return () => {
      resizeHandle.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [tableHeight]);

  // Fetch snipers data when component mounts
  useEffect(() => {
    fetchSnipers();
  }, [pair, chainId]);

  // Fetch snipers data
  const fetchSnipers = async () => {
    if (!pair || !pair.pairAddress) return;

    setLoading(true);
    try {
      let url;
      // Use 1000 blocks after creation as default parameter
      const blocksAfterCreation = 1000;

      if (isSolana) {
        url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pair.pairAddress}/snipers?blocksAfterCreation=${blocksAfterCreation}`;
      } else {
        url = `https://deep-index.moralis.io/api/v2.2/pairs/${pair.pairAddress}/snipers?chain=${chainId}&blocksAfterCreation=${blocksAfterCreation}`;
      }

      console.log("Fetching snipers from:", url);

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
      console.log("Snipers response:", data);

      if (data && data.result) {
        setSnipers(data.result);
      }
    } catch (err) {
      console.error("Error fetching snipers:", err);
      setError("Failed to load snipers data");
    } finally {
      setLoading(false);
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

    if (isSolana) {
      return `${explorer}/account/${walletAddress}`;
    } else {
      return `${explorer}/address/${walletAddress}`;
    }
  };

  // Get explorer URL for the transaction
  const getExplorerUrl = (txHash: any) => {
    const explorer = blockExplorers[chainId] || "";

    if (!explorer) return "#";

    if (isSolana) {
      return `${explorer}/tx/${txHash}`;
    } else {
      return `${explorer}/tx/${txHash}`;
    }
  };

  // Format numbers with commas
  const formatNumber = (num: any, decimals = 0) => {
    if (num === undefined || num === null) return "0";

    const parsedNum = parseFloat(num);
    return parsedNum.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format USD values
  const formatUsd = (value: string | number) => {
    if (value === undefined || value === null || value === "") return "$0.00";

    const numValue = typeof value === "string" ? parseFloat(value) : value;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  // Format percentage values
  const formatPercentage = (value: string | number) => {
    if (value === undefined || value === null || value === "") return "0%";

    const numValue = typeof value === "string" ? parseFloat(value) : value;

    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue / 100);
  };

  // Get first transaction timestamp
  const getFirstTransactionTime = (sniper: any) => {
    if (!sniper.snipedTransactions || sniper.snipedTransactions.length === 0) {
      return "Unknown";
    }

    const firstTx = sniper.snipedTransactions[0];
    return formatTimestamp(firstTx.transactionTimestamp);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get profit color based on percentage
  const getProfitColor = (percentage: any) => {
    if (!percentage) return "text-gray-500";
    return percentage > 0 ? "text-green-500" : "text-red-500";
  };

  if (!pair) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        No pair data available
      </div>
    );
  }

  if (loading && snipers.length === 0) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        Loading snipers data...
      </div>
    );
  }

  if (error && snipers.length === 0) {
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
              <th className="px-4 py-3 whitespace-nowrap">WALLET</th>
              <th className="px-4 py-3 whitespace-nowrap">FIRST BUY</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">BUYS</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">SELLS</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                BOUGHT (USD)
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                SOLD (USD)
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                PROFIT (USD)
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">ROI</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                CURRENT BALANCE
              </th>
            </tr>
          </thead>
          <tbody>
            {snipers.map((sniper, index) => {
              const profitColor = getProfitColor(
                sniper.realizedProfitPercentage
              );

              return (
                <tr
                  key={`${sniper.walletAddress}_${index}`}
                  className="border-b border-dex-border hover:bg-dex-bg-secondary/50"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={getWalletExplorerUrl(sniper.walletAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono hover:text-dex-blue flex items-center"
                    >
                      <span className="bg-dex-bg-tertiary text-dex-text-primary px-1 rounded mr-1">
                        🦊
                      </span>
                      {formatWalletAddress(sniper.walletAddress)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-dex-text-secondary whitespace-nowrap">
                    {getFirstTransactionTime(sniper)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {sniper.totalSnipedTransactions || 0}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {sniper.totalSellTransactions || 0}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatUsd(sniper.totalSnipedUsd)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatUsd(sniper.totalSoldUsd)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${profitColor} whitespace-nowrap font-medium`}
                  >
                    {formatUsd(sniper.realizedProfitUsd)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${profitColor} whitespace-nowrap font-medium`}
                  >
                    {formatPercentage(sniper.realizedProfitPercentage)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatUsd(sniper.currentBalanceUsdValue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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

export default TokenSnipers;
