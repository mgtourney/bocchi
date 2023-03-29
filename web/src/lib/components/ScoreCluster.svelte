<script lang="ts">
  import { writable } from "svelte/store";
  import { tweened } from "svelte/motion";
  import { io } from "$lib/socket";
  import type { Models, Packets } from "tournament-assistant-client";

  export let teamGUIDS: string[];
  export let flipped: Boolean = false;

  let missCounts: Map<string, number> = new Map();
  let accuracies: Map<string, number> = new Map();
  let scores: Map<string, number> = new Map();

  let missCountLocal = 0
  let accuracyLocal = 100
  let totalScore = 0;

  teamGUIDS.forEach((guid) => {
    missCounts.set(guid, 0);
    accuracies.set(guid, 100);
    scores.set(guid, 0);
  });

  io.on("realtimeScore", (score: Packets.Push.RealtimeScore) => {
    if (teamGUIDS.includes(score.user_guid)) {
      missCounts.set(
        score.user_guid,
        score.scoreTracker.notesMissed + score.scoreTracker.badCuts
      );
      accuracies.set(score.user_guid, score.accuracy);
      scores.set(score.user_guid, score.score_with_modifiers);
      totalScore = Array.from(scores.values()).reduce((a, b) => a + b, 0);
      accuracyLocal = (Math.round(Array.from(accuracies.values()).reduce((a, b) => a + b, 0) * 1000) / 10) / accuracies.size;
      missCountLocal = Array.from(missCounts.values()).reduce((a, b) => a + b, 0)
    }
  });
</script>

<div class="flex-col">
  <div class="flex">
    {#if !flipped}
      <h1 class="m-2 misses">{missCountLocal}</h1>
      <h1 class="flex-grow m-1 misses-text unflip">
        MISS{missCountLocal == 2 ? "" : "ES"}
      </h1>
    {/if}

    {#if flipped}
      <h1 class="flex-grow m-1 misses-text flip">
        MISS{missCountLocal == 2 ? "" : "ES"}
      </h1>
      <h1 class="m-2 misses">{missCountLocal}</h1>
    {/if}
  </div>

  {#if flipped}
    <h1 class="m-2 acc-text flip">{accuracyLocal}%</h1>
    <h1 class="m-2 score-text flip">{totalScore}</h1>
  {:else}
    <h1 class="m-2 acc-text unflip">{accuracyLocal}%</h1>
    <h1 class="m-2 score-text unflip">{totalScore}</h1>
  {/if}
</div>

<style>
  .misses {
    font-style: normal;
    font-weight: 900;
    font-size: 56px;
    line-height: 0px;
    color: #ffffff;
  }

  .misses-text {
    font-style: normal;
    font-weight: 900;
    font-size: 26px;
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
    font-family: sans-serif;
    font-style: normal;
    font-weight: 900;
    font-size: 56px;
    line-height: 50px;
    display: flex;
    color: #ffffff;
  }

  .score-text {
    font-style: normal;
    font-weight: 900;
    font-size: 26px;
    line-height: 30px;
    color: #ffffff80;
  }
</style>
