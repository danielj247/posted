<script setup lang="ts">
import { computed, defineProps, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import { MessageSquareIcon, MoreVerticalIcon } from "lucide-vue-next";
import { useStore } from "@/store";
import useLoadMore from "@/composables/useLoadMore";
import CommentListing from "@/components/CommentListing.vue";
import CommentItem from "@/components/CommentItem.vue";
import CommentPostInput from "@/components/CommentPostInput.vue";
import EditPostModal from "@/components/EditPostModal.vue";
import DeletePostModal from "@/components/DeletePostModal.vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";
import SecondaryButton from "@/components/ui/SecondaryButton.vue";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";

import type { PostItem } from "@/types/post";

const props = defineProps<{
  data: PostItem;
  noReply?: boolean;
  noMenu?: boolean;
}>();

const store = useStore();
const router = useRouter();

const showComments = ref(false);
const commentItems = ref<HTMLLIElement[]>([]);
const postItem = ref<HTMLLIElement>();
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const isUsersPost = computed(() => store.currentUser?.id === props.data.user?.id);
const items = computed(() => props.data.comments || []);
const { viewableItems: comments, increment, finished, loadAll } = useLoadMore(items, 3);

function toggleComments() {
  showComments.value = !showComments.value;
}

async function handleCommentSubmit(title: string, body: string) {
  store.addComment(title, body, props.data.id);

  await nextTick();

  loadAll();

  await nextTick();

  scrollToBottomOfComments();
}

async function handleLoadAll() {
  loadAll();

  await nextTick();

  scrollToBottomOfComments();
}

function scrollToBottomOfComments() {
  if (!postItem.value) return;

  const { bottom } = postItem.value.getBoundingClientRect();

  const y = window.scrollY + bottom - window.innerHeight / 2;

  if (y !== window.scrollY) {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

function handleCopyLink() {
  navigator.clipboard.writeText(`${window.location.origin}/post/${props.data.id}`);
}

function handleEditPost(title: string, body: string) {
  if (!title || !body) return;

  store.editPost(props.data.id, { title, body });

  showEditModal.value = false;
}

function handleDeletePost() {
  if (!props.data.id) return;

  store.deletePost(props.data.id);

  showDeleteModal.value = false;
}
</script>

<template>
  <li class="relative" ref="postItem">
    <div
      class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 sm:flex-nowrap rounded-md bg-white px-6 py-4 transition-all shadow hover:shadow-md cursor-pointer"
    >
      <div class="flex justify-between">
        <UserAvatar :src="props.data?.user?.photo || store.currentUser?.photo" class="h-10 w-10 mr-4" />
        <div>
          <div class="flex items-center gap-x-2 text-xs leading-5 text-zinc-500">
            <p>
              {{ props.data?.user?.name }}
            </p>
          </div>
          <p class="text-sm font-semibold leading-6 text-zinc-900 mt-1">
            {{ props.data.title }}
          </p>
          <p class="text-sm text-zinc-500">{{ props.data.body }}</p>
        </div>
      </div>
      <div class="flex items-center">
        <button
          v-if="props.data.comments"
          :id="`${props.data.id}-comments-btn`"
          @click.prevent="toggleComments"
          class="flex w-full flex-none justify-between gap-x-8 sm:w-auto h-5 p-2 box-content bg-transparent stroke-zinc-600 hover:stroke-zinc-900 hover:bg-zinc-100 rounded"
        >
          <div class="flex gap-x-2.5">
            <dt>
              <span class="sr-only">Total comments</span>
              <MessageSquareIcon class="stroke-zinc-600" />
            </dt>
            <dd class="text-sm leading-6 text-zinc-900">{{ props.data?.comments?.length }}</dd>
          </div>
        </button>
        <DropdownMenu
          v-if="!props.noMenu"
          :id="`${props.data.id}-more-menu`"
          direction="left"
          :options="[
            {
              name: 'View post',
              onClick: () => {
                router.push(`/post/${props.data.id}`);
              },
            },
            {
              name: 'Copy link',
              onClick: () => handleCopyLink,
            },
            ...(isUsersPost
              ? [
                  {
                    name: 'Edit post',
                    onClick: () => {
                      showEditModal = true;
                    },
                  },
                  {
                    name: 'Delete post',
                    onClick: () => {
                      showDeleteModal = true;
                    },
                  },
                ]
              : []),
          ]"
        >
          <MoreVerticalIcon
            class="w-5 h-5 p-2 box-content bg-transparent stroke-zinc-600 hover:stroke-zinc-900 hover:bg-zinc-100 rounded"
          />
        </DropdownMenu>
      </div>
    </div>
    <Transition name="list-vert">
      <div class="p-4 pb-10 w-full relative" v-if="showComments">
        <CommentListing v-if="props.data.comments">
          <CommentItem v-for="comment in comments" :key="comment.id" :data="comment" ref="commentItems" />
          <li class="flex justify-center gap-x-4" v-show="!finished">
            <SecondaryButton @click="increment" class="mt-5">Load more comments</SecondaryButton>
            <SecondaryButton @click="handleLoadAll" class="mt-5">Go to bottom</SecondaryButton>
          </li>
          <CommentPostInput
            v-if="!props.noReply"
            :post-id="props.data.id"
            :extended="!finished"
            @submit="handleCommentSubmit"
            class="w-full"
          />
        </CommentListing>

        <!-- Or we can get the CommentListing component to get it from the store via the post ID for us -->

        <!-- <CommentListing v-if="props.data.comments" :post-id="props.data.id">
          <template #default="{ comments }">
            <CommentItem v-for="comment in comments" :key="comment.id" :data="comment" />
            <CommentPostInput
              v-if="!props.noReply"
              :post-id="props.data.id"
              :extended="!finished"
              @submit="handleCommentSubmit"
              class="w-full"
            />
          </template>
        </CommentListing> -->
      </div>
    </Transition>

    <EditPostModal :post="props.data" :show="showEditModal" @submit="handleEditPost" @close="showEditModal = false" />

    <DeletePostModal
      :post="props.data"
      :show="showDeleteModal"
      @submit="handleDeletePost"
      @close="showDeleteModal = false"
    />
  </li>
</template>
