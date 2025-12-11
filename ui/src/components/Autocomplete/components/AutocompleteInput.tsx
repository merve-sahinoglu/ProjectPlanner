import { Loader, Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineSearch } from "react-icons/ai";
import Dictionary from "../../../helpers/translation/dictionary/dictionary";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteInputProps {
  selectedItemId: string | null;
  changeSelectedItemId: (id: string) => void;
  clearSelectedItemId(): void;
  getItemsFromDatabase(searchQuery: string): Promise<AutocompleteOption[]>;
  searchInputLabel: string;
  placeholder: string;
  description?: string;
  handleSelectItem?(id: string): Promise<void>;
  fetchEntitiesBySelectedItem?(id: string): void;
  disabled?: boolean;
}

function AutocompleteInput({
  selectedItemId,
  changeSelectedItemId,
  clearSelectedItemId,
  searchInputLabel,
  placeholder,
  description,
  getItemsFromDatabase,
  handleSelectItem,
  fetchEntitiesBySelectedItem,
  disabled = false,
}: AutocompleteInputProps) {
  const { t } = useTranslation();

  const [items, setItems] = useState<AutocompleteOption[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [debouncedQuery] = useDebouncedValue(searchValue, 200);

  const componentMounted = useRef<boolean>(false);

  const fetchItems = useCallback(async () => {
    if (searchValue === "" || searchValue == null) {
      setItems([]);
      setLoading(false);
      return;
    }

    if (searchValue.length >= 3) {
      setLoading(true);
      const query = searchValue
        .trim()
        .replace("-", "")
        .replace(/\s/g, "")
        .toLocaleUpperCase("en-US");
      const result = await getItemsFromDatabase(query);

      if (result.length === 0) {
        setItems([{ value: "", label: t(Dictionary.Search.NO_RESULT) }]);
      } else {
        setItems(result);
      }

      setLoading(false);
    }
  }, [searchValue]);

  const handleValueChange = async (value: string | null) => {
    if (value === null) return;

    fetchItems();
    changeSelectedItemId(value);

    if (value === "") return;

    if (handleSelectItem) {
      await handleSelectItem(value);
      return;
    }

    if (fetchEntitiesBySelectedItem) {
      fetchEntitiesBySelectedItem(value);
    }
  };

  const handleClearClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setSearchValue("");
    clearSelectedItemId();
  };

  useEffect(() => {
    if (!componentMounted.current) {
      componentMounted.current = true;
      return;
    }
    fetchItems();
  }, [debouncedQuery]);

  return (
    <Select
      disabled={disabled}
      value={selectedItemId}
      onChange={(e) => handleValueChange(e)}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      hoverOnSearchChange
      allowDeselect
      radius="md"
      size="md"
      label={searchInputLabel}
      placeholder={placeholder}
      description={description}
      data-autofocus
      rightSection={
        // eslint-disable-next-line no-nested-ternary
        loading ? (
          <Loader size="1rem" />
        ) : searchValue ? (
          <IconX
            size={18}
            style={{ display: "block", opacity: 0.5, cursor: "pointer" }}
            onClick={(event) => handleClearClick(event)}
          />
        ) : (
          <AiOutlineSearch color="#D9D9D9" size={18} />
        )
      }
      data={items}
      filter={() => true}
      searchable
    />
  );
}

export default AutocompleteInput;
