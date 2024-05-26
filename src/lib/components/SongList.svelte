<script lang="ts">
  export let songs
</script>

<ul>
  {#each songs as song}
    <li>
      <a href={`/song/${song.slug}`}>{song.title}</a> by
      <a class="artist" href={`/artist/${song.artistSlug}`}>{song.artist}</a>
    </li>
  {/each}
</ul>

<style lang="sass">
  .artist
    text-decoration-color: $primary
</style>
