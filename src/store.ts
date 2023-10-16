import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import { getPosts } from "@/api/posts";
import { getComments } from "@/api/comments";
import { getUsers } from "@/api/users";
import { toUsername } from "@/lib/string";
import { AVATAR_URL } from "@/constants/img";
import { DEFAULT_FILTERS } from "@/constants/store";
import { FilterSort } from "@/types/filter";

import type { Post, PostItem } from "@/types/post";
import type { Comment } from "@/types/comment";
import type { User } from "@/types/user";
import type { Filter } from "@/types/filter";

export const useStore = defineStore("main", () => {
  const router = useRouter();

  // persisting data in local storage
  const initialised = useLocalStorage<boolean>("initialised", false);
  const posts = useLocalStorage<Post[]>("posts", []);
  const comments = useLocalStorage<Comment[]>("comments", []);
  const users = useLocalStorage<User[]>("users", []);
  const currentUser = useLocalStorage<User>("currentUser", {} as User);

  // filter state, no need to persist
  const filter = ref<Filter>({ ...DEFAULT_FILTERS });

  const isLoggedIn = computed(() => !!currentUser?.value?.id);

  // computed property to map posts with user and comment data for easy rendering
  const postItems = computed<PostItem[]>(() => {
    return (
      posts.value
        // filter posts before mapping to save performance
        .filter((post) => {
          const shouldSelectByUser = (filter.value?.user?.id || 0) > 0;

          const searchResult =
            filter.value?.search && post.title.toLowerCase().includes(filter.value.search.toLowerCase());
          const userResult = filter.value?.user && post.userId === filter.value.user?.id;

          if (filter.value.search && shouldSelectByUser) {
            return searchResult && userResult;
          }

          if (filter.value.search) {
            return searchResult;
          }

          if (shouldSelectByUser) {
            return userResult;
          }

          return true;
        })
        // sort posts by id as no date values are available
        .sort((a, b) => {
          if (filter.value.sort === FilterSort.DESC) {
            return b.id - a.id;
          }

          return a.id - b.id;
        })
        // map through posts to include user and comment data
        .map((post) => {
          const user = users.value.find((user) => user.id === post.userId);

          const postComments = comments.value
            // check if comment belongs to post
            .filter((comment) => comment.postId === post.id)
            // map comment to include user data
            .map((comment) => ({
              ...comment,
              user: users.value.find((user) => user.id === comment.user?.id),
            }));

          return {
            ...post,
            comments: postComments,
            user,
          };
        })
    );
  });

  // create new post object and push to posts array
  function addPost(title: string, body: string) {
    if (!title || !body || !currentUser.value) return;

    const post: Post = {
      userId: currentUser.value.id,
      id: posts.value.length + 1,
      title,
      body,
    };

    posts.value = [...posts.value, post];
  }

  // filter out post by id in posts array
  function deletePost(postId: number) {
    if (!postId || currentUserOwnsPost(postId)) return;

    posts.value = posts.value.filter((post) => post.id !== postId);
  }

  // find post by id and reassign with new data
  function editPost(postId: number, data: Pick<Post, "title" | "body">) {
    if (!postId || !data || currentUserOwnsPost(postId)) return;

    const postIndex = posts.value.findIndex((post) => post.id === postId);

    posts.value[postIndex] = {
      ...posts.value[postIndex],
      ...data,
    };
  }

  // create new comment object and push to comments array
  function addComment(title: string, body: string, postId: number) {
    if (!title || !body || !postId) return;

    const comment: Comment = {
      postId,
      id: comments.value.length + 1,
      name: title,
      email: currentUser.value.email,
      body,
      user: currentUser.value,
    };

    comments.value = [...comments.value, comment];
  }

  // filter out comment by id in comments array
  function deleteComment(commentId: number) {
    if (!commentId || currentUserOwnsComment(commentId)) return;

    comments.value = comments.value.filter((comment) => comment.id !== commentId);
  }

  // find comment by id and reassign with new data
  function editComment(commentId: number, data: Pick<Comment, "body" | "name">) {
    if (!commentId || !data || currentUserOwnsComment(commentId)) {
      return;
    }

    const commentIndex = comments.value.findIndex((comment) => comment.id === commentId);

    comments.value[commentIndex] = {
      ...comments.value[commentIndex],
      ...data,
    };
  }

  // filter setter functions
  function setFilterSort(sort: FilterSort) {
    filter.value.sort = sort;
  }

  function setFilterSearch(search: string) {
    filter.value.search = search;
  }

  function setFilterUser(user: User) {
    filter.value.user = user;
  }

  // reset filter to default values const
  function resetFilters() {
    filter.value = { ...DEFAULT_FILTERS };
  }

  // using basic login logic here as no backend is used
  function login(name: string) {
    const user = users.value.find((user) => user.name === name.trim());

    if (user) {
      currentUser.value = user;
    } else {
      currentUser.value = _createUser(name);
    }

    router.push("/feed");
  }

  // reset filter and current user then redirect to login
  function logout() {
    resetFilters();

    currentUser.value = null;

    router.push("/login");
  }
  // check if current user owns post by postId
  function currentUserOwnsPost(postId: number) {
    return currentUser.value.id !== posts.value.find((post) => post.id === postId)?.userId;
  }

  // check if current user owns comment by commentId
  function currentUserOwnsComment(commentId: number) {
    return currentUser.value.id !== comments.value.find((comment) => comment.id === commentId)?.user?.id;
  }

  // internal function to generate user details and add to users array
  function _createUser(name: string) {
    const username = toUsername(name);

    const user: User = {
      id: users.value.length + 1,
      name: name.trim(),
      username,
      email: username + "@example.com",
      photo: AVATAR_URL + username,
    };

    users.value = [...users.value, user];

    return user;
  }

  // internal function to setup users with normalized username and photo
  async function _setupUsers() {
    const users = await getUsers();

    if (!users) {
      return [];
    }

    return users.map((user) => ({
      ...user,
      username: toUsername(user.name),
      photo: AVATAR_URL + toUsername(user.name),
    }));
  }

  // internal function to get random user to use for comment ownership
  function _getRandomUser() {
    const randomIndex = Math.floor(Math.random() * users.value.length);

    return users.value[randomIndex];
  }

  // internal function to setup posts with random user id
  async function _setupPosts(shuffle: boolean) {
    const posts = await getPosts();

    if (!posts) {
      return [];
    }

    return posts.map((post) => {
      const user = shuffle ? _getRandomUser() : { id: post.userId };

      return {
        ...post,
        userId: user.id,
      };
    });
  }

  // internal function to setup comments with user data
  async function _setupComments() {
    const comments = await getComments();

    if (!comments) {
      return [];
    }

    return comments.map((comment) => {
      const user = _getRandomUser();

      return {
        ...comment,
        user,
      };
    });
  }

  // gather data and store initially
  // shuffle to control post ownership randomisation (testing data shouldn't be shuffled)
  async function init(shuffle = true) {
    if (initialised.value) {
      return;
    }

    users.value = await _setupUsers();
    posts.value = await _setupPosts(shuffle);
    comments.value = await _setupComments();

    initialised.value = true;
  }

  return {
    // state
    initialised,
    posts,
    comments,
    users,
    currentUser,
    filter,

    // getters
    postItems,
    isLoggedIn,

    // auth actions
    login,
    logout,

    // filter actions
    setFilterSort,
    setFilterSearch,
    setFilterUser,
    resetFilters,

    // post actions
    addPost,
    deletePost,
    editPost,

    // comment actions
    addComment,
    deleteComment,
    editComment,

    // helper actions
    currentUserOwnsPost,
    currentUserOwnsComment,

    // initialize
    init,
  };
});
