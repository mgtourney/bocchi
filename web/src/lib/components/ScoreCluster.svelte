<script lang="ts">
  import { io } from "$lib/socket";
  import type { RTState } from "$lib/relayTypes";

  export let teamGUID: string = "bobross";
  export let flipped: Boolean = false;

  let missCount = 0;
  let accuracy = 100;
  let score = 0;

  io.on("realtimeScore", ({ team }: RTState) => {
    if(team.guid === teamGUID) {
      missCount = team.score.totalmisscount;
      accuracy = Math.round(team.score.accuracy * 10000) / 100;
      score = team.score.score;
    }
  });
</script>

<div class="flex-col">
  <div class="flex">
    {#if !flipped}
      <h1 class="m-2 misses">{missCount}</h1>
      <h1 class="flex-grow m-1 misses-text unflip">
        MISS{missCount == 2 ? "" : "ES"}
      </h1>
    {/if}

    {#if flipped}
      <h1 class="flex-grow m-1 misses-text flip">
        MISS{missCount == 2 ? "" : "ES"}
      </h1>
      <h1 class="m-2 misses">{missCount}</h1>
    {/if}
  </div>

  {#if flipped}
    <h1 class="m-2 acc-text flip">{accuracy}%</h1>
    <h1 class="m-2 score-text flip">{score}</h1>
  {:else}
    <h1 class="m-2 acc-text unflip">{accuracy}%</h1>
    <h1 class="m-2 score-text unflip">{score}</h1>
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
