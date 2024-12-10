import { Character } from "@/app/models/character";
import { useGetFetch } from "../useFetch";

export function useGetCharList() {
  return useGetFetch<Character>("MY_API_ENDPOINT/" + id);
}

export function useGetCharacterDetail(id: number) {
  return useGetFetch<Character[]>("MY_API_ENDPOINT");
}
