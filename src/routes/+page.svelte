<script lang="ts">
  import SongList from '$lib/components/SongList.svelte';
  import songs from "$lib/songquery";

  let christmas = false;
  let displaySongs = songs.filter(
    (s) => +s.tags.includes("christmas") ^ +!christmas
  );
</script>

<SongList songs={displaySongs}></SongList>

<button on:click={() => (christmas = !christmas)}>
  {christmas ? "christmas." : "christmas?"}
</button>
