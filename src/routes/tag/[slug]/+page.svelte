<script lang="ts">
  import SongList from "$lib/components/SongList.svelte";
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

  <SongList songs={data.songs}></SongList>
</article>
