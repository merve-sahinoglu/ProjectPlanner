import { container } from "tsyringe";
import RequestHandler from "../../../hooks/useRequestHandler";
import { useEffect, useReducer, useState } from "react";
import customReducer from "../../../services/custom-reducer/customReducer";
import { UserRowProps } from "../props/UserRowProps";
import { useDebouncedValue } from "@mantine/hooks";
import ReducerActions from "../../../enum/reducer-action.enum";
import { apiUrl, createRequestUrl } from "../../../config/app.config";
import { ResponseBase } from "../../../services/request-handler/response-base";
import parseResponseErrors from "../../../helpers/apiErrorParser";
import { useInfiniteQuery } from "@tanstack/react-query";

const requestHandler = container.resolve(RequestHandler);

interface UseUserProps {
  searchQuery: string;
  isActive: boolean;
}

const useItems = ({ searchQuery, isActive }: UseUserProps) => {
  const [items, dispatch] = useReducer(customReducer<UserRowProps>, []);

  const [selectedItems, setSelectedItems] = useState<UserRowProps[]>([]);

  const [totalItemCount, setTotalItemCount] = useState<number>(0);

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

  const fetchItems = async ({ pageParam = 0 }) => {
    const response = (await requestHandler.getRequest(
      createRequestUrl(apiUrl.userUrl),
      pageParam,
      debouncedQuery
        .toLocaleLowerCase()
        .trim()
        .replace("-", "")
        .replace(/\s/g, "")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ç/g, "c")
        .replace(/ö/g, "o")
        .toLocaleUpperCase("en-US"),
      undefined
    )) as ResponseBase<UserRowProps>;

    if (response.isSuccess) {
      setTotalItemCount(response.metadata.TotalItemCount);
      return response;
    }

    return Promise.reject(
      new Error(
        response.errors === undefined
          ? response.detail
          : parseResponseErrors(response.errors)
      )
    );
  };

  function handleUpdateItemWithId(item: UserRowProps, id: string) {
    dispatch({
      type: ReducerActions.UpdateWithDifferentId,
      payload: item,
      id,
    });
  }

  const getNextPageParam = (lastPage: ResponseBase<UserRowProps>) => {
    if (lastPage.metadata?.TotalPageCount > lastPage.metadata?.CurrentPage) {
      return lastPage.metadata.CurrentPage + 1;
    }
    return undefined;
  };

  const { data, fetchNextPage, isFetching, refetch, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["items", debouncedQuery, isActive],
      queryFn: fetchItems,
      keepPreviousData: true,
      getNextPageParam: (lastPage) => getNextPageParam(lastPage),
      refetchOnWindowFocus: false,
      staleTime: 0,
    });

  useEffect(() => {
    const queryData = data?.pages?.flatMap((page) => page.dataList) ?? [];
    handleReplaceItems(queryData);
  }, [data]);

  return {
    totalItemCount,
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
