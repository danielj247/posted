<script setup lang="ts">
const props = defineProps<{
  label: string;
  modelValue: string;
  labelHidden?: boolean;
  placeholder?: string;
  description?: string;
  name?: string;
  id?: string;
  inputClass?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const handleChange = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <div>
    <label
      :for="name"
      class="block text-sm font-medium leading-6 text-zinc-900"
      :class="props.labelHidden && 'sr-only'"
    >
      {{ props.label }}
    </label>
    <div>
      <input
        class="flex w-full h-9 rounded-md border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :class="props.inputClass"
        :name="props.name"
        :id="props.id || props.name"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        @input="handleChange"
      />
    </div>
    <p v-if="props.description" class="mt-2 text-sm text-zinc-500">{{ props.description }}</p>
  </div>
</template>
