<script lang="ts">
  import StreamView from "$lib/components/GameView/StreamView.svelte"
  import PlayerInfo from "$lib/components/GameView/PlayerInfo.svelte";

  export let playerName = "bobross";
  export let scale: number = 1;
  export let muted: boolean = true;
  export let pos: number;
</script>

{#if pos == 0}
  <div class="w-auto h-auto">
    <StreamView bind:playerName bind:scale bind:muted style="border-[#FFFFFF30] border-b-[5px] border-r-[9px]"/>
    <PlayerInfo bind:pos/>
  </div>  
{:else if pos == 1}
<div class="w-auto h-auto">
  <StreamView bind:playerName bind:scale bind:muted style="border-[#FFFFFF30] border-b-[5px] border-r-[9px] rounded-br-[38px]"/>
  <PlayerInfo bind:pos/>
</div> 
{:else if pos == 2}
<div class="w-auto h-auto">
  <StreamView bind:playerName bind:scale bind:muted style="border-[#FFFFFF30] border-b-[5px] border-l-[9px]"/>
  <PlayerInfo bind:pos/>
</div> 
{:else if pos == 3}
<div class="w-auto h-auto">
  <StreamView bind:playerName bind:scale bind:muted style="border-[#FFFFFF30] border-b-[5px] border-l-[9px] rounded-bl-[38px]"/>
  <PlayerInfo bind:pos/>
</div> 
{/if}