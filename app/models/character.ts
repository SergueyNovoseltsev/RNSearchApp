export interface ApiInfo {
  count: number;
  pages: number;
  next: string;
  prev: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; link: string };
  location: { name: string; link: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface GetCharacter {
  info: ApiInfo;
  results: Character[];
}

export const speciesArr = [
  { label: "Alive", value: "alive" },
  { label: "Dead", value: "dead" },
  { label: "Unknown", value: "unknown" },
];

export const genderArr = [
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Genderless", value: "genderless" },
  { label: "Unknown", value: "unknown" },
];

export type Species = (typeof speciesArr)[number]["value"] | undefined;
export type Gender = (typeof genderArr)[number]["value"] | undefined;

export interface ApiGetCharProps {
  name: string | undefined;
  status: string | undefined;
  species: Species;
  gender: Gender;
  type: string | undefined;
  page: number;
}
