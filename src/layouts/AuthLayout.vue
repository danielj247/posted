<script setup lang="ts">
import AuthHeader from "@/components/AuthHeader.vue";
</script>

<template>
  <div class="pb-36">
    <AuthHeader class="mb-10" />
    <slot />
  </div>
</template>
