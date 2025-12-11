import React, { useCallback, useState } from "react";

import { Loader, OptionsFilter, Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDebouncedCallback } from "@mantine/hooks";
import { BsX } from "react-icons/bs";

import useRequestManager from "@hooks/useRequestManager";
import { LooseKeys } from "@shared/types/form-loose-keys.types";
import formatSearchQuery from "@utils/search-query-formatter";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface FormAutocompleteProps<T> {
  /** Autocomplete input'un sol üst kısmında gösterilecek label  */
  searchInputLabel: string;
  /** Autocomplete'in içinde arama yapılmadığında gösterilecek placeholder */
  placeholder?: string;
  /** Autocomplete label altında dimmed şekilde gözükecek açıklama */
  description?: string;
  /** Autocomplete ile aratılacak servisin url adresi */
  apiUrl: string;

  /** Eğer true ise input disable edilir */
  disabled?: boolean;
  /** Form kullanımında eğer Autocomplete'in default bir değeri varsa data çekmeden
   * göstermek için kullanılır
   */
  initialData?: AutocompleteOption[];
  /** InitialData ile beraber kullanılarak seçili datanın yazısı input içine yazar */
  initialSearchValue?: string;
  /** Autocomplete input tarafından seçilen value'nın temizlenmesini sağlar */
  clearValue(): void;
  /** Autocomplete component'ının kullanıcığı ekrandaki useForm ile oluşturulmuş
   * Mantine formu
   */
  form: UseFormReturnType<T>;
  /** Form içerisindeki hangi property için Autocomplete kullanılacaksa
   * o property'nin nameof değeri.
   */
  formInputProperty: LooseKeys<T>;
  /** Bildiğimiz marginTop :) */
  marginTop?: number;
  /** Bildiğimiz paddingTop :) */
  paddingTop?: number;
  /** Autocomplete için kullanılacak serviste search query ihtiyacı varsa kullanılır. */
  additionalParameters?: {
    [key: string]:
      | string
      | number
      | boolean
      | Array<string | number>
      | undefined
      | null;
  };
  w?: string | number;
}

function FormAutocomplete<T>({
  searchInputLabel,
  placeholder = "",
  description = "",
  apiUrl,
  form,
  formInputProperty,
  disabled,
  initialData,
  initialSearchValue,
  marginTop = 0,
  paddingTop = 0,
  clearValue,
  additionalParameters,
  w,
}: FormAutocompleteProps<T>) {
  const [items, setItems] = useState<AutocompleteOption[]>(initialData || []);

  const { fetchData } = useRequestManager();

  const [searchValue, setSearchValue] = useState<string>(
    initialSearchValue || ""
  );

  const [loading, setLoading] = useState<boolean>(false);

  const fetchItems = async () => {
    if (searchValue === "" || searchValue == null) {
      setItems([]);
      clearValue();
      return;
    }

    if (searchValue.length >= 3) {
      setLoading(true);

      const parameters = {
        ...additionalParameters,
        searchQuery: formatSearchQuery(searchValue),
        isValueLabel: true,
        isActive: true,
      };

      const response = await fetchData<AutocompleteOption[]>(
        apiUrl,
        parameters
      );

      if (response.isSuccess) {
        setItems(response.value);
        setLoading(false);
      }
    }
  };

  const handleClearClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setSearchValue("");
      clearValue();
    },
    [clearValue]
  );

  const includeAllFilter: OptionsFilter = ({ options }) => options;

  const handleSearch = useDebouncedCallback(async () => {
    if (form.values[formInputProperty as unknown as keyof T]) return;

    await fetchItems();
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    handleSearch();
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
      w={w}
      description={description}
      {...form.getInputProps(formInputProperty as LooseKeys<T>)}
      rightSectionPointerEvents="auto"
      rightSection={
        loading ? (
          <Loader size="16px" />
        ) : searchValue.trim() && !disabled ? (
          <BsX
            size={18}
            style={{ display: "block", cursor: "pointer" }}
            onClick={(event) => handleClearClick(event)}
          />
        ) : null
      }
      filter={includeAllFilter}
      data={items}
      searchable
    />
  );
}

export default FormAutocomplete;
