import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, vi, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { useStore } from "@/store";
import { MOCK_COMMENTS, MOCK_POSTS, MOCK_USERS, MOCK_USERS_POST_INIT } from "@/constants/store";
import { FilterSort } from "@/types/filter";

import type { User } from "@/types/user";

// must be defined in this file to use expect.any
export const MOCK_POST_ITEMS = [
  {
    userId: expect.any(Number),
    id: 1,
    title: "Post one",
    body: "Post one body",
    user: expect.any(Object),
    comments: expect.arrayContaining([
      {
        postId: expect.any(Number),
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        body: expect.any(String),
        user: expect.any(Object),
      },
    ]),
  },
  {
    userId: expect.any(Number),
    id: 2,
    title: "Post two",
    body: "Post two body",
    user: expect.any(Object),
    comments: expect.arrayContaining([
      {
        postId: expect.any(Number),
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        body: expect.any(String),
        user: expect.any(Object),
      },
    ]),
  },
];

// mock api calls
const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/users", (_, res, ctx) => {
    return res(ctx.json(MOCK_USERS));
  }),

  rest.get("https://jsonplaceholder.typicode.com/posts", (_, res, ctx) => {
    return res(ctx.json(MOCK_POSTS));
  }),

  rest.get("https://jsonplaceholder.typicode.com/comments", (_, res, ctx) => {
    return res(ctx.json(MOCK_COMMENTS));
  }),
);

// mock router composable
vi.mock("vue-router", async () => {
  const actual = (await vi.importActual("vue-router")) as {
    useRouter: () => {
      push: (path: string) => void;
    };
  };

  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
    }),
  };
});

