import React from "react";
// import { Link } from "react-router-dom";
import TableHeader from "./TrendingTable/TableHeader";
import TokenRow from "./TrendingTable/TokenRow";
import { TrendingTableProps } from "../../types/type";

const TrendingTable: React.FC<TrendingTableProps> = ({
  tokens,
  loading,
  sortBy,
  sortDirection,
  onSortChange,
}) => {
  console.log("TrendingTable received tokens:", tokens);
  console.log("Number of tokens:", tokens?.length || 0);

  // Make sure tokens is always an array even if API returns null or undefined
  const tokenArray = Array.isArray(tokens) ? tokens : [];

  // Sort tokens based on current sort settings
  const sortedTokens = [...tokenArray];

  // Only sort if sortBy is specified
  if (sortBy) {
    sortedTokens.sort((a, b) => {
      // Helper function to get nested property value safely
      const getNestedValue = (obj: any, path: string, defaultValue = 0) => {
        const keys = path.split(".");
        let value = obj;

        for (const key of keys) {
          if (
            value === null ||
            value === undefined ||
            typeof value !== "object"
          ) {
            return defaultValue;
          }
          value = value[key];
        }

        return value !== null && value !== undefined ? value : defaultValue;
      };

      // Get values to compare based on sortBy path
      const aValue = getNestedValue(a, sortBy);
      const bValue = getNestedValue(b, sortBy);

      // Compare values based on sort direction
      if (sortDirection === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }

  return (
    <div className="flex-1">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse sm:w-full md:w-full lg:w-full">
          <TableHeader
            sortBy={sortBy || ""}
            sortDirection={sortDirection || "asc"}
            onSortChange={onSortChange || (() => {})}
          />
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-8 text-dex-text-secondary"
                >
                  Loading trending tokens...
                </td>
              </tr>
            ) : sortedTokens.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-8 text-dex-text-secondary"
                >
                  No tokens found
                </td>
              </tr>
            ) : (
              sortedTokens.map((token, index) => (
                <TokenRow
                  key={String(token?.id || index)}
                  token={token}
                  rank={index + 1}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrendingTable;
