import { useEffect, useReducer, useState } from "react";

import { useDebouncedValue } from "@mantine/hooks";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import { apiUrl, createRequestUrl } from "../../../config/app.config";
import ReducerActions from "../../../enums/reducer-action.enum";
import useRequestHandler, {
  SuccessResponse,
} from "../../../hooks/useRequestHandler";
import customReducer from "../../../services/custom-reducer/customReducer";
import { UserResponse, UserRowProps } from "../props/UserTypes";

interface UseUserProps {
  searchQuery?: string;
}

const useItems = ({ searchQuery = "" }: UseUserProps = {}) => {
  const { fetchData } = useRequestHandler();

  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);

  const [items, dispatch] = useReducer(customReducer<UserRowProps>, []);
  const [selectedItems, setSelectedItems] = useState<UserRowProps[]>([]);
  const [totalRecordCount, setTotalRecords] = useState<number>(0);

  function handleAddItems(item: UserRowProps) {
    dispatch({ type: ReducerActions.Add, payload: item });
  }

  function handleUpdateItems(item: UserRowProps) {
    dispatch({ type: ReducerActions.Update, payload: item });
  }

  function handleDeleteItems(itemId: string) {
    dispatch({ type: ReducerActions.Delete, payload: itemId });
  }

  function handleReplaceItems(list: UserRowProps[]) {
    dispatch({ type: ReducerActions.Replace, payload: list });
  }

  function handleUpdateItemWithId(item: UserRowProps, id: string) {
    dispatch({
      type: ReducerActions.UpdateWithDifferentId,
      payload: item,
      id,
    });
  }

  function base64ToBlob(
    base64: string,
    mimeType: "image/jpeg" | "image/png"
  ): File {
    const base64Data = base64.split(",")[1] || base64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    return new File([blob], "image.jpeg", { type: mimeType });
  }

  const fetchItems = async ({ pageParam = 1 }) => {
    const request = {
      page: pageParam,
      searchText: debouncedQuery || undefined,
    };

    const response = await fetchData<UserResponse[]>(
      createRequestUrl(apiUrl.userUrl),
      request
    );

    if (response.isSuccess) {
      setTotalRecords(response.metadata?.TotalItemCount ?? 0);

      const mappedList: UserRowProps[] = response.value.map((item) => ({
        ...item,
        birthDate: item.birthDate ? new Date(item.birthDate) : null,
        typeId: item.typeId.toString(),
        relativeName: item.relativeName,
        profilePicture:
          item.profilePicture &&
          base64ToBlob(item.profilePicture as string, "image/jpeg"),
      }));

      return {
        isSuccess: true,
        metadata: response.metadata,
        value: mappedList,
      } as SuccessResponse<UserRowProps[]>;
    }

    return Promise.reject(new Error(response.error));
  };

  const getNextPageParam = (lastPage: SuccessResponse<UserRowProps[]>) => {
    if (!lastPage.metadata) return undefined;

    if (lastPage.metadata.TotalPageCount > lastPage.metadata.CurrentPage) {
      return lastPage.metadata.CurrentPage + 1;
    }

    return undefined;
  };

  const { data, fetchNextPage, isFetching, refetch, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["users", debouncedQuery],
      queryFn: fetchItems,
      initialPageParam: 1,
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => getNextPageParam(lastPage),
      refetchOnWindowFocus: false,
      staleTime: 0,
    });

  useEffect(() => {
    const queryData = data?.pages?.flatMap((page) => page.value) ?? [];
    handleReplaceItems(queryData);
  }, [data]);

  return {
    items,
    selectedItems,
    setSelectedItems,
    totalRecordCount,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch,
    handleAddItems,
    handleUpdateItems,
    handleReplaceItems,
    handleDeleteItems,
    handleUpdateItemWithId,
    setTotalRecords,
  };
};

export default useItems;
