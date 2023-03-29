<script lang="ts">
  import { writable } from "svelte/store";
  import { tweened } from "svelte/motion";
  import { io } from "$lib/socket";
  import type { Packets } from "tournament-assistant-client";
  export let flipped: Boolean = false;
  let missCount: number = 0;
  let accuracy: number = 100;
  
  export let playerGUID: string;

  // console.log(playerGUID)

  io.on('realtimeScore', (score: Packets.Push.RealtimeScore) => {
    if (score.user_guid == playerGUID) {
      missCount = score.scoreTracker.notesMissed + score.scoreTracker.badCuts;
      accuracy = Math.round(score.accuracy * 10000) / 100
    }
  });
  
  $: missCountLocal = tweened(missCount);
  $: accuracyLocal = tweened(accuracy);
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
  {:else}
    <h1 class="m-2 acc-text unflip">{$accuracyLocal}%</h1>
  {/if}
</div>
<style>
  .misses {
    font-style: normal;
    font-weight: 900;
    font-size: 48px;
    line-height: 0px;
    color: #FFFFFF;
  }

  .misses-text {
    font-style: normal;
    font-weight: 900;
    font-size: 22px;
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
    font-style: bold;
    font-weight: 900;
    font-size: 48px;
    line-height: 25px;
    display: flex;
    color: #FFFFFF;
  }
</style>