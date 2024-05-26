<script lang="ts">
  import StoreControl from "$lib/components/StoreControl.svelte";

  import {
    fontSizeStore,
    columnsStore,
    transposeStore,
    scrollSpeedStore,
    sharpStore
  } from "$lib/stores.js";
  import { onMount } from "svelte";
  export let data;

  let fontSize: number;
  fontSizeStore.subscribe((value) => {
    fontSize = value;
  });
  let columns: number;
  columnsStore.subscribe((value) => {
    columns = value;
  });
  let scrollSpeed: number;
  scrollSpeedStore.subscribe((value) => {
    scrollSpeed = value;
  });
  let sharp: boolean;
  sharpStore.subscribe((value) => {
    sharp = value;
  });

  let scroll = false;
  let scrollId: number;
  let accumulatedScroll: number = 0;
  function scrollPage() {
    if (scroll) {
      accumulatedScroll += scrollSpeed;
      const scrollAmount = Math.floor(accumulatedScroll);
      window.scrollBy(0, scrollAmount);
      accumulatedScroll -= scrollAmount;
    }
    scrollId = requestAnimationFrame(scrollPage);
  }
  onMount(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        scroll = !scroll;
        event.preventDefault();
      }
    });
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight || scrollTop <= 0) {
        scroll = false;
      }
    });
    scrollId = requestAnimationFrame(scrollPage);
    return () => {
      scroll = false;
      cancelAnimationFrame(scrollId);
    };
  });
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.meta.title} />
</svelte:head>

<div>
  <StoreControl
    label="columns"
    store={columnsStore}
    minus={(n) => Math.max(0, n - 1)}
    plus={(n) => Math.min(5, n + 1)}
    reset={1}
  ></StoreControl>
  <StoreControl
    label="fontsize"
    store={fontSizeStore}
    minus={(n) => parseFloat(Math.max(0.4, n - 0.2).toFixed(1))}
    plus={(n) => parseFloat(Math.min(5.0, n + 0.2).toFixed(1))}
    reset={1}
  ></StoreControl>
  <StoreControl
    label="transpose"
    store={transposeStore}
    minus={(n) => n - 1}
    plus={(n) => n + 1}
    reset={0} >
    <button on:click={() => sharpStore.update(b => !b)}>{sharp ? "#" : "♭"}</button>
  </StoreControl>
  <StoreControl
    label="scroll"
    store={scrollSpeedStore}
    minus={(n) => parseFloat(Math.max(0, n - 0.1).toFixed(1))}
    plus={(n) => parseFloat(Math.min(5.0, n + 0.1).toFixed(1))}
    reset={0.1}
  >
    <button on:click={() => (scroll = !scroll)}>{scroll ? "⏸︎" : "▸"}</button>
  </StoreControl>
</div>

<article>
  <hgroup>
    <h1>
      {data.meta.title} <span style="font-weight: normal">by</span>
      <a class="artist" href={`/artist/${data.meta.artistSlug}`}>{data.meta.artist}</a>
    </h1>
  </hgroup>

  <div>
    tags:
    {#each data.meta.tags as tag}
      <a href={"/tag/" + tag}>{tag}</a>,&nbsp;
    {/each}
  </div>

  <div style={`font-size: ${fontSize}rem; column-count: ${columns}`}>
    <svelte:component this={data.content} />
  </div>
</article>

<style lang="sass">
  .label
    display: inline-block
    width: 90px
    text-align: right
  .artist
    text-decoration-color: $primary
</style>
