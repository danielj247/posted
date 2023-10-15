<script setup lang="ts">
import { computed, ref } from "vue";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import { useStore } from "@/store";
import CommentItem from "@/components/CommentItem.vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";
import TextInput from "@/components/ui/TextInput.vue";
import TextArea from "@/components/ui/TextArea.vue";

import type { Comment } from "@/types/comment";

const props = defineProps<{
  idPrefix?: string;
  comment?: Comment;
  hidePreviewAvatar?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", title: string, body: string): void;
}>();

const store = useStore();

const name = ref(props.comment?.name || "");
const body = ref(props.comment?.body || "");

const prefix = computed(() => (props.idPrefix ? props.idPrefix + "-" : ""));

function handleSubmit() {
  if (!name.value || !body.value) return;

  emit("submit", name.value, body.value);

  name.value = "";
  body.value = "";
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <TabGroup>
      <TabList class="flex items-center">
        <Tab as="template" v-slot="{ selected }">
          <button
            :class="[
              selected
                ? 'bg-zinc-900 text-white hover:bg-zinc-900/80'
                : 'bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
              'rounded-md border border-transparent px-3 py-1.5 text-sm font-medium',
            ]"
          >
            Write
          </button>
        </Tab>
        <Tab as="template" v-slot="{ selected }">
          <button
            :class="[
              selected
                ? 'bg-zinc-900 text-white hover:bg-zinc-900/80'
                : 'bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
              'ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium',
            ]"
          >
            Preview
          </button>
        </Tab>
      </TabList>
      <TabPanels class="mt-2">
        <TabPanel class="-m-0.5 rounded-lg p-0.5">
          <TextInput
            :id="prefix + 'comment-title'"
            v-model="name"
            class="w-full"
            label="Comment title"
            label-hidden
            auto-complete="off"
            placeholder="Add a title to your comment"
          />
          <TextArea
            :rows="5"
            v-model="body"
            label="Comment body"
            label-hidden
            name="body"
            :id="prefix + 'comment-body'"
            class="mt-2"
            input-class="min-h-[120px]"
            placeholder="Tell everyone what your thinking about!"
          />
        </TabPanel>
        <TabPanel class="-m-0.5 rounded-lg p-0.5">
          <div class="text-sm leading-5 text-zinc-800">
            <ul>
              <CommentItem
                :data="{
                  id: -1,
                  postId: -1,
                  email: '',
                  user: store.currentUser,
                  name,
                  body,
                }"
                no-menu
                :no-avatar="props.hidePreviewAvatar || false"
              />
            </ul>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
    <div class="mt-2 flex justify-end">
      <PrimaryButton type="submit" class="w-32" :disabled="!name || !body" :id="prefix + 'comment-submit'">
        Comment
      </PrimaryButton>
    </div>
  </form>
</template>
