import { computed, ref } from "vue";

import type { Ref } from "vue";

export default function useLoadMore<T>(items: Ref<T[]>, amount: number) {
  // value used to slice the items array
  const currentAmount = ref(amount);

  // slice the items array based on the current amount
  const viewableItems = computed(() => items.value?.slice(0, currentAmount.value));

  // check if all items have been loaded
  const finished = computed(() => currentAmount.value >= items.value?.length);

  // increment the current amount by the amount param
  function increment() {
    // if all items have been loaded, return
    if (finished.value) {
      return;
    }

    currentAmount.value += amount;
  }

  // load all items at once
  function loadAll() {
    currentAmount.value = items.value.length;
  }

  // reset the current amount to the initial amount
  function reset() {
    currentAmount.value = amount;
  }

  return {
    // state
    currentAmount,

    // getters
    viewableItems,
    finished,

    // actions
    increment,
    loadAll,
    reset,
  };
}
