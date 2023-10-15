import { BASE_URL } from "@/constants/api";
import type { Comment } from "@/types/comment";

export function getComments(): Promise<Comment[]> {
  return fetch(`${BASE_URL}/comments`).then((res) => res.status === 200 && res.json());
}

export function getComment(id: number): Promise<Comment> {
  return fetch(`${BASE_URL}/comments/${id}`).then((res) => res.status === 200 && res.json());
}
