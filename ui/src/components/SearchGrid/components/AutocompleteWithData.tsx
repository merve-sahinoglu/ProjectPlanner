import { Select, SelectItem } from "@mantine/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Dictionary from "../../../helpers/translation/dictionary/dictionary";
import SearchGrid from "../SearchGrid";
import { SearchGridProps } from "../types/search-grid-props";

interface AutocompleteWithDataProps<T> {
  searchGridProps: SearchGridProps;

  isDisabled: boolean;

  labelPlaceholder: string;

  fetchSelectData: () => Promise<SelectItem[]>;

  fetchItemsByValue: (value: string) => Promise<T[]>;

  replaceItemList(items: T[]): void;
}

function AutocompleteWithData<T>({
  searchGridProps,
  isDisabled,
  labelPlaceholder,
  fetchSelectData,
  fetchItemsByValue,
  replaceItemList,
}: AutocompleteWithDataProps<T>) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [value, setValue] = useState<string | null>(null);
  const [dataList, setDataList] = useState<SelectItem[]>([]);

  const { t } = useTranslation();

  const fetchInitialData = async () => {
    const selectData = await fetchSelectData();
    setDataList(selectData);
  };

  const fetchItems = async (eventValue: string | null) => {
    if (!eventValue) return;

    const items = await fetchItemsByValue(eventValue);

    if (items.length === 0) {
      toast.error(t(Dictionary.NoData.ITEM));
      replaceItemList(items);
      return;
    }

    replaceItemList(items);

    setValue(null);
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchSelectData]);

  return (
    <SearchGrid
      selectedProcessType={searchGridProps.processType}
      data={searchGridProps.data}
      handleProcessTypeChange={searchGridProps.changeProcessType}
      showClearButton={searchGridProps.showClearButton}
      showFilterSelect={searchGridProps.showFilterSelect}
      isDisabled={isDisabled}
    >
      <Select
        disabled={isDisabled}
        onChange={(e) => fetchItems(e)}
        value={value}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        radius="md"
        size="md"
        placeholder={labelPlaceholder}
        clearable
        data-autofocus
        data={dataList}
        searchable
      />
    </SearchGrid>
  );
}

export default AutocompleteWithData;
