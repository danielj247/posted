import type { User } from "@/types/user";

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
  user?: User;
}