describe("store", () => {
  // setup server for mocks
  beforeAll(() => {
    server.listen();
  });

  // setup pinia
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // reset server
  afterEach(() => {
    server.resetHandlers();
  });

  // close server
  afterAll(() => server.close());

  it("initializes correctly", async () => {
    const store = useStore();

    // define mock comments result
    const comments = MOCK_COMMENTS.map((comment) => expect.objectContaining({ ...comment, user: expect.any(Object) }));

    // initialize store
    await store.init(false);

    // check store is initialized correctly
    expect(store.users).toEqual(MOCK_USERS_POST_INIT);
    expect(store.posts).toEqual(MOCK_POSTS);
    expect(store.comments).toEqual(comments);
  });

  it("computes isLoggedIn correctly", async () => {
    const store = useStore();

    await store.init(false);

    expect(store.isLoggedIn).toBe(false);

    await store.login("person");

    expect(store.isLoggedIn).toBe(true);
  });

  it("computes postItems correctly at init", async () => {
    const store = useStore();

    await store.init(false);

    expect(store.postItems).toEqual(MOCK_POST_ITEMS.sort((a, b) => b.id - a.id));
  });

  it("adds a new post", async () => {
    const store = useStore();

    await store.init(false);

    const postData = {
      title: "New Post",
      body: "New post body",
    };

    const postResult = {
      userId: 3,
      id: 3,
      title: "New Post",
      body: "New post body",
    };

    // login to populate currentUser
    await store.login("person");

    // add post
    await store.addPost(postData.title, postData.body);

    // check post was added
    expect(store.posts).toEqual([...MOCK_POSTS, postResult]);
  });

  it("deletes a post", async () => {
    const store = useStore();

    await store.init(false);

    // login to populate currentUser
    await store.login("person");

    // add post
    await store.addPost("New Post", "New post body");

    const post = store.posts.find((post) => post.id === 3);

    // check post exists
    expect(store.posts.length).toBe(3);
    expect(post).toBeDefined();

    // delete post
    await store.deletePost(3);

    // check post was deleted
    expect(store.posts.length).toBe(2);
    expect(store.posts.find((post) => post.id === 3)).toBeUndefined();
  });

  it("does not delete a post if not owned", async () => {
    const store = useStore();

    await store.init(false);

    // login to populate currentUser
    await store.login("person");

    // add post
    await store.addPost("New Post", "New post body");

    const post = store.posts.find((post) => post.id === 3);

    // check post exists
    expect(store.posts.length).toBe(3);
    expect(post).toBeDefined();

    // login to populate currentUser
    await store.login("person2");

    // delete post
    await store.deletePost(3);

    // check post was not deleted
    expect(store.posts.length).toBe(3);
    expect(store.posts.find((post) => post.id === 3)).toBeDefined();
  });

  it("edits a post", async () => {
    const store = useStore();

    await store.init(false);

    // login to populate currentUser
    await store.login("person");

    // add post
    await store.addPost("New Post", "New post body");

    // edit post
    await store.editPost(3, {
      title: "Edited Post",
      body: "Edited post body",
    });

    // check post was edited
    expect(store.posts[2].title).toBe("Edited Post");
    expect(store.posts[2].body).toBe("Edited post body");
  });

  it("does not edit a post if not owned", async () => {
    const store = useStore();

    await store.init(false);

    // login to populate currentUser
    await store.login("person");

    // add post
    await store.addPost("New Post", "New post body");

    // login to populate currentUser
    await store.login("person2");

    // edit post
    await store.editPost(3, {
      title: "Edited Post",
      body: "Edited post body",
    });

    // check post was not edited
    expect(store.posts[2].title).toBe("New Post");
    expect(store.posts[2].body).toBe("New post body");
  });

  it("adds a new comment", async () => {
    const store = useStore();

    await store.init(false);

    const commentData = {
      title: "New Comment",
      body: "New comment body",
    };

    const commentResult = {
      postId: 1,
      id: 3,
      name: "New Comment",
      email: "person@example.com",
      body: "New comment body",
      user: expect.any(Object),
    };

    // login to populate currentUser
    await store.login("person");

    // add comment
    await store.addComment(commentData.title, commentData.body, 1);

    // check comment was added
    expect(store.comments.length).toBe(3);
    expect(store.comments[2]).toEqual(commentResult);
  });

  it("deletes a comment", async () => {
    const store = useStore();

    await store.init(false);

    // login to populate currentUser
    await store.login("person");

    // add comment
    await store.addComment("New Comment", "New comment body", 1);

    const comment = store.comments.find((comment) => comment.id === 3);

    // check comment exists
    expect(store.comments.length).toBe(3);
    expect(comment).toBeDefined();

    // delete comment
    await store.deleteComment(3);

    // check comment was deleted
    expect(store.comments.length).toBe(2);
    expect(store.comments.find((comment) => comment.id === 3)).toBeUndefined();
  });

  it("does not delete a comment if not owned", async () => {
    const store = useStore();

    await store.init(false);

    // login to populate currentUser
    await store.login("person");

    // add comment
    await store.addComment("New Comment", "New comment body", 1);

    const comment = store.comments.find((comment) => comment.id === 3);

    // check comment exists
    expect(store.comments.length).toBe(3);
    expect(comment).toBeDefined();

    // login to populate currentUser
    await store.login("person2");

    // delete comment
    await store.deleteComment(3);

    // check comment was not deleted
    expect(store.comments.length).toBe(3);
    expect(store.comments.find((comment) => comment.id === 3)).toBeDefined();
  });

  it("edits a comment", async () => {
    const store = useStore();

    await store.init(false);

    // login to populate currentUser
    await store.login("person");

    // add comment
    await store.addComment("New Comment", "New comment body", 1);

    // edit comment
    await store.editComment(3, {
      name: "Edited Comment",
      body: "Edited comment body",
    });

    // check comment was edited
    expect(store.comments[2].name).toBe("Edited Comment");
    expect(store.comments[2].body).toBe("Edited comment body");
  });

  it("does not edit a comment if not owned", async () => {
    const store = useStore();

    await store.init(false);

    // login to populate currentUser
    await store.login("person");

    // add comment
    await store.addComment("New Comment", "New comment body", 1);

    // login to populate currentUser
    await store.login("person2");

    // edit comment
    await store.editComment(3, {
      name: "Edited Comment",
      body: "Edited comment body",
    });

    // check comment was not edited
    expect(store.comments[2].name).toBe("New Comment");
    expect(store.comments[2].body).toBe("New comment body");
  });

  it("sets filter sort", async () => {
    const store = useStore();

    await store.init(false);

    store.setFilterSort(FilterSort.ASC);

    expect(store.filter.sort).toBe(FilterSort.ASC);
    expect(store.postItems).toEqual(MOCK_POST_ITEMS.sort((a, b) => a.id - b.id));

    store.setFilterSort(FilterSort.DESC);

    expect(store.filter.sort).toBe(FilterSort.DESC);
    expect(store.postItems).toEqual(MOCK_POST_ITEMS.sort((a, b) => b.id - a.id));
  });

  it("sets filter search and updates postItems", async () => {
    const store = useStore();

    await store.init(false);

    store.setFilterSearch("Post one");

    expect(store.filter.search).toBe("Post one");
    expect(store.postItems.length).toEqual(1);
    expect(store.postItems[0].title).toEqual("Post one");
  });

  it("sets filter search, then clears it and updates postItems accordingly", async () => {
    const store = useStore();

    await store.init(false);

    store.setFilterSearch("Post one");

    expect(store.filter.search).toBe("Post one");
    expect(store.postItems.length).toEqual(1);
    expect(store.postItems[0].title).toEqual("Post one");

    store.setFilterSearch("");

    expect(store.filter.search).toBe("");
    expect(store.postItems.length).toEqual(2);
  });

  it("sets filter user and updates postItems", async () => {
    const store = useStore();

    await store.init(false);

    store.setFilterUser(MOCK_USERS[0]);

    expect(store.filter.user).toEqual(MOCK_USERS[0]);
    expect(store.postItems.length).toEqual(1);
    expect(store.postItems[0].user?.id).toEqual(MOCK_USERS[0].id);
  });

  it("sets filter user, then clears it and updates postItems accordingly", async () => {
    const store = useStore();

    await store.init(false);

    store.setFilterUser(MOCK_USERS[0]);

    expect(store.filter.user).toEqual(MOCK_USERS[0]);
    expect(store.postItems.length).toEqual(1);
    expect(store.postItems[0].user?.id).toEqual(MOCK_USERS[0].id);

    store.setFilterUser({} as User);

    expect(store.filter.user).toEqual({});
    expect(store.postItems).toEqual(MOCK_POST_ITEMS);
  });

  it("resets filters", async () => {
    const store = useStore();

    await store.init(false);

    store.setFilterSort(FilterSort.ASC);
    store.setFilterSearch("Post one");
    store.setFilterUser(MOCK_USERS[0]);

    expect(store.filter.sort).toBe(FilterSort.ASC);
    expect(store.filter.search).toBe("Post one");
    expect(store.filter.user).toEqual(MOCK_USERS[0]);

    store.resetFilters();

    expect(store.filter.sort).toBe(FilterSort.DESC);
    expect(store.filter.search).toBe("");
    expect(store.filter.user).toEqual({});
  });

  it("lets the user log in", async () => {
    const store = useStore();

    await store.init(false);

    await store.login("person");

    expect(store.currentUser).toEqual(expect.objectContaining({ name: "person", id: 3 }));
  });

  it("lets the user log out", async () => {
    const store = useStore();

    await store.init(false);

    await store.login("person");

    expect(store.currentUser).toEqual(expect.objectContaining({ name: "person", id: 3 }));

    store.logout();

    expect(store.currentUser).toBeNull();
  });

  it("does not re-initialize if already initialized", async () => {
    const store = useStore();

    await store.init(false);

    expect(store.initialised).toBe(true);
    expect(store.posts.length).toBe(2);

    // add post
    await store.addPost("New Post", "New post body");
    expect(store.posts.length).toBe(3);

    await store.init(false);

    expect(store.initialised).toBe(true);
    expect(store.posts.length).toBe(3);
  });

  it("can initiate empty with network errors", async () => {
    const store = useStore();

    // mock errors
    server.use(
      rest.get("https://jsonplaceholder.typicode.com/users", (_, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    server.use(
      rest.get("https://jsonplaceholder.typicode.com/posts", (_, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    server.use(
      rest.get("https://jsonplaceholder.typicode.com/comments", (_, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    await store.init(false);

    expect(store.users).toEqual([]);
    expect(store.posts).toEqual([]);
    expect(store.comments).toEqual([]);
  });
});
