<script lang="ts">
  import songs from "$lib/songquery";

  let christmas = false;
</script>

<ul>
  {#each songs as song}
  {#if !christmas && !song.tags.includes("christmas") || christmas && song.tags.includes("christmas")}
    <li><a href={`/song/${song.slug}`}>{song.title}</a> by {song.artist}</li>
  {/if}
  {/each}
</ul>

<button on:click={() => christmas = !christmas}>
  {christmas ? 'christmas.' : 'christmas?'}
</button>