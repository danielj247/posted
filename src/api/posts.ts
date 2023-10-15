import { BASE_URL } from "@/constants/api";
import type { Post } from "@/types/post";

export function getPosts(): Promise<Post[]> {
  return fetch(`${BASE_URL}/posts`).then((res) => res.status === 200 && res.json());
}

export function getPost(id: number): Promise<Post> {
  return fetch(`${BASE_URL}/posts/${id}`).then((res) => res.status === 200 && res.json());
}
