export function toUsername(name: string) {
  return name.trim().toLowerCase().replace(/\./g, "").replace(/\s/g, ".");
}
