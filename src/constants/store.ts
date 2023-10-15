import { FilterSort } from "@/types/filter";

import type { User } from "@/types/user";
import type { Post } from "@/types/post";
import type { Comment } from "@/types/comment";

export const DEFAULT_FILTERS = {
  sort: FilterSort.DESC,
  search: "",
  user: {} as User,
};

// test data
export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: "john.doe",
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    username: "jane.doe",
    name: "Jane Doe",
    email: "jane.doe@example.com",
  },
];

export const MOCK_USERS_POST_INIT: User[] = [
  {
    id: 1,
    username: "john.doe",
    name: "John Doe",
    email: "john.doe@example.com",
    photo: "https://i.pravatar.cc/150?u=john.doe",
  },
  {
    id: 2,
    username: "jane.doe",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    photo: "https://i.pravatar.cc/150?u=jane.doe",
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    postId: 1,
    id: 1,
    name: "Comment one",
    email: "email1@example.com",
    body: "Comment one body",
  },
  {
    postId: 2,
    id: 2,
    name: "Comment two",
    email: "email2@example.com",
    body: "Comment two body",
  },
];

export const MOCK_COMMENTS_POST_INIT: Comment[] = [
  {
    postId: 1,
    id: 1,
    name: "Comment one",
    email: "email1@example.com",
    body: "Comment one body",
    user: MOCK_USERS_POST_INIT[0],
  },
  {
    postId: 2,
    id: 2,
    name: "Comment two",
    email: "email2@example.com",
    body: "Comment two body",
    user: MOCK_USERS_POST_INIT[1],
  },
];

export const MOCK_POSTS: Post[] = [
  {
    userId: 1,
    id: 1,
    title: "Post one",
    body: "Post one body",
  },
  {
    userId: 2,
    id: 2,
    title: "Post two",
    body: "Post two body",
  },
];
