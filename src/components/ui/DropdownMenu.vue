<script setup lang="ts">
import { computed, useSlots } from "vue";
import { ChevronDownIcon, CheckIcon } from "lucide-vue-next";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import cn from "@/lib/cn";

interface Option {
  name: string;
  value?: string;
  onClick?: () => void;
}

const props = defineProps<{
  label?: string;
  options: Option[];
  selected?: string;
  direction?: "left" | "right";
  id?: string;
}>();

const emit = defineEmits<{
  (e: "selection", value: string): void;
}>();

const hasSlots = computed(() => useSlots().default !== undefined);

const menuButtonClass = cn(
  "inline-flex justify-center w-full rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  hasSlots.value ? "bg-green p-1" : "bg-white px-3 py-2 border",
);

const handleOptionClick = (option: Option) => {
  if (option.onClick) {
    option.onClick();
  }

  if (option.value) {
    emit("selection", option.value);
  }
};
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton :class="menuButtonClass" :id="props.id">
        <slot>
          {{ props.label }}
          <ChevronDownIcon class="-mr-1 h-5 w-5 text-zinc-400" aria-hidden="true" />
        </slot>
      </MenuButton>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="props.direction === 'left' ? 'right-0' : 'left-0'"
      >
        <div class="py-1">
          <MenuItem
            v-for="option in props.options"
            :id="`dropdown-${option.name.replace(' ', '-').toLowerCase()}`"
            :key="option.name"
            v-slot="{ active }"
          >
            <p
              @click="() => handleOptionClick(option)"
              :class="[active ? 'bg-zinc-100' : '', 'block px-4 py-2 text-sm font-medium text-zinc-900 cursor-pointer']"
            >
              {{ option.name }}
              <CheckIcon
                v-if="props.selected === option.value && option.value !== undefined"
                class="inline w-4 h-4 ml-1"
              />
            </p>
          </MenuItem>
        </div>
      </MenuItems>
    </Transition>
  </Menu>
</template>
