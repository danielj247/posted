<script setup lang="ts">
import { computed, defineProps } from "vue";
import { useStore } from "@/store";

import type { Comment } from "@/types/comment";

const props = defineProps<{
  postId?: number;
  comments?: Comment[];
}>();

const store = useStore();

const postComments = computed(() => {
  if (props.comments) return props.comments;

  return store.comments.filter((comment) => comment.postId === props.postId);
});
</script>

<template>
  <TransitionGroup tag="ul" name="list" role="list" class="space-y-6">
    <slot :comments="postComments" />
  </TransitionGroup>
</template>
