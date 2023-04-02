<script lang="ts">
  export let songName: string = "Loading...";
  export let songDiff: string = "Loading...";
</script>

<!-- svelte-ignore a11y-distracting-elements -->
{#if `${songName} * ${songDiff}`.length > 25}
<marquee class="song-title text-white w-[30vw] rounded-full" scrollamount="3" behavior="scroll" direction="left">
  {songName} • {songDiff}
</marquee>
{:else}
<div class="song-title text-white w-[30vw] rounded-full justify-center item-center text-center">
  {songName} • {songDiff}
</div>
{/if}

<style>
  .song-title {
    font-style: normal;
    font-weight: 900;
    font-size: 32px;
    line-height: 60px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #FFFFFF80;
  }
</style>