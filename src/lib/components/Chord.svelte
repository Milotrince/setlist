<script lang="ts">
  import { transposeChord, getFingering } from "$lib/musicHelper";
  import { transposeStore, sharpStore } from "$lib/stores.js";
  export let chord;

  let transpose = 0;
  let sharp = true;
  let displayChord = transposeChord(chord, transpose, sharp);
  let fingerings = getFingering(displayChord);

  sharpStore.subscribe((value) => {
    sharp = value;
    displayChord = transposeChord(chord, 0, sharp);
  })

  transposeStore.subscribe((value) => {
    transpose = value;
    displayChord = transposeChord(chord, transpose, sharp);
    fingerings = getFingering(displayChord);
  });

  let fi = 0;
  const L = fingerings.length;

  function nextFingering(i: number) {
    fi = (fi + i) % L;
  }
</script>

<div class="chord" tabindex="0" role="button" aria-pressed="false">
  <b>{displayChord}</b><div class="fingering" role="dialog">
    <button
      tabindex="-1"
      on:mousedown|preventDefault
      on:click={() => nextFingering(-1)}>&lt;</button
    >
    {fingerings ? fingerings[fi] : "? ? ? ? ? ?"}
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
