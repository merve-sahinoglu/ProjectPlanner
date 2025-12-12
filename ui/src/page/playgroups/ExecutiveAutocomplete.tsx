import { useEffect, useRef, useState } from "react";

import { Loader, Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";

import useRequestManager from "@hooks/useRequestManager";
import formatSearchQuery from "@utils/search-query-formatter";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteResponse {
  id: string;
  label: string;
}

interface ExecutiveAutocompleteProps {
  searchInputLabel: string;
  placeholder: string;
  description: string;
  apiUrl: string;
  disabled?: boolean;
  initialData?: AutocompleteOption[];
  initialSearchValue?: string;
  additionalQueries?: Record<string, unknown>;
  clearValue(): void;
  setFieldValue: (
    value: { id: string; therapistId: string; therapistName: string }[]
  ) => void;
  selectedTherapists: {
    id: string;
    therapistId: string;
    therapistName: string;
  }[];
  marginTop?: number;
  paddingTop?: number;
}

function ExecutiveAutocomplete({
  searchInputLabel,
  placeholder,
  description,
  apiUrl,
  disabled,
  initialData,
  initialSearchValue,
  marginTop = 0,
  paddingTop = 0,
  additionalQueries,
  clearValue,
  setFieldValue,
  selectedTherapists,
}: ExecutiveAutocompleteProps) {
  const { fetchData } = useRequestManager();
  const [items, setItems] = useState<AutocompleteOption[]>(initialData || []);
  const [searchValue, setSearchValue] = useState<string>(
    initialSearchValue || ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [debouncedQuery] = useDebouncedValue(searchValue, 500);
  const componentMounted = useRef<boolean>(false);
  const [selectKey, setSelectKey] = useState<number>(0);

  // ✅ fetchItems'ı useEffect içine taşı - cascading render'ı önle
  useEffect(() => {
    if (!componentMounted.current) {
      componentMounted.current = true;
      return;
    }

    const fetchItems = async () => {
      if (debouncedQuery.length >= 3) {
        setLoading(true);
        const query = formatSearchQuery(debouncedQuery);

        const request = {
          searchText: query,
          isActive: true,
          ...((additionalQueries as Record<
            string,
            string | number | boolean | null | undefined
          >) || {}),
        };

        const response = await fetchData<AutocompleteResponse[]>(
          apiUrl,
          request
        );

        if (response.isSuccess && response.value) {
          setItems(
            response.value.map((element) => ({
              value: element.id,
              label: element.label,
            }))
          );
        }
        setLoading(false);
      }
    };

    fetchItems();
  }, [debouncedQuery, additionalQueries, apiUrl, fetchData]); // ✅ debouncedQuery'yi dependency'ye ekle

  const handleSearchChange = (eventValue: string) => {
    setSearchValue(eventValue);
  };

  const handleSelectChange = (selectedId: string | null) => {
    if (selectedId) {
      const selectedItem = items.find((item) => item.value === selectedId);

      if (selectedItem) {
        const newTherapist = {
          id: crypto.randomUUID(),
          therapistId: selectedId,
          therapistName: selectedItem.label,
        };

        setFieldValue([...selectedTherapists, newTherapist]);

        setSearchValue("");
        setItems([]);
        setSelectKey((prev) => prev + 1);
      }
    }
  };

  const handleClearClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setSearchValue("");
    clearValue();
    setItems([]);
    setSelectKey((prev) => prev + 1);
  };

  return (
    <Select
      key={selectKey}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      disabled={disabled}
      label={searchInputLabel}
      placeholder={placeholder}
      mt={marginTop}
      pt={paddingTop}
      comboboxProps={{ withinPortal: true }}
      description={description}
      rightSection={
        loading ? (
          <Loader size="1rem" />
        ) : searchValue && !disabled ? (
          <IconX
            size={18}
            style={{ display: "block", opacity: 0.5, cursor: "pointer" }}
            onClick={handleClearClick}
          />
        ) : null
      }
      data={items}
      onChange={handleSelectChange}
      searchable
    />
  );
}

export default ExecutiveAutocomplete;
