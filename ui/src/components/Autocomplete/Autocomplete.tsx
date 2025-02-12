import AutocompleteOption from "../../types/autocomplete-option";
import AutocompleteInput from "./components/AutocompleteInput";

interface AutocompleteProps {
  selectedItemId: string | null;
  changeSelectedItem(id: string): void;
  clearSelectedItem(): void;
  handleSelectItem?(id: string): Promise<void>;
  fetchEntitiesBySelectedItem?(id: string): void;
  getItemsFromDatabase(searchQuery: string): Promise<AutocompleteOption[]>;
  isDisabled?: boolean;
  placeholder: string;
}
function Autocomplete({
  selectedItemId,
  changeSelectedItem,
  clearSelectedItem,
  handleSelectItem,
  fetchEntitiesBySelectedItem,
  getItemsFromDatabase,
  placeholder,
  isDisabled = false,
}: AutocompleteProps) {
  return (
    <AutocompleteInput
      selectedItemId={selectedItemId}
      changeSelectedItemId={changeSelectedItem}
      searchInputLabel=""
      placeholder={placeholder}
      clearSelectedItemId={clearSelectedItem}
      getItemsFromDatabase={getItemsFromDatabase}
      handleSelectItem={handleSelectItem}
      fetchEntitiesBySelectedItem={fetchEntitiesBySelectedItem}
      disabled={isDisabled}
    />
  );
}

export default Autocomplete;
