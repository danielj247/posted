<script setup lang="ts">
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import PostedLogo from "@/components/PostedLogo.vue";
import NewPostButton from "@/components/NewPostButton.vue";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";

const store = useStore();
const router = useRouter();
</script>

<template>
  <header class="flex justify-between items-end">
    <RouterLink to="/" class="w-28 h-16 flex">
      <PostedLogo class="scale-[0.5] origin-left" />
    </RouterLink>

    <div class="flex items-center">
      <NewPostButton />

      <DropdownMenu
        id="user-menu"
        class="ml-4"
        direction="left"
        :options="[
          {
            name: 'View feed',
            onClick: () => router.push('/'),
          },
          {
            name: 'Sign out',
            onClick: () => store.logout(),
          },
        ]"
      >
        <UserAvatar
          class="h-10 w-10 rounded-full border-[3px] box-content border-zinc-900/90"
          :src="store.currentUser?.photo"
        />
      </DropdownMenu>
    </div>
  </header>
</template>
