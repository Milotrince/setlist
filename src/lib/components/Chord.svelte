<script lang="ts">
  import { transposeStore, sharpStore, instrumentTuningStore } from "$lib/stores.js";
  import { transposeChord, getFingeringsForChord, loadMoreFingeringsForChord } from "$lib/musicHelper.js";
  import { onMount } from "svelte";
  export let chord;

  const PAGE_SIZE = 4;
  let transpose = 0;
  let sharp: boolean | null = null;
  let fingerings: string[] = [];
  let f_idx = 0;
  let hasLoadedFingerings = false;
  let loadingFingerings = false;
  let loadToken = 0;
  let displayChord = chord;

  function resetFingerings() {
    loadToken += 1;
    hasLoadedFingerings = false;
    loadingFingerings = false;
    fingerings = [];
    f_idx = 0;
  }

  async function ensureFingeringsLoaded() {
    if (hasLoadedFingerings || loadingFingerings) return;

    loadingFingerings = true;
    const token = ++loadToken;
    const tabs = await getFingeringsForChord(displayChord, PAGE_SIZE);
    if (token !== loadToken) return;

    fingerings = tabs;
    f_idx = 0;
    hasLoadedFingerings = true;
    loadingFingerings = false;
  }

  onMount(() => {
    const unsubscribeSharp = sharpStore.subscribe((value) => {
      sharp = value;
      displayChord = transposeChord(chord, transpose, sharp);
      resetFingerings();
    });

    const unsubscribeTranspose = transposeStore.subscribe((value) => {
      transpose = value;
      displayChord = transposeChord(chord, transpose, sharp);
      resetFingerings();
    });

    const unsubscribeTuning = instrumentTuningStore.subscribe(() => {
      resetFingerings();
    });

    return () => {
      unsubscribeSharp();
      unsubscribeTranspose();
      unsubscribeTuning();
    };
  });

  async function nextFingering(i: number) {
    await ensureFingeringsLoaded();

    const length = fingerings.length;
    if (!length) return;

    if (i > 0 && f_idx === length - 1) {
      const updated = await loadMoreFingeringsForChord(displayChord, PAGE_SIZE);
      if (updated.length > length) {
        fingerings = updated;
        f_idx = length;
        return;
      }
    }

    f_idx = (f_idx + i + length) % length;
  }
</script>

<div
  class="chord"
  tabindex="0"
  role="button"
  aria-pressed="false"
  on:mouseenter={ensureFingeringsLoaded}
  on:focus={ensureFingeringsLoaded}
>
  <b>{displayChord}</b><div class="fingering" role="dialog">
    <button
      tabindex="-1"
      on:mousedown|preventDefault
      on:click={() => nextFingering(-1)}>&lt;</button
    >
    {fingerings.length ? fingerings[f_idx] : "? ? ? ? ? ?"}
    <button
      tabindex="-1"
      on:mousedown|preventDefault
      on:click={() => nextFingering(1)}>&gt;</button
    >
  </div>
</div>

<style lang="sass">
    .chord
        width: min-content
        display: inline-block
        &:hover
            cursor: pointer
            text-decoration: underline solid $primary
        &:focus
            text-decoration: underline solid $secondary
            .fingering
                display: block
        .fingering
            background: var(--background)
            display: none
            position: absolute
            transform: translateY(-200%) translateX(-20%)
            border-radius: 4px
            border: solid $secondary 2px
            padding: 2px
            &::after
                content: ""
                width: 2px
                height: 10px
                position: absolute
                bottom: -10px
                left: 50%
                transform: translateY(60%) translateX(-3.5em)
                border-width: 8px
                border-style: solid
                border-color: $secondary transparent transparent transparent
</style>
