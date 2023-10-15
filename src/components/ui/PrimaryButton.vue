<script setup lang="ts">
import cn from "@/lib/cn";

const props = defineProps<{
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
  id?: string;
}>();

const buttonClass = cn(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-950 text-white hover:bg-zinc-950/90",
  props.size === "sm" && "h-9 px-2",
  (props.size === "md" || !props.size) && "h-10 px-4 py-2",
  props.size === "lg" && "h-11 px-8",
);
</script>

<template>
  <button :id="props.id" :class="buttonClass" :disabled="props.disabled" :type="type">
    <slot />
  </button>
</template>
