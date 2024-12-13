import { ApiGetCharProps, Character } from "@/app/models/character";
import { useGetFetch } from "../useFetch";
import { Episode } from "@/app/models/episode";
import { Location } from "@/app/models/location";
import { GetApiFetch } from "@/app/models/api";

export function useGetCharList({
  name,
  species,
  type,
  status,
  gender,
  page,
}: ApiGetCharProps) {
  const buildUrl = () => {
    let url = `https://rickandmortyapi.com/api/character?page=${page}`;

    if (name) url += `&name=${name}`;
    if (status) url += `&status=${status}`;
    if (species) url += `&species=${species}`;
    if (gender) url += `&gender=${gender}`;
    if (type) url += `&type=${type}`;

    return url;
  };

  return useGetFetch<GetApiFetch<Character>>(buildUrl());
}

export function useGetCharacterDetail(id: string) {
  return useGetFetch<Character>(
    "https://rickandmortyapi.com/api/character/" + id
  );
}

export function useGetEpisodeList(ids: string | undefined) {
  return useGetFetch<Episode[]>(
    "https://rickandmortyapi.com/api/episode/" + ids?.toString()
  );
}

export function useGetLocation(id: string | undefined) {
  return useGetFetch<Location>(
    "https://rickandmortyapi.com/api/location/" + id
  );
}
