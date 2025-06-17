import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { API_KEY } from "../../configs";

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

interface HolderChangeData {
  change: number;
  changePercent: number;
}

interface HolderSupplyData {
  supplyPercent: number;
}

interface HoldersByAcquisition {
  swap: number;
  transfer: number;
  airdrop: number;
}

interface InsightsData {
  holdersByAcquisition?: HoldersByAcquisition;
  totalHolders?: number;
  holderChange?: { [key: string]: HolderChangeData };
  holderSupply?: { [key: string]: HolderSupplyData };
}

const TokenHolderInsights = ({
  token,
  chainId,
}: {
  token: any;
  chainId: string;
}) => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSolana = chainId === "solana";

  // Fetch holder insights data
  useEffect(() => {
    if (!token || !token.address || isSolana) {
      setLoading(false);
      return;
    }

    const fetchHolderInsights = async () => {
      setLoading(true);
      try {
        const url = `https://deep-index.moralis.io/api/v2.2/erc20/${token.address}/holders?chain=${chainId}`;

        console.log("Fetching holder insights from:", url);

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
        console.log("Holder insights response:", data);
        setInsights(data);
      } catch (err) {
        console.error("Error fetching holder insights:", err);
        setError("Failed to load holder insights data");
      } finally {
        setLoading(false);
      }
    };

    fetchHolderInsights();
  }, [token, chainId, isSolana]);

  // Format percentage values
  const formatPercentage = (value: any) => {
    if (!value && value !== 0) return "0%";

    const numValue = typeof value === "string" ? parseFloat(value) : value;

    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue / 100);
  };

  // Format numbers with commas
  const formatNumber = (num: string | number, decimals = 0) => {
    if (num === undefined || num === null) return "0";

    const parsedNum = typeof num === "number" ? num : parseFloat(num);
    return parsedNum.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Prepare data for acquisition chart
  const prepareAcquisitionData = () => {
    if (!insights || !insights.holdersByAcquisition)
      return { labels: [], datasets: [] };

    const { swap, transfer, airdrop } = insights.holdersByAcquisition;

    return {
      labels: ["Swap", "Transfer", "Airdrop"],
      datasets: [
        {
          data: [swap || 0, transfer || 0, airdrop || 0],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(139, 92, 246)",
            "rgb(16, 185, 129)",
          ],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  };

  // Chart options for acquisition chart
  const acquisitionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%",
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#9ca3af",
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw;
            const total = context.dataset.data.reduce(
              (a: any, b: any) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${formatNumber(value)} (${percentage}%)`;
          },
        },
        backgroundColor: "#1f2937",
        titleColor: "#f3f4f6",
        bodyColor: "#f3f4f6",
        borderColor: "#374151",
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  if (isSolana) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        Holder insights are not available for Solana tokens
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

  if (loading) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        Loading holder insights...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">{error}</div>
    );
  }

  if (!insights) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        No holder insights available
      </div>
    );
  }

  const acquisitionData = prepareAcquisitionData();
  const totalHolders = insights.totalHolders || 0;

  // Calculate percentages for acquisition
  const { swap, transfer, airdrop } = insights.holdersByAcquisition || {};
  const swapPercent = swap ? (swap / totalHolders) * 100 : 0;
  const transferPercent = transfer ? (transfer / totalHolders) * 100 : 0;
  const airdropPercent = airdrop ? (airdrop / totalHolders) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Holders Trend Card */}
      <div className="bg-dex-bg-secondary rounded-lg p-4 border border-dex-border">
        <h3 className="text-lg font-semibold text-dex-text-primary mb-1">
          Holders Trend
        </h3>
        <p className="text-sm text-dex-text-secondary mb-4">
          Change in amount over time.
        </p>

        <div className="space-y-4">
          {insights.holderChange &&
            Object.entries(insights.holderChange)
              .sort((a, b) => {
                const order = ["5min", "1h", "6h", "24h", "3d", "7d", "30d"];
                return order.indexOf(a[0]) - order.indexOf(b[0]);
              })
              .map(([timeframe, data]) => (
                <div
                  key={timeframe}
                  className="flex justify-between items-center border-b border-dex-border pb-2"
                >
                  <span className="uppercase font-medium">{timeframe}</span>
                  <div className="flex items-center">
                    <span
                      className={`mr-2 ${
                        data.change > 0
                          ? "text-green-500"
                          : data.change < 0
                          ? "text-red-500"
                          : "text-dex-text-secondary"
                      }`}
                    >
                      {data.change > 0 ? "+" : ""}
                      {formatNumber(data.change)}
                    </span>
                    <span
                      className={`flex items-center ${
                        data.changePercent > 0
                          ? "text-green-500"
                          : data.changePercent < 0
                          ? "text-red-500"
                          : "text-dex-text-secondary"
                      }`}
                    >
                      {data.changePercent > 0 ? (
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 15l7-7 7 7"
                          ></path>
                        </svg>
                      ) : data.changePercent < 0 ? (
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      ) : null}
                      {Math.abs(data.changePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Supply Distribution Card */}
      <div className="bg-dex-bg-secondary rounded-lg p-4 border border-dex-border">
        <h3 className="text-lg font-semibold text-dex-text-primary mb-1">
          Supply Distribution
        </h3>
        <p className="text-sm text-dex-text-secondary mb-4">
          Total supply distribution among top holders.
        </p>

        <div className="space-y-4">
          {insights.holderSupply &&
            Object.entries(insights.holderSupply).map(([tier, data]) => (
              <div key={tier} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="capitalize font-medium">
                    {tier.replace("top", "Top ")}
                  </span>
                  <span>{data.supplyPercent}%</span>
                </div>
                <div className="w-full bg-dex-bg-primary rounded-full h-2.5">
                  <div
                    className="bg-dex-blue h-2.5 rounded-full"
                    style={{ width: `${data.supplyPercent}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Holders Acquisition Card */}
      <div className="bg-dex-bg-secondary rounded-lg p-4 border border-dex-border">
        <h3 className="text-lg font-semibold text-dex-text-primary mb-1">
          Holders Acquisition
        </h3>
        <p className="text-sm text-dex-text-secondary mb-4">
          Based on the wallet's first interaction.
        </p>

        <div className="h-64 flex items-center justify-center">
          <Doughnut data={acquisitionData} options={acquisitionOptions} />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-blue-500"></span>
            <span className="text-dex-text-primary">Swap</span>
            <span className="ml-auto">{formatPercentage(swapPercent)}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-purple-500"></span>
            <span className="text-dex-text-primary">Transfer</span>
            <span className="ml-auto">{formatPercentage(transferPercent)}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
            <span className="text-dex-text-primary">Airdrop</span>
            <span className="ml-auto">{formatPercentage(airdropPercent)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenHolderInsights;
