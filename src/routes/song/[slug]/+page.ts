import { toKebabCase } from "$lib/helpers.js";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

const songModules = import.meta.glob<{
  default: unknown;
  metadata: Record<string, any>;
}>("$lib/songs/*.md");

export const load: PageLoad = async ({ params }) => {
  const entry = Object.entries(songModules).find(([path]) =>
    path.endsWith(`/${params.slug}.md`)
  );

  if (!entry) {
    error(404, `Could not find ${params.slug}`);
  }

  const post = await entry[1]();
  return {
    content: post.default,
    meta: { artistSlug: toKebabCase(post.metadata.artist), ...post.metadata },
  };
};
