import React from "react";
import { FilterConditionProps } from "../../../types/type";

const FilterCondition: React.FC<FilterConditionProps> = ({
  filter,
  metrics,
  timeFrames,
  operators,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="bg-dex-bg-tertiary rounded-lg p-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-dex-text-secondary text-xs mb-1">
            Metric
          </label>
          <select
            className="w-full px-3 py-2 bg-dex-bg-highlight border border-dex-border rounded text-dex-text-primary"
            value={filter.metric}
            onChange={(e) => onUpdate("metric", e.target.value)}
          >
            {metrics.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-dex-text-secondary text-xs mb-1">
            Time Frame
          </label>
          <select
            className="w-full px-3 py-2 bg-dex-bg-highlight border border-dex-border rounded text-dex-text-primary"
            value={filter.timeFrame}
            onChange={(e) => onUpdate("timeFrame", e.target.value)}
          >
            {timeFrames.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-dex-text-secondary text-xs mb-1">
            Condition
          </label>
          <select
            className="w-full px-3 py-2 bg-dex-bg-highlight border border-dex-border rounded text-dex-text-primary"
            value={filter.operator}
            onChange={(e) => onUpdate("operator", e.target.value)}
          >
            {operators.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[120px]">
          <label className="block text-dex-text-secondary text-xs mb-1">
            Value
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-dex-bg-highlight border border-dex-border rounded text-dex-text-primary"
            value={filter.value}
            onChange={(e) => onUpdate("value", e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            className="px-3 py-2 text-dex-text-secondary hover:text-dex-red"
            onClick={onRemove}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterCondition;
