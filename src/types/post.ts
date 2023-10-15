import type { Comment } from "@/types/comment";
import type { User } from "@/types/user";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface PostItem extends Post {
  user?: User;
  comments?: Comment[];
}
