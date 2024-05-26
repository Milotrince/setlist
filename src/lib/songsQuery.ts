import { toKebabCase } from "$lib/helpers.js";

const glob_import =
  import.meta.glob<{
    default: SvelteComponent;
    metadata: Record<string, any>;
  }>("$lib/songs/*.md", {
    eager: true,
  }) || {};

export const songs = Object.entries(glob_import).map((s) => ({
  slug: s[0].split("/").pop()?.split(".")[0],
  artistSlug: toKebabCase(s[1].metadata.artist),
  ...s[1].metadata,
}));

export const tags = [...new Set(songs.flatMap(song => song.tags))];
