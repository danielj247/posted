<script setup lang="ts">
import { useStore } from "@/store";
import CommentInput from "@/components/CommentInput.vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";

const props = defineProps<{
  postId?: number;
  extended?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", title: string, body: string): void;
}>();

const store = useStore();

function handleSubmit(title: string, body: string) {
  emit("submit", title, body);
}
</script>

<template>
  <li class="relative flex gap-x-4 group">
    <div class="absolute left-0 flex w-6 justify-center group-last-of-type:h-5" :class="props.extended && '-top-24'">
      <div class="w-px bg-zinc-200" :class="props.extended && 'h-24 bottom-0'"></div>
    </div>
    <UserAvatar :src="store.currentUser.photo" class="h-6 w-6 z-10" />
    <div class="flex-auto rounded-md p-3 ring-1 ring-inset ring-zinc-200 bg-white">
      <CommentInput :id-prefix="props.postId + '-comment'" class="w-full" @submit="handleSubmit" hide-preview-avatar />
    </div>
  </li>
</template>
