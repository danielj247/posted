import { toRef } from "vue";
import { describe, expect, it } from "vitest";
import useLoadMore from "@/composables/useLoadMore";

describe("useLoadMore", () => {
  it("should return the correct initial values", () => {
    const items = toRef([1, 2, 3, 4, 5]);
    const increase = 2;
    const { currentAmount, viewableItems, finished } = useLoadMore<number>(items, increase);

    expect(currentAmount.value).toBe(increase);
    expect(viewableItems.value).toEqual([1, 2]);
    expect(finished.value).toBe(false);
  });

  it("should increment the amount", () => {
    const items = toRef([1, 2, 3, 4, 5]);
    const increase = 2;
    const { currentAmount, viewableItems, finished, increment } = useLoadMore<number>(items, increase);

    increment();

    expect(currentAmount.value).toBe(4);
    expect(viewableItems.value).toEqual([1, 2, 3, 4]);
    expect(finished.value).toBe(false);
  });

  it("should flag finished when all items are loaded", () => {
    const items = toRef([1, 2, 3, 4, 5]);
    const increase = 2;
    const { currentAmount, viewableItems, finished, increment } = useLoadMore<number>(items, increase);

    increment();
    increment();

    expect(currentAmount.value).toBe(6);
    expect(viewableItems.value).toEqual([1, 2, 3, 4, 5]);
    expect(finished.value).toBe(true);
  });

  it("should not increment when finished", () => {
    const items = toRef([1, 2, 3, 4, 5]);
    const increase = 2;
    const { currentAmount, viewableItems, finished, increment } = useLoadMore<number>(items, increase);

    increment();
    increment();
    increment();

    expect(currentAmount.value).toBe(6);
    expect(viewableItems.value).toEqual([1, 2, 3, 4, 5]);
    expect(finished.value).toBe(true);
  });

  it("should load all items", () => {
    const items = toRef([1, 2, 3, 4, 5]);
    const increase = 2;
    const { currentAmount, viewableItems, finished, loadAll } = useLoadMore<number>(items, increase);

    loadAll();

    expect(currentAmount.value).toBe(5);
    expect(viewableItems.value).toEqual([1, 2, 3, 4, 5]);
    expect(finished.value).toBe(true);
  });

  it("should reset the amount", () => {
    const items = toRef([1, 2, 3, 4, 5]);
    const increase = 2;
    const { currentAmount, viewableItems, finished, increment, reset } = useLoadMore<number>(items, increase);

    increment();
    increment();

    expect(currentAmount.value).toBe(6);

    reset();

    expect(currentAmount.value).toBe(increase);
    expect(viewableItems.value).toEqual([1, 2]);
    expect(finished.value).toBe(false);
  });

  it("should return the correct initial values for empty items", () => {
    const items = toRef([]);
    const increase = 2;
    const { currentAmount, viewableItems, finished } = useLoadMore<number>(items, increase);

    expect(currentAmount.value).toBe(increase);
    expect(viewableItems.value).toEqual([]);
    expect(finished.value).toBe(true);
  });

  it("shouldn't increment the amount for empty items", () => {
    const items = toRef([]);
    const increase = 2;
    const { currentAmount, viewableItems, finished, increment } = useLoadMore<number>(items, increase);

    increment();

    expect(currentAmount.value).toBe(2);
    expect(viewableItems.value).toEqual([]);
    expect(finished.value).toBe(true);
  });
});
