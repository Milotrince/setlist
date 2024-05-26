<script lang="ts">
  import SongList from "$lib/components/SongList.svelte";
  export let data;
</script>

<svelte:head>
  <title>songs by {data.artist}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.artist} />
</svelte:head>

<article>
  <hgroup>
    <h1><span style="font-weight: normal">songs by</span> {data.artist}</h1>
  </hgroup>

  <SongList songs={data.songs}></SongList>
</article>
