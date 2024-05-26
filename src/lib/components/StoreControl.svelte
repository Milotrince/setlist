<script lang="ts">
  export let label;
  export let store;
  export let plus;
  export let minus;
  export let reset;

  let value: any;
  store.subscribe((v: any) => value = v);
</script>

<div>
    <div class="label">{label}</div>
    <div class="value">{value}</div>
    <button on:click={() => store.update((n) => minus(n))}>
      -
    </button>
    <button on:click={() => store.update((n) => plus(n))}>
      +
    </button>
    <button on:click={() => store.update((n) => reset)}> ↺ </button>
    <slot/>
  </div>

<style lang="sass">
  .label
    display: inline-block
    width: 90px
    text-align: right
  .value
    display: inline-block
    width: 20px
    text-align: center
</style>

