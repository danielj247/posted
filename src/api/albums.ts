import { BASE_URL } from "@/constants/api";
import type { Album } from "@/types/album";

export function getAlbums(): Promise<Album[]> {
  return fetch(`${BASE_URL}/albums`).then((res) => res.status === 200 && res.json());
}

export function getAlbum(id: number): Promise<Album> {
  return fetch(`${BASE_URL}/albums/${id}`).then((res) => res.status === 200 && res.json());
}
