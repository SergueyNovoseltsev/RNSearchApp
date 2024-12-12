import { ApiInfo } from "./api";

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

export const statusArr = [
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

export type Status = (typeof statusArr)[number]["value"] | undefined;
export type Gender = (typeof genderArr)[number]["value"] | undefined;

export interface ApiGetCharProps {
  name: string | undefined;
  species: string | undefined;
  type: string | undefined;
  status: Status;
  gender: Gender;
  page: number;
}
