import React from "react";
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
  const tokenArray = Array.isArray(tokens) ? tokens : [];
  const sortedTokens = [...tokenArray];

  if (sortBy) {
    sortedTokens.sort((a, b) => {
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
      const aValue = getNestedValue(a, sortBy);
      const bValue = getNestedValue(b, sortBy);
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
        <table className="w-full border-collapse">
          <thead>
            <TableHeader
              sortBy={sortBy || ""}
              sortDirection={sortDirection || "asc"}
              onSortChange={onSortChange || (() => {})}
            />
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={13}
                  className="text-center py-8 text-dex-text-secondary"
                >
                  Loading trending tokens...
                </td>
              </tr>
            ) : sortedTokens.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
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
