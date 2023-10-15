<script setup lang="ts">
import { computed, ref } from "vue";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-vue-next";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";

import type { User } from "@/types/user";

const props = defineProps<{
  users: User[];
  labelHidden?: boolean;
}>();

const emit = defineEmits<{
  (e: "select", value: User): void;
}>();

const query = ref("");
const selectedPerson = ref(null);
const filteredPeople = computed(() =>
  query.value === ""
    ? props.users
    : props.users.filter((person) => person.name.toLowerCase().includes(query.value.toLowerCase())),
);
</script>

<template>
  <Combobox as="div" v-model.User="selectedPerson">
    <ComboboxLabel
      class="block text-sm font-medium leading-6 text-zinc-900 text-left"
      :class="$props.labelHidden && 'sr-only'"
    >
      Select a user
    </ComboboxLabel>

    <div class="relative">
      <ComboboxInput
        placeholder="Filter by user"
        class="w-full rounded-md border bg-white py-1.5 pl-3 pr-12 text-zinc-900 shadow-sm sm:text-sm sm:leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        @change="query = $event.target.value"
        :display-value="(person) => (person as User)?.name"
      />
      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <ChevronsUpDownIcon class="h-5 w-5 text-zinc-400" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions
        v-if="filteredPeople.length > 0"
        class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <ComboboxOption
          v-for="person in filteredPeople"
          :key="person.id"
          :value="person"
          as="template"
          v-slot="{ active, selected }"
        >
          <li
            :class="[
              'relative cursor-default select-none py-2 pl-3 pr-9',
              active ? 'bg-zinc-900 text-white' : 'text-zinc-900',
            ]"
            @click="emit('select', person)"
          >
            <div class="flex items-center">
              <UserAvatar v-if="person.photo" :src="person.photo" class="h-6 w-6 flex-shrink-0" />
              <span :class="['ml-3 truncate', selected && 'font-semibold']">
                {{ person.name }}
              </span>
            </div>

            <span
              v-if="selected"
              :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-zinc-900']"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>
