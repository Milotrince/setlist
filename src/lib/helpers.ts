export function toKebabCase(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .toLowerCase();
}

export function invertDict(d: { [key: string]: string }): { [key: string]: string } {
  var inv: { [key: string]: string } = {};
  for (var key in d) {
    inv[d[key]] = key;
  }
  return inv;
}
