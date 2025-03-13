/* eslint-disable react/require-default-props */
import { Loader, OptionsFilter, Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useRequestHandler, { ResponseBase } from "../../hooks/useRequestHandler";
import formatSearchQuery from "../../helpers/trim-search-query";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteResponse {
  id: string;
  name: string;
}

interface FormAutocompleteProps<T> {
  /** Autocomplete input'un sol üst kısmında gösterilecek label  */
  searchInputLabel: string;
  /** Autocomplete'in içinde arama yapılmadığında gösterilecek placeholder */
  placeholder: string;
  /** Autocomplete label altında dimmed şekilde gözükecek açıklama */
  description: string;
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
  form: UseFormReturnType<T, (values: T) => T>;
  /** Form içerisindeki hangi property için Autocomplete kullanılacaksa
   * o property'nin nameof değeri.
   */
  formInputProperty: keyof T;
  /** Bildiğimiz marginTop :) */
  marginTop?: number;
  /** Bildiğimiz paddingTop :) */
  paddingTop?: number;
  /** Autocomplete için kullanılacak serviste search query ihtiyacı varsa kullanılır. */
  additionalQueries?: string;
}

function FormAutocomplete<T>({
  searchInputLabel,
  placeholder,
  description,
  apiUrl,
  form,
  formInputProperty,
  disabled,
  initialData,
  initialSearchValue,
  marginTop = 0,
  paddingTop = 0,
  clearValue,
}: FormAutocompleteProps<T>) {
  const { fetchData, sendData } = useRequestHandler();

  const [items, setItems] = useState<AutocompleteOption[]>(initialData || []);

  const [searchValue, setSearchValue] = useState<string>(
    initialSearchValue || ""
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [debouncedQuery] = useDebouncedValue(searchValue, 500);

  const componentMounted = useRef<boolean>(false);

  const fetchItems = useCallback(async () => {
    if (searchValue === "" || searchValue === null) {
      setItems([]);
      clearValue();
      return;
    }

    if (searchValue.length >= 3) {
      setLoading(true);
      const query = formatSearchQuery(searchValue);
      const request: { [key: string]: any } = {
        searchText: query,
        isActive: true,
      };
      const response = await fetchData<AutocompleteResponse[]>(apiUrl, request);

      if (response.isSuccess) {
        const retVal: AutocompleteOption[] = [];

        response.value.forEach((element) => {
          retVal.push({
            value: element.id,
            label: element.name,
          });
        });

        setItems(retVal);
        setLoading(false);
      }
    }
  }, [clearValue, searchValue]);

  const handleSearchChange = (eventValue: string) => {
    if (eventValue !== searchValue) {
      setSearchValue(eventValue);
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

  useEffect(() => {
    /** Autocomplete kullanılan ekranlar ilk açıldığında arama yapılmaması
     * için koyuldu.
     */
    if (!componentMounted.current) {
      componentMounted.current = true;
      return;
    }

    fetchItems();
  }, [debouncedQuery]);

  // TODO: bURASI TRUE ILE GECILMISTI SITEDEN CALDIGIM BURASI KALMALIMI BILMIORUM
  const optionsFilter: OptionsFilter = ({ options, search }) => {
    return (options as AutocompleteOption[]).filter((option) => {
      return true;
    });
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
      {...form.getInputProps(formInputProperty)}
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
      filter={optionsFilter}
      searchable
    />
  );
}

export default FormAutocomplete;
