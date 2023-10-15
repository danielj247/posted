<script setup lang="ts">
const props = defineProps<{
  src?: string;
}>();
</script>

<template>
  <img :src="props.src" alt="" class="min-h-[24px] min-w-[24px] flex-none rounded-full bg-zinc-700" />
</template>
