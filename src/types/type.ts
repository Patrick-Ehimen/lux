export interface TokenPriceResponse {
  tokenAddress: string;
  nativePrice: {
    value: string;
    decimals: number;
    name: string;
    symbol: string;
    address: string;
  };
  usdPrice: number;
  usdPriceFormatted?: string;
  exchangeAddress?: string;
  exchangeName?: string;
  [key: string]: any; // For any additional fields returned by the API
}

export interface FilterConditionType {
  id: number;
  metric: string;
  timeFrame: string;
  operator: string;
  value: string;
}

export type SortByType = {
  metric: string;
  timeFrame: string;
  type: string;
};

export type FiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (data: any) => void;
};

export interface Metric {
  value: string;
  label: string;
}

export interface TimeFrame {
  value: string;
  label: string;
}

export interface Operator {
  value: string;
  label: string;
}

export interface Filter {
  metric: string;
  timeFrame: string;
  operator: string;
  value: string;
}

export type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export interface FilterConditionProps {
  filter: Filter;
  metrics: Metric[];
  timeFrames: TimeFrame[];
  operators: Operator[];
  onUpdate: (field: keyof FilterConditionType, value: string) => void;
  onRemove: () => void;
}

export interface TrendingTableProps {
  tokens: any[] | null | undefined;
  loading: boolean;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (sortBy: string) => void;
}
