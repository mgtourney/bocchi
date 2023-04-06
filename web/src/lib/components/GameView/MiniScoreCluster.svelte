<script lang="ts">
  import { spring } from "svelte/motion";

  export let flipped: Boolean = false;
  export let missCount: number;
  export let accuracy: number;

  let accText = spring(0);
  $: accText.set(accuracy);
</script>

<div class="flex-col">
  <div class="flex">
    {#if !flipped}
      <h1 class="m-2 misses">{missCount}</h1>
      <h1 class="flex-grow m-1 misses-text unflip">
        MISS{missCount === 2 ? "" : "ES"}
      </h1>
    {/if}

    {#if flipped}
      <h1 class="flex-grow m-1 misses-text flip">
        MISS{missCount === 2 ? "" : "ES"}
      </h1>
      <h1 class="m-2 misses">{missCount}</h1>
    {/if}
  </div>

  <div class="flex">
    {#if !flipped}
      <h1 class="m-2 acc-text unflip">{$accText.toFixed(2)}%</h1>
    {/if}

    {#if flipped}
      <h1 class="m-2 acc-text flip">{$accText.toFixed(2)}%</h1>
    {/if}
  </div>
</div>

<style>
  .misses {
    font-style: normal;
    font-weight: 900;
    font-size: 48px;
    line-height: 0px;
    color: #ffffff;
  }

  .misses-text {
    font-style: normal;
    font-weight: 900;
    font-size: 22px;
    line-height: 30px;
    color: #ffffff80;
  }

  .flip {
    text-align: right;
    align-items: flex-end;
  }

  .unflip {
    text-align: left;
    align-items: flex-start;
  }

  .acc-text {
    font-style: bold;
    font-weight: 900;
    font-size: 48px;
    line-height: 25px;
    display: flex;
    color: #ffffff;
  }
</style>
