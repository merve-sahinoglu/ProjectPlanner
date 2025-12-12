import React, { CSSProperties, useState } from "react";

import { Loader, OptionsFilter, Select } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { BsX } from "react-icons/bs";

import useRequestManager from "@hooks/useRequestManager";
import formatSearchQuery from "@utils/search-query-formatter";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps {
  selectedItemId: string | null;
  changeSelectedItemId: (id: string | null) => void;
  searchInputLabel: string;
  placeholder?: string;
  description?: string;
  isDisabled?: boolean;
  apiUrl: string;
  optionalRefetch?(): void;
  mt?: number | string;
  ml?: number | string;
  maw?: number | string;
  miw?: number | string;
  style?: CSSProperties;
}

function AutocompleteInput({
  selectedItemId,
  changeSelectedItemId,
  searchInputLabel,
  placeholder = "",
  description = "",
  apiUrl,
  isDisabled = false,
  maw,
  mt,
  ml,
  miw,
  style,
}: AutocompleteProps) {
  const [items, setItems] = useState<AutocompleteOption[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const { fetchData } = useRequestManager();

  const fetchItems = async () => {
    if (searchValue === "" || searchValue == null) {
      setItems([]);
      changeSelectedItemId(null);
      return;
    }

    if (searchValue.length >= 3) {
      setLoading(true);
      const response = await fetchData<AutocompleteOption[]>(apiUrl, {
        searchQuery: formatSearchQuery(searchValue),
        isValueLabel: true,
        isActive: true,
      });

      if (response.isSuccess) {
        let data = response.value;
        setLoading(false);

        if (selectedItemId) {
          data = [{ value: selectedItemId, label: searchValue }];
        }

        setItems(data);
      }
    }
  };

  const handleSearch = useDebouncedCallback(async (value: string) => {
    if (value.trim() === "") {
      setItems([]);
      changeSelectedItemId(null);
      return;
    }

    if (selectedItemId) return;

    await fetchItems();
  }, 300);

  const handleValueChange = (value: string | null) => {
    changeSelectedItemId(value);
  };

  const handleClearClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setSearchValue("");
    changeSelectedItemId(null);
    setItems([]);
  };

  const handleChange = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };

  const includeAllFilter: OptionsFilter = ({ options }) => options;

  return (
    <Select
      ml={ml}
      maw={maw}
      miw={miw}
      mt={mt}
      style={style}
      value={selectedItemId}
      onChange={(e) => handleValueChange(e)}
      searchValue={searchValue}
      onSearchChange={handleChange}
      disabled={isDisabled}
      label={searchInputLabel}
      placeholder={placeholder}
      description={description}
      rightSectionPointerEvents="auto"
      rightSection={
        loading ? (
          <Loader size="16px" />
        ) : searchValue.trim() && !isDisabled ? (
          <BsX
            size={18}
            style={{ display: "block", cursor: "pointer" }}
            onClick={(event) => handleClearClick(event)}
          />
        ) : null
      }
      data={items}
      filter={includeAllFilter}
      searchable
    />
  );
}

export default AutocompleteInput;
