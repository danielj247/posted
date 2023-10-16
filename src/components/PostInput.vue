<script setup lang="ts">
import { computed, ref } from "vue";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import PostItem from "@/components/PostItem.vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";
import TextInput from "@/components/ui/TextInput.vue";
import TextArea from "@/components/ui/TextArea.vue";

import type { Post } from "@/types/post";

const props = defineProps<{
  idPrefix?: string;
  post?: Post;
}>();

const emit = defineEmits<{
  (e: "submit", title: string, body: string): void;
}>();

const title = ref(props.post?.title || "");
const body = ref(props.post?.body || "");
const selectedTabIndex = ref(0);

const prefix = computed(() => (props.idPrefix ? props.idPrefix + "-" : ""));

function handleSubmit() {
  if (!title.value || !body.value) return;

  emit("submit", title.value, body.value);

  title.value = "";
  body.value = "";

  selectedTabIndex.value = 0;
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <TabGroup :selected-index="selectedTabIndex" @change="(index) => (selectedTabIndex = index)">
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
            :id="prefix + 'post-title'"
            v-model="title"
            class="w-full"
            label="Post title"
            label-hidden
            placeholder="Add a title to your post"
            auto-complete="off"
          />
          <TextArea
            :rows="5"
            v-model="body"
            label="Post body"
            label-hidden
            name="body"
            :id="prefix + 'post-body'"
            class="mt-2"
            input-class="min-h-[120px]"
            placeholder="Tell everyone what your thinking about!"
          />
        </TabPanel>
        <TabPanel class="-m-0.5 rounded-lg p-0.5">
          <div class="text-sm leading-5 text-zinc-800">
            <ul class="my-2">
              <PostItem
                no-reply
                no-menu
                :data="{
                  id: -1,
                  userId: -1,
                  title,
                  body,
                  comments: [
                    {
                      id: -1,
                      postId: -1,
                      email: '',
                      user: {
                        id: -1,
                        name: 'Commenter name',
                        username: 'commenter',
                        email: 'commenter@example.com',
                        photo: 'https://i.pravatar.cc/100?u=person',
                      },
                      name: 'Comment title',
                      body: 'Comment body',
                    },
                  ],
                }"
              />
            </ul>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
    <div class="mt-2 flex justify-end">
      <PrimaryButton type="submit" class="w-32" :disabled="!title || !body" :id="prefix + 'post-submit'">
        Post
      </PrimaryButton>
    </div>
  </form>
</template>
