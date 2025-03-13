import { Select, Loader } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useRequestHandler from "../../hooks/useRequestHandler";
import formatSearchQuery from "../../helpers/trim-search-query";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteResponse {
  id: string;
  name: string;
}

// 🎯 `additionalQueries` eklendi!
interface ExecutiveAutocompleteProps {
  searchInputLabel: string;
  placeholder: string;
  description: string;
  apiUrl: string;
  disabled?: boolean;
  initialData?: AutocompleteOption[];
  initialSearchValue?: string;
  additionalQueries?: Record<string, any>; // 🎯 API çağrısına ek parametre olarak gönderilecek.
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
  additionalQueries, // 🎯 Buraya ekledik
  clearValue,
  setFieldValue,
  selectedTherapists,
}: ExecutiveAutocompleteProps) {
  const { fetchData } = useRequestHandler();
  const [items, setItems] = useState<AutocompleteOption[]>(initialData || []);
  const [searchValue, setSearchValue] = useState<string>(
    initialSearchValue || ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [debouncedQuery] = useDebouncedValue(searchValue, 500);
  const componentMounted = useRef<boolean>(false);

  const fetchItems = useCallback(async () => {
    if (searchValue.length >= 3) {
      setLoading(true);
      const query = formatSearchQuery(searchValue);

      // 🎯 API isteğine `additionalQueries` ekleniyor
      const request: { [key: string]: any } = {
        searchText: query,
        isActive: true,
        ...(additionalQueries && additionalQueries), // Eğer varsa ekliyoruz
      };

      const response = await fetchData<AutocompleteResponse[]>(apiUrl, request);

      if (response.isSuccess) {
        setItems(
          response.value.map((element) => ({
            value: element.id,
            label: element.name,
          }))
        );
      }
      setLoading(false);
    }
  }, [searchValue, additionalQueries]); // 🎯 Bağımlılıklara ekledik.

  useEffect(() => {
    if (!componentMounted.current) {
      componentMounted.current = true;
      return;
    }
    fetchItems();
  }, [debouncedQuery]);

  const handleSearchChange = (eventValue: string) => {
    if (eventValue !== searchValue) {
      setSearchValue(eventValue);
    }
  };

  const handleSelectChange = (selectedId: string | null) => {
    if (selectedId) {
      const newTherapist = {
        id: crypto.randomUUID(),
        therapistId: selectedId,
        therapistName:
          items.find((item) => item.value === selectedId)?.label || "",
      };

      setFieldValue([...selectedTherapists, newTherapist]);

      setSearchValue("");
    }
  };

  const handleClearClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setSearchValue("");
    clearValue();
  };

  return (
    <Select
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      allowDeselect
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
