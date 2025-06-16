import React from "react";

type Option = { value: string; label: string };

interface SortBySelectorProps {
  sortBy: {
    metric: string;
    timeFrame: string;
    type: string;
    [key: string]: any;
  };
  metrics: Option[];
  timeFrames: Option[];
  onChange: (value: any) => void;
}

const SortBySelector: React.FC<SortBySelectorProps> = ({
  sortBy,
  metrics,
  timeFrames,
  onChange,
}) => {
  interface HandleChangeFn {
    (field: keyof typeof sortBy, value: string): void;
  }

  const handleChange: HandleChangeFn = (field, value) => {
    onChange({
      ...sortBy,
      [field]: value,
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-[180px]">
        <select
          className="w-full px-3 py-2 bg-dex-bg-tertiary border border-dex-border rounded text-dex-text-primary"
          value={sortBy.metric}
          onChange={(e) => handleChange("metric", e.target.value)}
        >
          {metrics.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <select
          className="w-full px-3 py-2 bg-dex-bg-tertiary border border-dex-border rounded text-dex-text-primary"
          value={sortBy.timeFrame}
          onChange={(e) => handleChange("timeFrame", e.target.value)}
        >
          {timeFrames.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <select
          className="w-full px-3 py-2 bg-dex-bg-tertiary border border-dex-border rounded text-dex-text-primary"
          value={sortBy.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
      </div>
    </div>
  );
};

export default SortBySelector;
