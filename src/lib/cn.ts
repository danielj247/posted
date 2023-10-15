export default function cn(...classes: (string | boolean | undefined | number | null)[]) {
  return classes
    .filter((c) => {
      if (typeof c === "boolean") {
        return;
      }

      return !!c;
    })
    .join(" ");
}
