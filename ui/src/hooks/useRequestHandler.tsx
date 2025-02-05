import toast from 'react-hot-toast';
import parseResponseErrors from '../lib/error-parser';
import RequestType from '../enum/request-type';
import PaginationMetadata from '../types/pagination-metadata';

export interface SuccessResponse<T> {
  isSuccess: true;
  value: T;
  metadata?: PaginationMetadata;
}

interface FailureResponse {
  isSuccess: false;
  error: string;
}

export type Dictionary = {
  [key: string]: (string | number) | (string | number)[];
};

export type ResponseBase<T> = SuccessResponse<T> | FailureResponse;

function useRequestHandler() {
  async function fetchData<T>(
    url: string,
    searchParameters?: { [key: string]: string | number | boolean | Dictionary },
    headers?: HeadersInit
  ): Promise<ResponseBase<T>> {
    const link = new URL(url);

    if (searchParameters) {
      Object.entries(searchParameters).forEach(x => {
        link.searchParams.set(x[0], String(x[1]));
      });
    }

    return fetch(link, { method: RequestType.Get, headers: headers })
      .then(async response => {
        const responseJson = await response.json();

        if (!response.ok) {
          if (responseJson.errors !== undefined) {
            const validationErrors = parseResponseErrors(responseJson.errors);

            toast.error(validationErrors);

            return {
              isSuccess: false,
              error: parseResponseErrors(responseJson.errors),
            } as FailureResponse;
          }

          if (response.status === 500) {
            if (responseJson.traceId !== undefined) {
              return { isSuccess: false, error: responseJson.traceId } as FailureResponse;
            }

            return { isSuccess: false, error: responseJson as string } as FailureResponse;
          }

          return { isSuccess: false, error: responseJson as string } as FailureResponse;
        }

        let paginationJson = response.headers.get('x-pagination');

        if (paginationJson) paginationJson = JSON.parse(paginationJson);

        return {
          isSuccess: true,
          metadata: paginationJson ? paginationJson : undefined,
          value: responseJson,
        } as SuccessResponse<T>;
      })
      .catch(error => {
        return {
          isSuccess: false,
          error: error instanceof Error ? error.message : String(error),
        } as FailureResponse;
      });
  }

  async function sendData<T, R>(
    url: string,
    type: RequestType,
    data?: T,
    searchParameters?: { [key: string]: string | number | boolean }
  ): Promise<ResponseBase<R>> {
    const link = new URL(url);

    if (searchParameters) {
      Object.entries(searchParameters).forEach(x => {
        link.searchParams.set(x[0], String(x[1]));
      });
    }

    return fetch(link, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      method: type,
      body: data ? JSON.stringify(data) : undefined,
    })
      .then(async response => {
        if (response.status === 204) {
          return {
            isSuccess: true,
            value: {},
            metadata: undefined,
          } as SuccessResponse<R>;
        }

        const responseJson = await response.json();

        if (!response.ok) {
          if (responseJson.errors !== undefined) {
            const validationErrors = parseResponseErrors(responseJson.errors);

            toast.error(validationErrors);

            return {
              isSuccess: false,
              error: parseResponseErrors(responseJson.errors),
            } as FailureResponse;
          }

          toast.error(responseJson.detail);

          return { isSuccess: false, error: responseJson as string } as FailureResponse;
        }

        const paginationJson = response.headers.get('x-pagination') as PaginationMetadata | null;

        return {
          isSuccess: true,
          metadata: paginationJson ? paginationJson : undefined,
          value: responseJson,
        } as SuccessResponse<R>;
      })
      .catch(error => {
        return {
          isSuccess: false,
          error: error instanceof Error ? error.message : String(error),
        } as FailureResponse;
      });
  }

  return { fetchData, sendData };
}

export default useRequestHandler;
