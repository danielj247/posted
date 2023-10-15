<script setup lang="ts">
import { ref } from "vue";
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { XIcon, SearchIcon } from "lucide-vue-next";
import { useStore } from "@/store";
import UserSelect from "@/components/UserSelect.vue";
import TextInput from "@/components/ui/TextInput.vue";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";
import { FilterSort } from "@/types/filter";

const SORT_OPTIONS = [
  { name: "Ascending", value: FilterSort.ASC },
  { name: "Descending", value: FilterSort.DESC },
];

const store = useStore();

const open = ref(false);
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-40 sm:hidden" @close="open = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <DialogPanel
              class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl"
            >
              <div class="flex items-center justify-between px-4">
                <h2 class="text-lg font-medium text-zinc-900">Filters</h2>
                <button
                  type="button"
                  class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-zinc-400 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  @click="open = false"
                >
                  <span class="sr-only">Close menu</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div class="p-4">
                <UserSelect
                  label-hidden
                  :users="[
                    {
                      id: -1,
                      name: 'All users',
                      username: '',
                      photo: '',
                      email: '',
                    },
                    ...store.users,
                  ]"
                  :model-value="store.filter.user"
                  @update:model-value="store.setFilterUser"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="mx-auto text-center">
      <section
        aria-labelledby="filter-heading"
        class="flex justify-between items-center w-full rounded-md bg-white px-6 py-4 transition-all shadow hover:shadow-lg focus-within:shadow-lg mb-8 border-zinc-950 flex-wrap"
      >
        <h2 id="filter-heading" class="sr-only">Filters</h2>

        <div class="flex items-center justify-between relative">
          <DropdownMenu
            :options="SORT_OPTIONS"
            :label="`Sort by: ${store.filter.sort === FilterSort.ASC ? 'Ascending' : 'Descending'}`"
            :selected="store.filter.sort"
            @selection="(value) => store.setFilterSort(value as FilterSort)"
          />
        </div>

        <div class="w-2/5 min-w-[200px] py-4 md:block order-3 md:order-none basis-full md:basis-1/3">
          <div class="w-full">
            <label for="search" class="sr-only">Search posts</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon class="h-5 w-5 text-zinc-400" aria-hidden="true" />
              </div>
              <TextInput
                name="search"
                label="Search posts"
                label-hidden
                placeholder="Search posts"
                auto-complete="off"
                input-class="pl-10"
                :model-value="store.filter.search || ''"
                @update:model-value="store.setFilterSearch"
              />
            </div>
          </div>
        </div>

        <UserSelect
          label-hidden
          class="hidden sm:block"
          :users="[
            {
              id: -1,
              name: 'All users',
              username: '',
              photo: '',
              email: '',
            },
            ...store.users,
          ]"
          :model-value="store.filter.user"
          @update:model-value="store.setFilterUser"
        />

        <button
          type="button"
          class="inline-block text-sm font-semibold text-zinc-700 hover:text-zinc-900 sm:hidden"
          @click="open = true"
        >
          Filters
        </button>
      </section>
    </div>
  </div>
</template>
