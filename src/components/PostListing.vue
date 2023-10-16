<script setup lang="ts">
import { computed } from "vue";
import { SearchXIcon } from "lucide-vue-next";
import { useStore } from "@/store";
import useLoadMore from "@/composables/useLoadMore";
import PostItem from "@/components/PostItem.vue";
import SecondaryButton from "@/components/ui/SecondaryButton.vue";

const store = useStore();

const items = computed(() => store.postItems);
const { viewableItems, increment, finished } = useLoadMore(items, 5);
</script>

<template>
  <TransitionGroup
    v-if="store.postItems.length > 0"
    tag="ul"
    name="list"
    role="list"
    class="divide-y divide-zinc-100 space-y-4"
  >
    <PostItem v-for="post in viewableItems" :key="post.id" :data="post" />
    <div class="flex" v-if="!finished">
      <SecondaryButton @click="increment" class="mt-5 mx-auto">Load more posts</SecondaryButton>
    </div>
  </TransitionGroup>
  <div v-else class="text-center">
    <p><SearchXIcon class="mr-1 -mt-0.5 inline" /> No posts found</p>

    <SecondaryButton class="mt-5" @click="store.resetFilters">Reset filters</SecondaryButton>
  </div>
</template>
