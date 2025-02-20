import { useEffect, useReducer, useState } from "react";
import customReducer from "../../../services/custom-reducer/customReducer";
import { UserRowProps } from "../props/UserTypes";
import { useDebouncedValue } from "@mantine/hooks";
import ReducerActions from "../../../enum/reducer-action.enum";
import { apiUrl, createRequestUrl } from "../../../config/app.config";
import { useInfiniteQuery } from "@tanstack/react-query";
import useRequestHandler, {
  SuccessResponse,
} from "../../../hooks/useRequestHandler";
import PaginationMetadata from "../../../types/pagination-metadata";

interface UseUserProps {
  searchQuery: string;
  isActive: boolean;
  changeMetadata: (value: PaginationMetadata | null) => void;
}

const useItems = ({ searchQuery, isActive, changeMetadata }: UseUserProps) => {
  const { fetchData, sendData } = useRequestHandler();

  const [items, dispatch] = useReducer(customReducer<UserRowProps>, []);

  const [selectedItems, setSelectedItems] = useState<UserRowProps[]>([]);

  const [totalRecordCount, setTotalRecords] = useState(0);

  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);

  function handleAddItems(item: UserRowProps) {
    dispatch({
      type: ReducerActions.Add,
      payload: item,
    });
  }

  function handleUpdateItems(item: UserRowProps) {
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

  function handleReplaceItems(item: UserRowProps[]) {
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

    const response = await fetchData<UserRowProps[]>(
      createRequestUrl(apiUrl.userUrl),
      request
    );

    if (response.isSuccess) {
      setTotalRecords(response.metadata?.TotalItemCount || 0);
      changeMetadata(response.metadata ? response.metadata : null);
      return response;
    }

    return Promise.reject(new Error(response.error));
  };

  function handleUpdateItemWithId(item: UserRowProps, id: string) {
    dispatch({
      type: ReducerActions.UpdateWithDifferentId,
      payload: item,
      id,
    });
  }

  const getNextPageParam = (lastPage: SuccessResponse<UserRowProps[]>) => {
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

export default useItems;
