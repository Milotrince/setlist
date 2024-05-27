<script lang="ts">
  import "../app.sass";
  import { darkStore } from "$lib/stores";
  import { onMount } from "svelte";

  let darkMode: boolean;
  darkStore.subscribe((value) => {
    darkMode = value;
  });

  function toggleDarkMode() {
    darkStore.update((b) => !b);
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }
  onMount(() => {
    document.body.classList.add(darkMode ? "dark-mode" : "light-mode");
  });
</script>

<div class:dark={darkMode}>
  <div class="container">
    <h1 class="title">
      <a href="/">
        <span class="primary">set</span><span class="secondary">list</span>
      </a>
    </h1>
    <div class="icons">
      <button on:click={() => toggleDarkMode()}>{darkMode ? "☪︎" : "☀︎"}</button>
      <a href="https://github.com/milotrince/setlist"><button>source</button></a>
    </div>
  </div>

  <slot />
</div>

<style lang="sass">
  .container
    display: flex
    justify-content: space-between
  .icons
    flex: 1
    text-align: right
    align-self: center
  .title
    flex: 1
    .primary
      text-decoration: underline solid $primary
    .secondary
      text-decoration: underline solid $secondary
</style>
