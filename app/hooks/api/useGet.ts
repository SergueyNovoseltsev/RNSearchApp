import {
  ApiGetCharProps,
  Character,
  GetCharacter,
} from "@/app/models/character";
import { useGetFetch } from "../useFetch";

export function useGetCharList({
  name,
  status,
  type,
  species,
  gender,
  page,
}: ApiGetCharProps) {
  const buildUrl = () => {
    let url = `https://rickandmortyapi.com/api/character?page=${page}`;

    if (name) url += `&name=${name}`;
    if (status) url += `&status=${status}`;
    if (type) url += `&type=${type}`;
    if (species) url += `&species=${species}`;
    if (gender) url += `&gender=${gender}`;

    return url;
  };

  return useGetFetch<GetCharacter>(buildUrl());
}

export function useGetCharacterDetail(id: number) {
  return useGetFetch<Character>("MY_API_ENDPOINT/" + id);
}
