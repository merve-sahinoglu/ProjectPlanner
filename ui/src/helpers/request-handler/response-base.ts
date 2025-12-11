export interface PaginationMetadata {
  TotalItemCount: number;
  TotalPageCount: number;
  PageSize: number;
  CurrentPage: number;
}

export interface ResponseBase<T> {
  detail: string;
  data: T;
  dataList: Array<T>;
  errors: ResponseErrorArrayDto;
  isSuccess: boolean;
  metadata: PaginationMetadata;
  status?: number;
}

export interface ResponseErrorArrayDto {
  [key: string]: Array<string>;
}
