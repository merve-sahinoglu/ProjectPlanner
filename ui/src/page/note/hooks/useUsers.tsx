import { useEffect, useReducer, useState } from "react";
import customReducer from "../../../services/custom-reducer/customReducer";
import { UserResponse, UserRowProps } from "./props/UserTypes";
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

    const response = await fetchData<UserResponse[]>(
      createRequestUrl(apiUrl.userUrl),
      request
    );

    if (response.isSuccess) {
      setTotalRecords(response.metadata?.TotalItemCount || 0);

      const retval = response.value.map((item) => ({
        ...item,
        birthDate: item.birthDate ? new Date(item.birthDate) : null,
        typeId: item.typeId.toString(),
        relativeName: item.relativeName,
        profilePicture:
          item.profilePicture &&
          base64ToBlob(item.profilePicture as string, "image/jpeg"),
      }));

      changeMetadata(response.metadata ? response.metadata : null);

      return {
        isSuccess: true,
        metadata: response.metadata,
        value: retval,
      } as SuccessResponse<UserRowProps[]>;
    }

    return Promise.reject(new Error(response.error));
  };

  function base64ToBlob(
    base64: string,
    mimeType: "image/jpeg" | "image/png"
  ): Blob {
    // Check if base64 contains the data URL prefix
    const base64Data = base64.split(",")[1] || base64; // Take part after the comma or the entire string if no comma

    const byteCharacters = atob(base64Data); // Decode the base64 string
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i); // Convert characters to byte values
    }

    const byteArray = new Uint8Array(byteNumbers); // Create Uint8Array from byte numbers
    const blob = new Blob([byteArray], { type: mimeType }); // Create a blob with the correct mime type

    return new File([blob], "image.jpeg", { type: mimeType }); // Return as File
  }

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
