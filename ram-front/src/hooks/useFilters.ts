// (c) Delta Software 2023, rights reserved.

import { useState } from "react";

export interface IUseFiltersReturn {
  isFilterOpen: boolean;
  toggleFilter: () => void;
}

export function useFilters(): IUseFiltersReturn {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return {
    isFilterOpen,
    toggleFilter,
  };
}
