<script setup lang="ts">
import { computed, ref } from "vue";
import { MoreVerticalIcon } from "lucide-vue-next";
import { useStore } from "@/store";
import DeleteCommentModal from "@/components/DeleteCommentModal.vue";
import EditCommentModal from "@/components/EditCommentModal.vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";

import type { Comment } from "@/types/comment";

const props = defineProps<{
  data: Comment;
  noMenu?: boolean;
  noAvatar?: boolean;
}>();

const store = useStore();

const showEditModal = ref(false);
const showDeleteModal = ref(false);

const isUsersComment = computed(() => props.data.user?.id === store.currentUser?.id);
const canShowMenu = computed(() => !props.noMenu && isUsersComment.value);

function handleEditComment(name: string, body: string) {
  if (!props.data.id) return;

  store.editComment(props.data.id, {
    name,
    body,
  });

  showEditModal.value = false;
}
</script>

<template>
  <li class="relative flex gap-x-4 group">
    <div v-if="!props.noAvatar" class="absolute left-0 top-0 flex w-6 justify-center -bottom-6 group-last-of-type:h-5">
      <div class="w-px bg-zinc-200"></div>
    </div>
    <UserAvatar v-if="!props.noAvatar" :src="props.data.user?.photo" class="h-6 w-6 flex-none z-10" />
    <div class="flex-auto rounded-md p-3 ring-1 ring-inset ring-zinc-200 bg-white">
      <div class="flex justify-between gap-x-4">
        <div class="py-0.5 text-xs leading-5 text-zinc-500">
          <span class="font-medium text-zinc-900">{{ props.data.user?.name }}</span> commented
        </div>
        <div class="flex items-center">
          <time datetime="2023-01-23T15:56" class="flex-none py-0.5 text-xs leading-5 text-zinc-500">3d ago</time>
          <DropdownMenu
            v-if="canShowMenu"
            :id="`${data.postId}-${data.id}-more-menu`"
            direction="left"
            :options="[
              {
                name: 'Edit comment',
                onClick: () => {
                  showEditModal = true;
                },
              },
              {
                name: 'Delete comment',
                onClick: () => {
                  showDeleteModal = true;
                },
              },
            ]"
          >
            <MoreVerticalIcon
              class="w-4 h-4 p-1 box-content bg-transparent stroke-zinc-600 hover:stroke-zinc-900 hover:bg-zinc-100 rounded ml-2"
            />
          </DropdownMenu>
        </div>
      </div>
      <hr class="my-2" />
      <p class="text-xs leading-6 text-zinc-800 font-bold">{{ props.data.name }}</p>
      <p class="text-sm leading-6 text-zinc-500">{{ props.data.body }}</p>
    </div>

    <EditCommentModal
      v-if="showEditModal"
      :show="showEditModal"
      :comment="props.data"
      @submit="handleEditComment"
      @close="showEditModal = false"
    />

    <DeleteCommentModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :comment="props.data"
      @close="showDeleteModal = false"
    />
  </li>
</template>
