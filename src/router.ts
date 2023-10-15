import { createRouter, createWebHistory } from "vue-router";
import CreateUserPage from "@/pages/CreateUserPage.vue";
import FeedPage from "@/pages/FeedPage.vue";
import PostPage from "@/pages/PostPage.vue";

export const ROUTES = [
  {
    path: "/create-user",
    component: CreateUserPage,
  },
  {
    path: "/feed",
    component: FeedPage,
  },
  {
    path: "/post/:id",
    component: PostPage,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/create-user",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: ROUTES,
});

export default router;
