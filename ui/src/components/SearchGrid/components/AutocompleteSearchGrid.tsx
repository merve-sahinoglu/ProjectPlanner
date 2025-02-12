import { SelectItem } from "@mantine/core";
import SearchGrid from "../SearchGrid";
import AutocompleteOption from "../../../types/autocomplete-option";
import Autocomplete from "../../Autocomplete/Autocomplete";

interface AutocompleteSearchGridProps {
  // Item Search

  selectedItemId: string | null;
  changeSelectedItem(id: string): void;
  clearSelectedItem(): void;
  handleSelectItem?(id: string): Promise<void>;

  // Search Grid

  selectedProcessType?: string | null;
  searchGridSelectData?: SelectItem[];
  handleProcessTypeChange?(eventValue: string | null): void;
  clearItemList?(event: React.MouseEvent): void;
  placeholder: string;

  // Generic fetch method for selected value

  fetchEntitiesBySelectedItem?(id: string): void;
  getItemsFromDatabase(searchQuery: string): Promise<AutocompleteOption[]>;

  // Show

  showClearButton?: boolean;
  showFilterSelect?: boolean;

  isDisabled?: boolean;
}

function AutocompleteSearchGrid({
  selectedItemId,
  changeSelectedItem,
  clearSelectedItem,
  selectedProcessType,
  searchGridSelectData,
  handleProcessTypeChange,
  clearItemList,
  handleSelectItem,
  fetchEntitiesBySelectedItem,
  getItemsFromDatabase,
  showClearButton = true,
  showFilterSelect = true,
  isDisabled = false,
  placeholder,
}: AutocompleteSearchGridProps) {
  return (
    <SearchGrid
      selectedProcessType={selectedProcessType}
      data={searchGridSelectData}
      handleProcessTypeChange={handleProcessTypeChange}
      clearItemList={clearItemList}
      showClearButton={showClearButton}
      showFilterSelect={showFilterSelect}
      isDisabled={isDisabled}
    >
      <Autocomplete
        handleSelectItem={handleSelectItem}
        selectedItemId={selectedItemId}
        changeSelectedItem={changeSelectedItem}
        clearSelectedItem={clearSelectedItem}
        fetchEntitiesBySelectedItem={fetchEntitiesBySelectedItem}
        getItemsFromDatabase={getItemsFromDatabase}
        isDisabled={isDisabled}
        placeholder={placeholder}
      />
    </SearchGrid>
  );
}

export default AutocompleteSearchGrid;
