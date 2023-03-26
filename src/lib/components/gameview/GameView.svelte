<script lang="ts">
  import StreamView from "$lib/components/GameView/StreamView.svelte"
  import PlayerInfo from "$lib/components/GameView/PlayerInfo.svelte";
  import MiniScoreCluster from "$lib/components/GameView/MiniScoreCluster.svelte";

  export let playerName = "bobross";
  export let scale: number = 1;
  export let muted: boolean = true;
  export let pos: number;
</script>

{#if pos == 0}
  <div class="w-auto h-auto">
    <StreamView bind:playerName bind:scale bind:muted style="border-gray-600 border-b-[6px] border-r-[6px]"/>
    <PlayerInfo bind:pos/>
  </div>  
{:else if pos == 1}
<div class="w-auto h-auto">
  <StreamView bind:playerName bind:scale bind:muted style="border-gray-600 border-b-[6px] border-r-[6px] rounded-br-[38px]"/>
  <PlayerInfo bind:pos/>
</div> 
{:else if pos == 2}
<div class="w-auto h-auto">
  <StreamView bind:playerName bind:scale bind:muted style="border-gray-600 border-b-[6px] border-l-[6px]"/>
  <PlayerInfo bind:pos/>
</div> 
{:else if pos == 3}
<div class="w-auto h-auto">
  <StreamView bind:playerName bind:scale bind:muted style="border-gray-600 border-b-[6px] border-l-[6px] rounded-bl-[38px]"/>
  <PlayerInfo bind:pos/>
</div> 
{/if}