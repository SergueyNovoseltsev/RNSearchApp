export interface ApiInfo {
  count: number;
  pages: number;
  next: string;
  prev: string;
}

export interface GetApiFetch<T> {
  info: ApiInfo;
  results: T;
}
