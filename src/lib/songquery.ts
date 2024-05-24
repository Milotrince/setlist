type Path = string;
type Module = {
  default: SvelteComponent;
  metadata: Record<string, any> 
}

const glob_import = import.meta.glob<{
    default: SvelteComponent;
    metadata: Record<string, any>;
  }>("$lib/songs/*.md", {
    eager: true,
  }) || {};
const songs = Object.entries(glob_import).map(s => ({slug: s[0].split("/").pop()?.split(".")[0], ...s[1].metadata}));

export default songs