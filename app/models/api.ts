export interface ApiInfo {
  count: number;
  pages: number;
  next: string;
  prev: string;
}

export interface GetCharacter<T> {
  info: ApiInfo;
  results: T;
}
