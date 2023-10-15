<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/store";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";
import NewPostModal from "@/components/NewPostModal.vue";

const store = useStore();

const open = ref(false);

function handleSubmit(title: string, body: string) {
  store.addPost(title, body);

  open.value = false;
}
</script>

<template>
  <PrimaryButton id="new-post-btn" @click="open = true">New post</PrimaryButton>
  <NewPostModal :show="open" @close="open = false" @submit="handleSubmit" />
</template>
