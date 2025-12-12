import { useEffect, useReducer, useState } from "react";

import { useDebouncedValue } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

import useRequestManager, { SuccessResponse } from "@hooks/useRequestManager";
import { apiUrl, createRequestUrl } from "../../../config/app.config";
import ReducerActions from "../../../enums/reducer-action.enum";
import customReducer from "../../../services/custom-reducer/customReducer";
import PaginationMetadata from "../../../types/pagination-metadata";
import {
  PlayGroupResponse,
  PlayGroupRowProps,
} from "../props/PlayGroupRowProps";

interface UsePlayGroupProps {
  searchQuery: string;
  isActive: boolean;
  changeMetadata: (value: PaginationMetadata | null) => void;
}

const usePlayGroup = ({
  searchQuery,
  isActive,
  changeMetadata,
}: UsePlayGroupProps) => {
  const { fetchData } = useRequestManager();

  const [playGroups, dispatch] = useReducer(
    customReducer<PlayGroupRowProps>,
    []
  );

  const [selectedItems, setSelectedItems] = useState<PlayGroupRowProps[]>([]);

  const [totalRecordCount, setTotalRecords] = useState(0);

  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);

  function handleAddItems(item: PlayGroupRowProps) {
    dispatch({
      type: ReducerActions.Add,
      payload: item,
    });
  }

  function handleUpdateItems(item: PlayGroupRowProps) {
    dispatch({
      type: ReducerActions.Update,
      payload: item,
    });
  }

  function handleDeleteItems(itemId: string) {
    dispatch({
      type: ReducerActions.Delete,
      payload: itemId,
    });
  }

  function handleReplaceItems(item: PlayGroupRowProps[]) {
    dispatch({
      type: ReducerActions.Replace,
      payload: item,
    });
  }

  const fetchItems = async ({ pageParam = 1 }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request: { [key: string]: any } = {
      page: pageParam,
      searchText: searchQuery,
      isActive: isActive,
    };

    const response = await fetchData<PlayGroupResponse[]>(
      createRequestUrl(apiUrl.appointmentPlayGroupUrl),
      request
    );

    if (response.isSuccess) {
      setTotalRecords(response.metadata?.TotalItemCount || 0);
      changeMetadata(response.metadata ? response.metadata : null);
      const retVal = response.value;

      const data: PlayGroupRowProps[] = retVal.map((x) => ({
        ...x,
      }));

      return {
        isSuccess: true,
        metadata: response.metadata,
        value: data,
      } as SuccessResponse<PlayGroupRowProps[]>;
    }

    return Promise.reject(new Error(response.error));
  };

  function handleUpdateItemWithId(item: PlayGroupRowProps, id: string) {
    dispatch({
      type: ReducerActions.UpdateWithDifferentId,
      payload: item,
      id,
    });
  }

  const getNextPageParam = (lastPage: SuccessResponse<PlayGroupRowProps[]>) => {
    if (!lastPage.metadata) return undefined;

    if (lastPage.metadata?.TotalPageCount > lastPage.metadata?.CurrentPage) {
      return lastPage.metadata.CurrentPage + 1;
    }
    return undefined;
  };

  const { data, fetchNextPage, isFetching, refetch, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["playGroups"],
      queryFn: fetchItems,
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => getNextPageParam(lastPage),
      refetchOnWindowFocus: false,
      staleTime: 0,
    });

  useEffect(() => {
    const queryData = data?.pages?.flatMap((page) => page.value) ?? [];
    handleReplaceItems(queryData);
  }, [data]);

  return {
    setTotalRecords,
    playGroups,
    selectedItems,
    setSelectedItems,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    handleUpdateItems,
    handleAddItems,
    handleReplaceItems,
    handleDeleteItems,
    handleUpdateItemWithId,
  };
};

export default usePlayGroup;
