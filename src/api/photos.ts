import { BASE_URL } from "@/constants/api";
import type { Photo } from "@/types/photo";

export function getPhotos(): Promise<Photo[]> {
  return fetch(`${BASE_URL}/photos`).then((res) => res.status === 200 && res.json());
}

export function getPhoto(id: number): Promise<Photo> {
  return fetch(`${BASE_URL}/photos/${id}`).then((res) => res.status === 200 && res.json());
}
