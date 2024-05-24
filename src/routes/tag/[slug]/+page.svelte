<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>{data.tag}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.tag} />
</svelte:head>

<article>
  <hgroup>
    <h1><span style="font-weight: normal">tagged with </span> {data.tag}</h1>
  </hgroup>

  <ul>
    {#each data.songs as song}
      <li><a href={`/song/${song.slug}`}>{song.title}</a> by {song.artist}</li>
    {/each}
  </ul>
</article>
