<script lang="ts">
  import { writable } from "svelte/store";
  import { tweened } from "svelte/motion";
  export let flipped: Boolean = false;
  export let missCount: number = 3;
  export let accuracy: number = 96.67;
  export let score: number = 2571602;

  let missCountLocal = tweened(missCount);
  let accuracyLocal = tweened(accuracy);

  const formattedScore = writable(score.toLocaleString().replace(/\,/g, ' '));
  $: formattedScore.set(score.toLocaleString().replace(/\,/g, ' '));
</script>

<div class="flex-col">
  <div class="flex">
    {#if !flipped}
      <h1 class="m-2 misses">{$missCountLocal}</h1>
      <h1 class="flex-grow m-1 misses-text unflip">MISS{($missCountLocal == 2) ? '' : 'ES'}</h1>
    {/if}
    
    {#if flipped}
      <h1 class="flex-grow m-1 misses-text flip">MISS{($missCountLocal == 2) ? '' : 'ES'}</h1>
      <h1 class="m-2 misses">{$missCountLocal}</h1>
    {/if}
  </div>
  {#if flipped}
    <h1 class="m-2 acc-text flip">{$accuracyLocal}%</h1>
    <h1 class="m-2 score-text flip">{$formattedScore}</h1>
  {:else}
    <h1 class="m-2 acc-text unflip">{$accuracyLocal}%</h1>
    <h1 class="m-2 score-text unflip">{$formattedScore}</h1>
  {/if}
</div>
<style>
  .misses {
    font-style: normal;
    font-weight: 900;
    font-size: 56px;
    line-height: 0px;
    color: #FFFFFF;
  }

  .misses-text {
    font-style: normal;
    font-weight: 900;
    font-size: 26px;
    line-height: 30px;
    color: #FFFFFF80;
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
    font-family: sans-serif;
    font-style: normal;
    font-weight: 900;
    font-size: 56px;
    line-height: 50px;
    display: flex;
    color: #FFFFFF;
  }

  .score-text {
    font-style: normal;
    font-weight: 900;
    font-size: 26px;
    line-height: 30px;
    color: #FFFFFF80;
  }
</style>