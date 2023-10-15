import { BASE_URL } from "@/constants/api";
import type { User } from "@/types/user";

export function getUsers(): Promise<User[]> {
  return fetch(`${BASE_URL}/users`).then((res) => res.status === 200 && res.json());
}

export function getUser(id: number): Promise<User> {
  return fetch(`${BASE_URL}/users/${id}`).then((res) => res.status === 200 && res.json());
}
