import { useState } from "react";

import toast from "react-hot-toast";

import RequestType from "@helpers/request-handler/request-type";
import { PaginationMetadata } from "@helpers/request-handler/response-base";
import parseResponseErrors from "@utils/api-error-parser";

export interface SuccessResponse<T> {
  isSuccess: true;
  value: T;
  metadata?: PaginationMetadata;
}

interface FailureResponse {
  isSuccess: false;
  error: string;
}

type Dictionary = {
  [key: string]: (string | number) | (string | number)[];
};

export type ResponseBase<T> = SuccessResponse<T> | FailureResponse;

function useRequestManager() {
  const [isPending, setIsPending] = useState<boolean>(false);

  async function fetchData<T>(
    url: string,
    searchParameters?: {
      [key: string]:
        | string
        | number
        | boolean
        | Array<string | number>
        | Dictionary
        | undefined
        | null;
    },
    headers?: HeadersInit
  ): Promise<ResponseBase<T>> {
    setIsPending(true);
    const link = new URL(url);
    if (searchParameters) {
      Object.entries(searchParameters).forEach((x) => {
        if (x[1] === undefined) return;
        if (Array.isArray(x[1])) {
          x[1].forEach((value) => {
            link.searchParams.append(x[0], String(value));
          });
        } else link.searchParams.set(x[0], String(x[1]));
      });
    }

    link.searchParams.set("pageSize", "500"); // TODO: ekranlarda kontrol edilecek, ondan sonra kaldırabilir.

    return fetch(link, { method: RequestType.Get })
      .then(async (response) => {
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

          if (responseJson.detail !== undefined) {
            toast.error(responseJson.detail);

            return {
              isSuccess: false,
              error: responseJson.detail,
            } as FailureResponse;
          }

          toast.error(
            typeof responseJson === "object"
              ? JSON.stringify(responseJson, null, 2)
              : String(responseJson)
          );

          return {
            isSuccess: false,
            error: responseJson as string,
          } as FailureResponse;
        }

        let paginationJson = response.headers.get("x-pagination");

        if (paginationJson) paginationJson = JSON.parse(paginationJson);

        return {
          isSuccess: true,
          metadata: paginationJson ? paginationJson : undefined,
          value: responseJson,
        } as SuccessResponse<T>;
      })
      .catch((error) => {
        return {
          isSuccess: false,
          error: error instanceof Error ? error.message : String(error),
        } as FailureResponse;
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  async function sendData<T, R>(
    url: string,
    type: RequestType,
    data?: T,
    searchParameters?: {
      [key: string]:
        | string
        | number
        | boolean
        | Array<string | number>
        | Dictionary
        | undefined;
    }
  ): Promise<ResponseBase<R>> {
    setIsPending(true);
    const link = new URL(url);

    if (searchParameters) {
      Object.entries(searchParameters).forEach((x) => {
        if (x[1] === undefined) return;
        if (Array.isArray(x[1])) {
          x[1].forEach((value) => {
            link.searchParams.append(x[0], String(value));
          });
        } else link.searchParams.set(x[0], String(x[1]));
      });
    }

    return fetch(link, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      method: type,
      body: data ? JSON.stringify(data) : undefined,
    })
      .then(async (response) => {
        if (response.status === 204) {
          return {
            isSuccess: true,
            value: {} as unknown,
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

          if (responseJson.detail !== undefined) {
            toast.error(responseJson.detail);

            return {
              isSuccess: false,
              error: responseJson.detail,
            } as FailureResponse;
          }

          toast.error(responseJson.detail);

          return {
            isSuccess: false,
            error: responseJson as string,
          } as FailureResponse;
        }

        const paginationJson = response.headers.get(
          "x-pagination"
        ) as PaginationMetadata | null;

        return {
          isSuccess: true,
          metadata: paginationJson ? paginationJson : undefined,
          value: responseJson,
        } as SuccessResponse<R>;
      })
      .catch((error) => {
        return {
          isSuccess: false,
          error: error instanceof Error ? error.message : String(error),
        } as FailureResponse;
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  function getFileName(disposition: string): string {
    // eslint-disable-next-line no-useless-escape
    const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i;
    const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

    let fileName = "";

    if (utf8FilenameRegex.test(disposition)) {
      const regexArray = utf8FilenameRegex.exec(disposition);
      if (regexArray) {
        fileName = decodeURIComponent(regexArray[1]);
        return fileName;
      }
    }

    if (!utf8FilenameRegex.test(disposition)) {
      const filenameStart = disposition.toLowerCase().indexOf("filename=");
      if (filenameStart >= 0) {
        const partialDisposition = disposition.slice(filenameStart);
        const matches = asciiFilenameRegex.exec(partialDisposition);
        if (matches != null && matches[2]) {
          fileName = matches[2];
        }
      }
    }

    return fileName;
  }

  async function fetchFile<T>(
    url: string,
    type: RequestType,
    data?: T,
    searchParameters?: {
      [key: string]:
        | string
        | number
        | boolean
        | Array<string | number>
        | Dictionary
        | undefined
        | null;
    },
    headers?: HeadersInit
  ): Promise<ResponseBase<void>> {
    setIsPending(true);
    const link = new URL(url);

    if (searchParameters) {
      Object.entries(searchParameters).forEach((x) => {
        if (x[1] === undefined) return;
        if (Array.isArray(x[1])) {
          x[1].forEach((value) => {
            link.searchParams.append(x[0], String(value));
          });
        } else link.searchParams.set(x[0], String(x[1]));
      });
    }

    return fetch(link, {
      method: type,
      body: data ? JSON.stringify(data) : undefined,
    })
      .then(async (response) => {
        if (!response.ok) {
          const responseJson = await response.json();
          if (responseJson.errors !== undefined) {
            const validationErrors = parseResponseErrors(responseJson.errors);

            toast.error(validationErrors);

            return {
              isSuccess: false,
              error: parseResponseErrors(responseJson.errors),
            } as FailureResponse;
          }

          if (responseJson.detail !== undefined) {
            toast.error(responseJson.detail);

            return {
              isSuccess: false,
              error: responseJson.detail,
            } as FailureResponse;
          }

          toast.error(responseJson);

          return {
            isSuccess: false,
            error: responseJson as string,
          } as FailureResponse;
        }

        const link = document.createElement("a");
        const contentHeader = response.headers.get("Content-Disposition");

        let fileName = "";

        if (contentHeader) {
          fileName = getFileName(contentHeader);
        }

        link.target = "_blank";
        link.download = fileName;

        const blob = await response.blob();

        link.href = URL.createObjectURL(blob);

        link.click();

        return {
          isSuccess: true,
          value: {} as unknown,
          metadata: undefined,
        } as SuccessResponse<void>;
      })
      .catch((error) => {
        return {
          isSuccess: false,
          error: error instanceof Error ? error.message : String(error),
        } as FailureResponse;
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  return { isPending, fetchData, sendData, fetchFile };
}

export default useRequestManager;
