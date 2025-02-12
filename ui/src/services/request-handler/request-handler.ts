/* eslint-disable class-methods-use-this */
import toast from "react-hot-toast";
import "reflect-metadata";
import { Lifecycle, scoped } from "tsyringe";
import RequestType from "./request-type";
import { PaginationMetadata, ResponseBase } from "./response-base";
import parseResponseErrors from "../../helpers/apiErrorParser";

interface IRequestHandler<T> {
  sendRequest(
    url: string,
    requestType: RequestType,
    requestData: T
  ): Promise<ResponseBase<T>>;
  getRequestWithId(
    url: string,
    id: string,
    isActive?: string
  ): Promise<ResponseBase<T>>;
  getRequest(url: string): Promise<ResponseBase<T>>;
}

@scoped(Lifecycle.ContainerScoped)
class RequestHandler<T> implements IRequestHandler<T> {
  pageSize = 500;

  async sendRequest(
    url: string,
    requestType: RequestType,
    requestData?: T | undefined
  ): Promise<ResponseBase<T>> {
    return fetch(url, {
      method: requestType,
      body: requestData ? JSON.stringify(requestData) : undefined,
    })
      .then(async (response) => {
        let responseData = {} as ResponseBase<T>;

        if (response.status === 204) {
          responseData.isSuccess = true;
          return responseData as ResponseBase<T>;
        }

        const responseJson = await response.json();

        if (!response.ok) {
          responseData = responseJson as ResponseBase<T>;
          if (responseData.errors !== undefined) {
            const validationError = parseResponseErrors(responseData.errors);

            toast.error(`${validationError}`);
          }

          if (responseData.detail !== undefined) {
            toast.error(`${responseData.detail}`);
          }
          responseData.isSuccess = false;
          return responseData as ResponseBase<T>;
        }
        responseData.data = responseJson;
        responseData.isSuccess = true;
        responseData.status = response.status;
        return responseData as ResponseBase<T>;
      })
      .catch((error) => {
        const responseData = {} as ResponseBase<T>;
        responseData.isSuccess = false;
        responseData.errors = error;
        return responseData as ResponseBase<T>;
      });
  }

  async getRequestWithId(
    url: string,
    isActive?: string
  ): Promise<ResponseBase<T>> {
    let queryString = `PageSize=${this.pageSize}`;
    if (isActive) {
      queryString += `&isActive=${isActive}`;
    }
    return fetch(`${url}?${queryString}`, { method: RequestType.Get })
      .then(async (response) => {
        const responseJson = await response.json();
        let responseData = {} as ResponseBase<T>;
        if (!response.ok) {
          responseData = responseJson as ResponseBase<T>;
          if (responseData.errors !== undefined) {
            const validationError = parseResponseErrors(responseData.errors);

            toast.error(`${validationError}`);
          }

          if (responseData.detail !== undefined) {
            toast.error(`${responseData.detail}`);
          }
          responseData.isSuccess = false;
          return responseData as ResponseBase<T>;
        }

        if (Array.isArray(responseJson)) {
          responseData.dataList = responseJson;
        } else {
          responseData.data = responseJson;
        }

        responseData.isSuccess = true;
        return responseData as ResponseBase<T>;
      })
      .catch((error) => {
        const responseData = {} as ResponseBase<T>;
        responseData.isSuccess = false;
        responseData.errors = error;
        return responseData as ResponseBase<T>;
      });
  }

  async getRequest(
    url: string,
    pageNumber?: number,
    searchQuery?: string,
    isValueLabel?: boolean,
    additionalQueries?: string
  ): Promise<ResponseBase<T>> {
    let queryString = `PageSize=${this.pageSize}`;
    if (pageNumber) {
      queryString += `&PageNumber=${pageNumber}`;
    }
    if (searchQuery) {
      queryString += `&SearchQuery=${searchQuery}`;
    }
    if (isValueLabel) {
      queryString += `&isValueLabel=${isValueLabel}`;
    }
    if (additionalQueries) {
      queryString += additionalQueries;
    }
    return fetch(`${url}?${queryString}`, { method: RequestType.Get })
      .then(async (response) => {
        const responseJson = await response.json();
        let responseData = {} as ResponseBase<T>;
        if (!response.ok) {
          responseData.dataList = [];
          responseData = responseJson as ResponseBase<T>;

          if (responseData.errors !== undefined) {
            const validationError = parseResponseErrors(responseData.errors);

            toast.error(`${validationError}`);
          }

          if (responseData.detail !== undefined) {
            toast.error(`${responseData.detail}`);
          }

          responseData.isSuccess = false;
          return responseData as ResponseBase<T>;
        }

        const paginationJson = response.headers.get("x-pagination");

        if (paginationJson) {
          responseData.metadata = JSON.parse(
            paginationJson
          ) as PaginationMetadata;
        } else {
          responseData.metadata = {
            CurrentPage: 1,
            PageSize: 20,
            TotalItemCount: 20,
            TotalPageCount: 1,
          };
        }

        if (Array.isArray(responseJson)) {
          responseData.dataList = responseJson;
        } else {
          responseData.data = responseJson;
        }
        responseData.isSuccess = true;
        return responseData as ResponseBase<T>;
      })
      .catch((error) => {
        const responseData = {} as ResponseBase<T>;
        responseData.isSuccess = false;
        responseData.errors = error;
        return responseData as ResponseBase<T>;
      });
  }
}

export default RequestHandler;
