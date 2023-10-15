import { BASE_URL } from "@/constants/api";
import type { Todo } from "@/types/todo";

export function getTodos(): Promise<Todo[]> {
  return fetch(`${BASE_URL}/todos`).then((res) => res.status === 200 && res.json());
}

export function getTodo(id: number): Promise<Todo> {
  return fetch(`${BASE_URL}/todos/${id}`).then((res) => res.status === 200 && res.json());
}
