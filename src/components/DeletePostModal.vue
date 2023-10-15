<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from "@headlessui/vue";
import { useStore } from "@/store";
import PostItem from "@/components/PostItem.vue";
import DangerButton from "@/components/ui/DangerButton.vue";

import type { PostItem as PostItemType } from "@/types/post";

const props = defineProps<{
  show: boolean;
  post: PostItemType;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const store = useStore();

function handleDelete() {
  if (!props.post.id) return;

  store.deletePost(props.post.id);

  emit("close");
}
</script>

<template>
  <TransitionRoot as="template" :show="props.show">
    <Dialog as="div" class="relative z-10" :open="props.show" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="w-full">
                <h3 class="text-2xl font-bold text-zinc-900 sm:text-4xl font-nunito text-left mb-2 flex items-center">
                  Warning
                </h3>

                <p class="mb-5 font-semibold">Are you sure you want to delete this post?</p>

                <ul>
                  <PostItem :data="props.post" no-menu no-reply />
                </ul>

                <p class="mt-5 text-sm text-center">This action cannot be undone.</p>
                <DangerButton class="w-full mt-1" id="delete-modal-btn" @click="handleDelete"> Delete </DangerButton>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
