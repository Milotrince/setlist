<script lang="ts">
  import { derived, writable } from "svelte/store";
  import { songs, tags } from "$lib/songsQuery";
  import SongList from "$lib/components/SongList.svelte";
  import TagsInput from "$lib/components/TagsInput.svelte";

  let showOptions = false;

  const searchQuery = writable("");
  const includeTags = writable([]);
  const excludeTags = writable(["christmas"]);

  const displaySongs = derived(
    [searchQuery, includeTags, excludeTags],
    ([$searchQuery, $includeTags, $excludeTags]) =>
      songs.filter((song) => {
        const matchesQuery =
          song.title.toLowerCase().includes($searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes($searchQuery.toLowerCase());

        const matchesIncludeTags =
          $includeTags.length === 0 ||
          song.tags.some((tag) => $includeTags.includes(tag));

        const matchesExcludeTags = !$excludeTags.some((tag) =>
          song.tags.includes(tag)
        );

        return matchesQuery && matchesIncludeTags && matchesExcludeTags;
      })
  );
</script>

<svelte:head>
  <title>setlist</title>
  <meta property="og:title" content="setlist" />
</svelte:head>

<p>
  <span class="small">search</span>
  <input
    class="search"
    type="text"
    placeholder="title or artist..."
    bind:value={$searchQuery}
  />
  <button on:click={() => (showOptions = !showOptions)}>▾</button>
</p>
{#if showOptions}
  <div style="margin-left: 12px;">
    <div style="margin-bottom: 4px">
      <span class="small">include tags</span>
      <div style="display: inline-block">
        <TagsInput
          bind:tags={$includeTags}
          autoComplete={tags}
          onlyAutocomplete={true}
          onlyUnique={true}
          minChars={1}
        />
      </div>
    </div>
    <div>
      <span class="small">exclude tags</span>
      <div style="display: inline-block">
        <TagsInput
          bind:tags={$excludeTags}
          autoComplete={tags}
          onlyAutocomplete={true}
          onlyUnique={true}
          minChars={1}
        />
      </div>
    </div>
  </div>
{/if}
<SongList songs={$displaySongs}></SongList>

<style lang="sass">
  .search
    width: 240px
  @media (min-width: 769px)
    .search
      width: 400px
  .small
    font-size: 0.8em
</style>
