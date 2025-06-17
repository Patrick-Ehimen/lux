// components/token/TokenChart.js
import React, { useEffect, useState, useRef } from "react";

// Extend the Window interface to include destroyMyWidget
declare global {
  interface Window {
    destroyMyWidget?: (containerId: string) => void;
    createMyWidget?: (containerId: string, options: any) => void;
  }
}

const PRICE_CHART_ID = "price-chart-widget-container";

export type TimeFrame = "5m" | "15m" | "1h" | "4h" | "1d";

interface TokenChartProps {
  pair: any;
  timeFrame: TimeFrame;
  onTimeFrameChange?: (tf: TimeFrame) => void;
}

const TokenChart: React.FC<TokenChartProps> = ({
  pair,
  timeFrame,
  onTimeFrameChange,
}) => {
  const [priceType, setPriceType] = useState("price");
  const containerRef = useRef(null);

  // Map our timeframe to chart widget timeframe format
  const timeframeMap = {
    "5m": "5",
    "15m": "15",
    "1h": "60",
    "4h": "240",
    "1d": "1D",
  };

  useEffect(() => {
    if (!pair || !pair.pairAddress || typeof window === "undefined") return;

    // Get the appropriate chain ID format for the chart widget
    const getChartChainId = () => {
      // For Solana pairs, use "solana" as the chain ID
      if (
        pair.chainId === "solana" ||
        pair.exchangeName?.toLowerCase().includes("solana")
      ) {
        return "solana";
      }

      // For EVM chains, use the hex format
      return pair.chainId || "0x1";
    };

    const loadWidget = () => {
      if (typeof window.createMyWidget === "function") {
        // Get the correct chain ID format
        const chartChainId = getChartChainId();

        window.createMyWidget(PRICE_CHART_ID, {
          autoSize: true,
          chainId: chartChainId,
          pairAddress: pair.pairAddress,
          defaultInterval: timeframeMap[timeFrame] || "1D",
          timeZone:
            Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Etc/UTC",

          backgroundColor: "#0f1118",
          gridColor: "#1D2330",
          textColor: "#7F85A1",
          candleUpColor: "#16C784",
          candleDownColor: "#EA3943",
          borderColor: "#0D111C",
          tooltipBackgroundColor: "#171D2E",
          volumeUpColor: "rgba(22, 199, 132, 0.5)",
          volumeDownColor: "rgba(234, 57, 67, 0.5)",
          lineColor: "#3576F2",
          locale: "en",
          hideLeftToolbar: false,
          hideTopToolbar: false,
          hideBottomToolbar: false,
        });

        console.log(
          `Chart initialized with chainId: ${chartChainId}, pairAddress: ${pair.pairAddress}`
        );
      } else {
        console.error("createMyWidget function is not defined.");
      }
    };

    // Clear any existing chart before creating a new one
    const existingWidget = document.getElementById(PRICE_CHART_ID);
    if (existingWidget) {
      while (existingWidget.firstChild) {
        existingWidget.removeChild(existingWidget.firstChild);
      }
    }

    if (!document.getElementById("moralis-chart-widget")) {
      const script = document.createElement("script");
      script.id = "moralis-chart-widget";
      script.src = "https://moralis.com/static/embed/chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = loadWidget;
      script.onerror = () => {
        console.error("Failed to load the chart widget script.");
        // Show error message in the chart container
        const chartContainer = document.getElementById(PRICE_CHART_ID);
        if (chartContainer) {
          chartContainer.innerHTML = `<div class="h-full flex items-center justify-center text-dex-text-secondary">
            Failed to load chart. Please try again later.
          </div>`;
        }
      };
      document.body.appendChild(script);
    } else {
      loadWidget();
    }

    // Cleanup function
    return () => {
      // If there's a cleanup method exposed by the widget, call it here
      if (typeof window.destroyMyWidget === "function") {
        window.destroyMyWidget(PRICE_CHART_ID);
      }
    };
  }, [pair, timeFrame]);

  if (!pair) {
    return (
      <div className="h-full flex items-center justify-center text-dex-text-secondary">
        No chart data available
      </div>
    );
  }

  // Time frame options
  const timeFrames = [
    { id: "5m", label: "5m" },
    { id: "15m", label: "15m" },
    { id: "1h", label: "1h" },
    { id: "4h", label: "4h" },
    { id: "1d", label: "1d" },
  ];

  // Extract pair tokens
  const baseToken = pair.pair.find((t: any) => t.pairTokenType === "token0");
  const quoteToken = pair.pair.find((t: any) => t.pairTokenType === "token1");

  return (
    <div className="h-full flex flex-col">
      {/* Top bar with pair info and controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <img
              src={
                pair.exchangeLogo || "/images/exchanges/default-exchange.svg"
              }
              alt={pair.exchangeName}
              className="w-6 h-6 mr-2 rounded-full"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
              }}
            />
            <span className="font-medium text-dex-text-primary">
              {pair.pairLabel}
            </span>
            <span className="ml-2 text-dex-text-secondary">
              on {pair.exchangeName}
            </span>
          </div>

          <div className="text-dex-text-secondary text-sm">
            <span className="mr-2">
              Volume: ${(pair.volume24hrUsd || 0).toLocaleString()}
            </span>
            <span>|</span>
            <span className="mx-2">
              Liquidity: ${(pair.liquidityUsd || 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="inline-flex rounded-md mr-4"></div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 bg-dex-bg-secondary rounded-lg">
        <div
          id={PRICE_CHART_ID}
          ref={containerRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default TokenChart;
