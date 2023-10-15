<script setup lang="ts">
import { useStore } from "@/store";
import AuthLayout from "@/layouts/AuthLayout.vue";
import PostListing from "@/components/PostListing.vue";
import FilterBar from "@/components/FilterBar.vue";

const store = useStore();
</script>

<template>
  <AuthLayout>
    <div class="flex flex-col items-center justify-center">
      <div class="w-full">
        <h3 class="text-2xl font-bold text-zinc-900 sm:text-4xl font-nunito text-left mb-2">Your feed</h3>
        <p class="mt-0 mb-4">
          Welcome back, <span class="font-bold"> {{ store.currentUser?.name }}</span> 👋
        </p>

        <FilterBar class="w-full basis-full mt-4" />

        <PostListing class="mt-2 w-full" />
      </div>
    </div>
  </AuthLayout>
</template>
