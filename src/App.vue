<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

router.beforeEach((to, _, next) => {
  const authedRoutes = ["/feed", "/post"];

  if (to.path === "/create-user" && store.isLoggedIn) {
    next({ path: "/feed" });
    return;
  }

  if (authedRoutes.includes(to.path) && !store.isLoggedIn) {
    next({ path: "/create-user" });
    return;
  }

  next();
});

onMounted(async () => {
  await store.init();
});
</script>

<template>
  <Suspense>
    <main class="max-w-5xl mx-auto px-4 box-border">
      <RouterView />
    </main>
  </Suspense>
</template>
