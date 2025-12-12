import { useEffect, useReducer, useState } from "react";

import { useDebouncedValue } from "@mantine/hooks";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import useRequestManager, { SuccessResponse } from "@hooks/useRequestManager";
import { apiUrl, createRequestUrl } from "../../../config/app.config";
import ReducerActions from "../../../enums/reducer-action.enum";
import customReducer from "../../../services/custom-reducer/customReducer";
import {
  PlayGroupResponse,
  PlayGroupRowProps,
} from "../props/PlayGroupRowProps";

interface UsePlayGroupProps {
  searchQuery?: string;
  isActive?: boolean;
}

const usePlayGroup = ({
  searchQuery = "",
  isActive = true,
}: UsePlayGroupProps = {}) => {
  const { fetchData } = useRequestManager();

  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);

  const [playGroups, dispatch] = useReducer(
    customReducer<PlayGroupRowProps>,
    []
  );
  const [selectedItems, setSelectedItems] = useState<PlayGroupRowProps[]>([]);
  const [totalRecordCount, setTotalRecords] = useState<number>(0);

  function handleAddItems(item: PlayGroupRowProps) {
    dispatch({ type: ReducerActions.Add, payload: item });
  }

  function handleUpdateItems(item: PlayGroupRowProps) {
    dispatch({ type: ReducerActions.Update, payload: item });
  }

  function handleDeleteItems(itemId: string) {
    dispatch({ type: ReducerActions.Delete, payload: itemId });
  }

  function handleReplaceItems(list: PlayGroupRowProps[]) {
    dispatch({ type: ReducerActions.Replace, payload: list });
  }

  function handleUpdateItemWithId(item: PlayGroupRowProps, id: string) {
    dispatch({
      type: ReducerActions.UpdateWithDifferentId,
      payload: item,
      id,
    });
  }

  const fetchItems = async ({ pageParam = 1 }) => {
    const request = {
      page: pageParam,
      searchText: debouncedQuery || undefined,
      isActive: isActive,
    };

    const response = await fetchData<PlayGroupResponse[]>(
      createRequestUrl(apiUrl.appointmentPlayGroupUrl),
      request
    );

    if (response.isSuccess) {
      setTotalRecords(response.metadata?.TotalItemCount ?? 0);

      const mappedList: PlayGroupRowProps[] = response.value.map((x) => ({
        ...x,
      }));

      return {
        isSuccess: true,
        metadata: response.metadata,
        value: mappedList,
      } as SuccessResponse<PlayGroupRowProps[]>;
    }

    return Promise.reject(new Error(response.error));
  };

  const getNextPageParam = (lastPage: SuccessResponse<PlayGroupRowProps[]>) => {
    if (!lastPage.metadata) return undefined;

    if (lastPage.metadata.TotalPageCount > lastPage.metadata.CurrentPage) {
      return lastPage.metadata.CurrentPage + 1;
    }

    return undefined;
  };

  const { data, fetchNextPage, isFetching, refetch, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["playGroups", debouncedQuery, isActive],
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
    playGroups,
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

export default usePlayGroup;
