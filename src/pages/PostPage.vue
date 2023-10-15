<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ClockIcon, ShareIcon, MoreVerticalIcon, ArrowLeftIcon } from "lucide-vue-next";
import { useStore } from "@/store";
import AuthLayout from "@/layouts/AuthLayout.vue";
import CommentListing from "@/components/CommentListing.vue";
import CommentItem from "@/components/CommentItem.vue";
import CommentPostInput from "@/components/CommentPostInput.vue";
import EditPostModal from "@/components/EditPostModal.vue";
import DeletePostModal from "@/components/DeletePostModal.vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();

const post = computed(() => store.postItems.find((post) => post.id === Number(route.params.id)));

const showEditModal = ref(false);
const showDeleteModal = ref(false);

const hasPermission = store.currentUser?.id === post.value?.user?.id;

function handleCommentSubmit(title: string, body: string) {
  if (!post.value) return;

  store.addComment(title, body, post.value?.id);
}

function handleCopyLink() {
  if (!post.value) return;

  navigator.clipboard.writeText(`${window.location.origin}/post/${post.value?.id}`);
}

function handleEditPost(title: string, body: string) {
  if (!post.value) return;

  store.editPost(post.value?.id, {
    title,
    body,
  });

  showEditModal.value = false;
}

function handleDeletePost() {
  if (!post.value) return;

  store.deletePost(post.value?.id);

  showDeleteModal.value = false;
}

function handleDeleteClose() {
  router.push("/feed");
}

onMounted(() => {
  if (!post.value) {
    router.push("/feed");
  }
});
</script>

<template>
  <AuthLayout>
    <RouterLink to="/" class="group block mb-4" id="back-to-feed-btn">
      <ArrowLeftIcon class="w-5 inline mr-1 mb-1" /> <span class="group-hover:underline text-sm">Go back to feed</span>
    </RouterLink>
    <div
      v-if="post"
      class="flex flex-col flex-wrap items-start justify-between sm:flex-nowrap rounded-md bg-white px-6 py-4 transition-all shadow"
    >
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center">
          <UserAvatar :src="post?.user?.photo" class="w-12 h-12" />
          <div class="ml-4">
            <p class="font-semibold">{{ post?.user?.name }}</p>
            <p class="text-zinc-400 text-xs"><ClockIcon class="w-3 inline mr-0.5" /> 3d ago</p>
          </div>
        </div>

        <div class="flex gap-x-1">
          <DropdownMenu
            id="share-menu"
            direction="left"
            :options="[
              {
                name: 'Copy link',
                onClick: handleCopyLink,
              },
            ]"
          >
            <ShareIcon
              class="w-5 h-5 p-2 box-content bg-transparent stroke-zinc-600 hover:stroke-zinc-900 hover:bg-zinc-100 rounded"
            />
          </DropdownMenu>
          <DropdownMenu
            v-if="hasPermission"
            id="more-menu"
            direction="left"
            :options="[
              {
                name: 'Copy link',
                onClick: handleCopyLink,
              },
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
            ]"
          >
            <MoreVerticalIcon
              class="w-5 h-5 p-2 box-content bg-transparent stroke-zinc-600 hover:stroke-zinc-900 hover:bg-zinc-100 rounded"
            />
          </DropdownMenu>
        </div>
      </div>
      <p class="text-zinc-800 text-lg font-bold mt-3">{{ post?.title }}</p>
      <p class="text-zinc-500 text-sm mt-1">{{ post?.body }}</p>
    </div>
    <CommentListing :post-id="post?.id" class="mt-10 md:px-10">
      <template #default="{ comments }">
        <CommentItem v-for="comment in comments" :key="comment.id" :data="comment" />
        <CommentPostInput :post-id="post?.id" @submit="handleCommentSubmit" />
      </template>
    </CommentListing>
  </AuthLayout>

  <EditPostModal
    v-if="post"
    :post="post"
    :show="showEditModal"
    @submit="handleEditPost"
    @close="showEditModal = false"
  />

  <DeletePostModal
    v-if="post"
    :post="post"
    :show="showDeleteModal"
    @submit="handleDeletePost"
    @close="handleDeleteClose"
  />
</template>
