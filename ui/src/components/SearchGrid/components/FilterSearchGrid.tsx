import { SelectItem } from "@mantine/core";
import React from "react";
import SearchGrid from "../SearchGrid";
import SearchInput from "../../SearchInput/SearchInput";

interface FilterSearchGridProps {
  // Search Input

  searchKeyword: string;
  handleKeywordChange(event: React.ChangeEvent<HTMLInputElement>): void;
  searchPlaceholder: string;
  optionalRightElement?: React.ReactNode;

  // Search Grid

  selectedProcessType?: string | null;
  searchGridSelectData?: SelectItem[];
  handleProcessTypeChange?(eventValue: string | null): void;
  clearItemList?(event: React.MouseEvent): void;
  showClearButton?: boolean;
  showFilterSelect?: boolean;
  isDisabled?: boolean;
}

function FilterSearchGrid({
  selectedProcessType,
  searchGridSelectData,
  handleProcessTypeChange,
  searchKeyword,
  handleKeywordChange,
  searchPlaceholder,
  showClearButton,
  showFilterSelect,
  optionalRightElement = null,
  isDisabled = false,
}: FilterSearchGridProps) {
  return (
    <SearchGrid
      selectedProcessType={selectedProcessType}
      data={searchGridSelectData}
      handleProcessTypeChange={handleProcessTypeChange}
      showClearButton={showClearButton}
      showFilterSelect={showFilterSelect}
      isDisabled={isDisabled}
    >
      <SearchInput
        isDisabled={isDisabled}
        searchKeyword={searchKeyword}
        handleKeywordChange={handleKeywordChange}
        searchPlaceholder={searchPlaceholder}
        optionalRightElement={optionalRightElement}
      />
    </SearchGrid>
  );
}

export default FilterSearchGrid;
