import { useEffect, useReducer, useState } from "react";
import customReducer from "../../../services/custom-reducer/customReducer";
import { useDebouncedValue } from "@mantine/hooks";
import ReducerActions from "../../../enum/reducer-action.enum";
import { apiUrl, createRequestUrl } from "../../../config/app.config";
import { useInfiniteQuery } from "@tanstack/react-query";
import useRequestHandler, {
  SuccessResponse,
} from "../../../hooks/useRequestHandler";
import PaginationMetadata from "../../../types/pagination-metadata";
import { RoomResponse, RoomRowProps } from "../props/RoomRowProps";

interface UseRoomProps {
  searchQuery: string;
  isActive: boolean;
  changeMetadata: (value: PaginationMetadata | null) => void;
}

const useRooms = ({ searchQuery, isActive, changeMetadata }: UseRoomProps) => {
  const { fetchData, sendData } = useRequestHandler();

  const [items, dispatch] = useReducer(customReducer<RoomRowProps>, []);

  const [selectedItems, setSelectedItems] = useState<RoomRowProps[]>([]);

  const [totalRecordCount, setTotalRecords] = useState(0);

  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);

  function handleAddItems(item: RoomRowProps) {
    dispatch({
      type: ReducerActions.Add,
      payload: item,
    });
  }

  function handleUpdateItems(item: RoomRowProps) {
    dispatch({
      type: ReducerActions.Update,
      payload: item,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleDeleteItems(itemId: string) {
    dispatch({
      type: ReducerActions.Delete,
      payload: itemId,
    });
  }

  function handleReplaceItems(item: RoomRowProps[]) {
    dispatch({
      type: ReducerActions.Replace,
      payload: item,
    });
  }

  const fetchItems = async ({ pageParam = 1 }) => {
    const request: { [key: string]: any } = {
      page: pageParam,
      searchText: searchQuery,
    };

    const response = await fetchData<RoomResponse[]>(
      createRequestUrl(apiUrl.appointmentRoomsUrl),
      request
    );

    if (response.isSuccess) {
      setTotalRecords(response.metadata?.TotalItemCount || 0);
      changeMetadata(response.metadata ? response.metadata : null);
      const retVal = response.value;

      const data: RoomRowProps[] = retVal.map((x) => ({
        ...x,
        roomTypeId: x.roomTypeId.toString(),
      }));

      return {
        isSuccess: true,
        metadata: response.metadata,
        value: data,
      } as SuccessResponse<RoomRowProps[]>;
    }

    return Promise.reject(new Error(response.error));
  };

  function handleUpdateItemWithId(item: RoomRowProps, id: string) {
    dispatch({
      type: ReducerActions.UpdateWithDifferentId,
      payload: item,
      id,
    });
  }

  const getNextPageParam = (lastPage: SuccessResponse<RoomRowProps[]>) => {
    if (!lastPage.metadata) return undefined;

    if (lastPage.metadata?.TotalPageCount > lastPage.metadata?.CurrentPage) {
      return lastPage.metadata.CurrentPage + 1;
    }
    return undefined;
  };

  const { data, fetchNextPage, isFetching, refetch, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["users"],
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
    items,
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

export default useRooms;
