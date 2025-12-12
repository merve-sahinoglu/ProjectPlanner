import { useEffect, useReducer, useState } from "react";

import { useDebouncedValue } from "@mantine/hooks";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import useRequestManager, { SuccessResponse } from "@hooks/useRequestManager";
import { apiUrl, createRequestUrl } from "../../../config/app.config";
import ReducerActions from "../../../enums/reducer-action.enum";
import customReducer from "../../../services/custom-reducer/customReducer";
import { RoomResponse, RoomRowProps } from "../props/RoomRowProps";

interface UseRoomProps {
  searchQuery?: string;
  isActive?: boolean;
}

const useRooms = ({ searchQuery = "", isActive = true }: UseRoomProps = {}) => {
  const { fetchData } = useRequestManager();

  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);

  const [items, dispatch] = useReducer(customReducer<RoomRowProps>, []);
  const [selectedItems, setSelectedItems] = useState<RoomRowProps[]>([]);
  const [totalRecordCount, setTotalRecords] = useState<number>(0);

  function handleAddItems(item: RoomRowProps) {
    dispatch({ type: ReducerActions.Add, payload: item });
  }

  function handleUpdateItems(item: RoomRowProps) {
    dispatch({ type: ReducerActions.Update, payload: item });
  }

  function handleDeleteItems(itemId: string) {
    dispatch({ type: ReducerActions.Delete, payload: itemId });
  }

  function handleReplaceItems(list: RoomRowProps[]) {
    dispatch({ type: ReducerActions.Replace, payload: list });
  }

  function handleUpdateItemWithId(item: RoomRowProps, id: string) {
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
      // Backend destekliyorsa:
      isActive: isActive,
    };

    const response = await fetchData<RoomResponse[]>(
      createRequestUrl(apiUrl.appointmentRoomsUrl),
      request
    );

    if (response.isSuccess) {
      setTotalRecords(response.metadata?.TotalItemCount ?? 0);

      const mappedList: RoomRowProps[] = response.value.map((x) => ({
        ...x,
        roomTypeId: x.roomTypeId?.toString?.() ?? "0",
      }));

      return {
        isSuccess: true,
        metadata: response.metadata,
        value: mappedList,
      } as SuccessResponse<RoomRowProps[]>;
    }

    return Promise.reject(new Error(response.error));
  };

  const getNextPageParam = (lastPage: SuccessResponse<RoomRowProps[]>) => {
    if (!lastPage.metadata) return undefined;

    if (lastPage.metadata.TotalPageCount > lastPage.metadata.CurrentPage) {
      return lastPage.metadata.CurrentPage + 1;
    }

    return undefined;
  };

  const { data, fetchNextPage, isFetching, refetch, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["rooms", debouncedQuery, isActive],
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

export default useRooms;
