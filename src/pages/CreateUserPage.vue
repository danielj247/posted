<script setup lang="ts">
import { ref } from "vue";
import { SendHorizontalIcon } from "lucide-vue-next";
import { useStore } from "@/store";
import PostedLogo from "@/components/PostedLogo.vue";
import TextInput from "@/components/ui/TextInput.vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";

const store = useStore();

const name = ref("");
const error = ref("");

function handleSubmit(e: Event) {
  e.preventDefault();

  if (!name.value) {
    error.value = "Please enter a name to continue.";
    return;
  }

  if (!store.initialised) {
    error.value = "Please wait a moment, store still initialising.";
    return;
  }

  store.login(name.value);
}
</script>

<template>
  <div class="flex flex-col justify-center items-center w-72 h-screen mx-auto">
    <PostedLogo />

    <p class="text-zinc-800 text-center font-bold mt-10 px-4">Let us know what your name is so you can get posting!</p>

    <Transition name="list-vert">
      <p v-if="error" class="rounded-md bg-red-50 p-4 text-red-700 text-sm font-bold mt-8">{{ error }}</p>
    </Transition>

    <form @submit="handleSubmit" class="flex items-center mt-6 w-full">
      <TextInput
        id="new-user-name"
        v-model.trim="name"
        class="w-full"
        label="Name"
        label-hidden
        placeholder="Person McSurname"
      />

      <PrimaryButton id="new-user-submit" size="sm" class="ml-1" type="submit" :disabled="!store.initialised">
        <SendHorizontalIcon class="stroke-white w-5 h-5" />
      </PrimaryButton>
    </form>

    <p class="mt-2 text-sm text-zinc-500">This is the name displayed when you interact.</p>
  </div>
</template>
