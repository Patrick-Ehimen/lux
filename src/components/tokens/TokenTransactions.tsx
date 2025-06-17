import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const API_KEY = process.env.REACT_APP_MORALIS_API_KEY;

interface Pair {
  pairAddress: string;
  baseToken?: {
    symbol?: string;
  };
  quoteToken?: {
    symbol?: string;
  };
}

interface TokenTransactionsProps {
  pair: Pair | null;
  chainId: string;
}

interface Transaction {
  transactionHash: string;
  blockTimestamp: string;
  transactionType: string;
  totalValueUsd: string;
  baseTokenPriceUsd: string;
  walletAddress: string;
  baseTokenAmount: string;
  quoteTokenAmount: string;
}

interface PairData {
  baseToken: {
    symbol: string;
  } | null;
  quoteToken: {
    symbol: string;
  } | null;
  pairLabel: string | null;
}

const TokenTransactions = ({ pair, chainId }: TokenTransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [newTransactionIds, setNewTransactionIds] = useState<Set<string>>(
    new Set()
  );
  const [pairData, setPairData] = useState<PairData | null>(null);
  const [tableHeight, setTableHeight] = useState(400); // Default height
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const resizeRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Block explorer URLs by chain
  const blockExplorers = {
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

  // Define type for blockExplorers
  interface BlockExplorers {
    [key: string]: string;
  }

  // Initialize resize functionality
  useEffect(() => {
    const resizeHandle = resizeRef.current;
    if (!resizeHandle) return;

    const onMouseDown = (e: MouseEvent) => {
      startYRef.current = e.clientY;
      startHeightRef.current = tableHeight;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const deltaY = startYRef.current - e.clientY;
      const newHeight = Math.max(200, startHeightRef.current + deltaY);
      setTableHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    resizeHandle.addEventListener("mousedown", onMouseDown as any);

    return () => {
      resizeHandle.removeEventListener("mousedown", onMouseDown as any);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [tableHeight]);

  // Set up polling when component mounts and clean up on unmount
  useEffect(() => {
    fetchTransactions();

    // Set up polling interval for real-time updates
    pollInterval.current = setInterval(fetchNewTransactions, 10000); // Poll every 10 seconds

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [pair, chainId]);

  // Fetch initial transactions
  const fetchTransactions = async () => {
    if (!pair || !pair.pairAddress) return;

    setLoading(true);
    try {
      let url;

      if (isSolana) {
        url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pair.pairAddress}/swaps?order=DESC`;
      } else {
        url = `https://deep-index.moralis.io/api/v2.2/pairs/${pair.pairAddress}/swaps?chain=${chainId}&order=DESC`;
      }

      console.log("Fetching transactions from:", url);

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
      console.log("Transactions response:", data);

      if (data) {
        // Store pair data from API response
        setPairData({
          baseToken: data.baseToken || null,
          quoteToken: data.quoteToken || null,
          pairLabel: data.pairLabel || null,
        });

        if (data.result) {
          setCursor(data.cursor || null);
          setTransactions(data.result);
        }
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  // Format numbers with commas
  const formatNumber = (num: number | string, decimals: number = 0) => {
    if (num === undefined || num === null) return "0";

    const parsedNum = parseFloat(num as string);
    return parsedNum.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format prices with appropriate decimal places
  const formatPrice = (price: number | string) => {
    if (!price) return "$0.00";

    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    if (numPrice < 0.0001) {
      return "$" + numPrice.toFixed(8);
    } else if (numPrice < 1) {
      return "$" + numPrice.toFixed(6);
    } else if (numPrice < 10000) {
      return "$" + numPrice.toFixed(5);
    } else {
      return (
        "$" +
        numPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
  };

  // Get explorer URL for the transaction
  const getExplorerUrl = (txHash: string) => {
    const explorer = (blockExplorers as BlockExplorers)[chainId] || "";

    if (!explorer) return "#";

    if (isSolana) {
      return `${explorer}/tx/${txHash}`;
    } else {
      return `${explorer}/tx/${txHash}`;
    }
  };

  // Get wallet explorer URL
  const getWalletExplorerUrl = (walletAddress: string) => {
    const explorer = (blockExplorers as BlockExplorers)[chainId] || "";

    if (!explorer) return "#";

    if (isSolana) {
      return `${explorer}/account/${walletAddress}`;
    } else {
      return `${explorer}/address/${walletAddress}`;
    }
  };

  // Format wallet address (truncate)
  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get transaction direction text and color
  const getTransactionType = (type: string) => {
    if (!type) return { text: "Unknown", color: "text-gray-500" };

    switch (type.toLowerCase()) {
      case "buy":
        return { text: "Buy", color: "text-green-500" };
      case "sell":
        return { text: "Sell", color: "text-red-500" };
      case "addliquidity":
        return { text: "Add Liquidity", color: "text-green-500" };
      case "removeliquidity":
        return { text: "Remove Liquidity", color: "text-red-500" };
      default:
        return {
          text: type.charAt(0).toUpperCase() + type.slice(1),
          color: "text-gray-500",
        };
    }
  };

  // Get value for base token column
  const getBaseTokenValue = (tx: Transaction) => {
    if (!tx.baseTokenAmount) return { value: 0, symbol: "" };

    const value = parseFloat(tx.baseTokenAmount);
    const symbol = pairData?.baseToken?.symbol || pair?.baseToken?.symbol || "";

    return { value, symbol };
  };

  // Get value for quote token column
  const getQuoteTokenValue = (tx: Transaction) => {
    if (!tx.quoteTokenAmount) return { value: 0, symbol: "" };

    const value = parseFloat(tx.quoteTokenAmount);
    const absValue = Math.abs(value);
    const symbol =
      pairData?.quoteToken?.symbol || pair?.quoteToken?.symbol || "";

    return { value: absValue, symbol };
  };

  // Format price with appropriate color
  const formatPriceWithColor = (price: string) => {
    if (!price) return { text: "-", color: "text-gray-500" };

    const formattedPrice = formatPrice(price);
    return {
      text: formattedPrice,
      color: "text-gray-200", // Default color
    };
  };

  // Format value with color based on transaction type
  const formatValueWithColor = (value: string, txType: string) => {
    if (!value) return { text: "-", color: "text-gray-500" };

    const formattedValue = formatNumber(value, 2);
    const color =
      txType.toLowerCase() === "buy" ? "text-green-500" : "text-red-500";

    return {
      text: formattedValue,
      color,
    };
  };

  // Fetch new transactions for real-time updates
  const fetchNewTransactions = async () => {
    if (!pair || !pair.pairAddress) return;

    try {
      let url;

      if (isSolana) {
        url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pair.pairAddress}/swaps?order=DESC`;
      } else {
        url = `https://deep-index.moralis.io/api/v2.2/pairs/${pair.pairAddress}/swaps?chain=${chainId}&order=DESC`;
      }

      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "X-API-Key": API_KEY ?? "",
        },
      });

      if (!response.ok) {
        console.error(`API error during polling: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (data && data.result && data.result.length > 0) {
        // Check if there are new transactions
        const currentTransactionIds = new Set(
          transactions.map((tx) => tx.transactionHash)
        );
        const newTxs = data.result.filter(
          (tx: any) => !currentTransactionIds.has(tx.transactionHash)
        );

        if (newTxs.length > 0) {
          console.log("New transactions found:", newTxs.length);

          // Mark new transactions for animation
          const newIds = new Set<string>(
            newTxs.map((tx: any) => tx.transactionHash)
          );
          setNewTransactionIds(newIds);

          // Merge new transactions with existing ones (new transactions at the top)
          setTransactions((prevTxs) => [...newTxs, ...prevTxs]);

          // Remove animation class after 5 seconds
          setTimeout(() => {
            setNewTransactionIds(new Set());
          }, 5000);
        }
      }
    } catch (err) {
      console.error("Error polling for new transactions:", err);
    }
  };

  if (!pair) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        No pair data available
      </div>
    );
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        Loading transactions...
      </div>
    );
  }

  if (error && transactions.length === 0) {
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
              <th className="px-4 py-3 whitespace-nowrap">DATE</th>
              <th className="px-4 py-3 whitespace-nowrap">TYPE</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">USD</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                {pairData?.baseToken?.symbol ||
                  pair?.baseToken?.symbol ||
                  "TOKEN"}
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                {pairData?.quoteToken?.symbol ||
                  pair?.quoteToken?.symbol ||
                  "QUOTE"}
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">PRICE</th>
              <th className="px-4 py-3 whitespace-nowrap">MAKER</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">TXN</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              const txType = getTransactionType(tx.transactionType);
              const baseToken = getBaseTokenValue(tx);
              const quoteToken = getQuoteTokenValue(tx);
              const usdValue = formatValueWithColor(
                tx.totalValueUsd,
                tx.transactionType
              );
              const price = formatPriceWithColor(tx.baseTokenPriceUsd);
              const isNew = newTransactionIds.has(tx.transactionHash);

              // Create a unique key using transaction hash and index
              const uniqueKey = `${tx.transactionHash}_${index}`;

              return (
                <tr
                  key={uniqueKey}
                  className={`border-b border-dex-border hover:bg-dex-bg-secondary/50 ${
                    isNew ? "animate-slide-in bg-dex-bg-highlight" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-dex-text-secondary whitespace-nowrap">
                    {formatTimeAgo(tx.blockTimestamp)}
                  </td>
                  <td
                    className={`px-4 py-3 ${txType.color} font-medium whitespace-nowrap`}
                  >
                    {txType.text}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${usdValue.color} whitespace-nowrap`}
                  >
                    {usdValue.text}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {baseToken.value ? formatNumber(baseToken.value, 4) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {quoteToken.value ? formatNumber(quoteToken.value, 4) : "-"}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${price.color} whitespace-nowrap`}
                  >
                    {price.text}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={getWalletExplorerUrl(tx.walletAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono hover:text-dex-blue flex items-center"
                    >
                      <span className="bg-dex-bg-tertiary text-dex-text-primary px-1 rounded mr-1">
                        🦊
                      </span>
                      {formatWalletAddress(tx.walletAddress)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={getExplorerUrl(tx.transactionHash)}
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

export default TokenTransactions;
