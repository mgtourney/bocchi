<script lang="ts">
  import StreamView from "$lib/components/GameView/StreamView.svelte"
  import PlayerInfo from "$lib/components/GameView/PlayerInfo.svelte";
  import { GQL } from "$lib/constants";
  import { gql } from "graphql-request";

  export let playerName = "Loading...";

  export let playerGUID: string;

  export let playerId: string;

  export let scale: number = 1;
  export let muted: boolean = true;
  export let pos: number;

  let twitchName = ""
  let twitch_query = gql`
  query GetPlayer($where: PlayerWhereUniqueInput!) {
  getPlayer(where: $where) {
    socials {
      twitch
    }
  }
}
  `
  
  GQL.request(twitch_query, { where: { steam: playerId } }).then((val: any) => {
    console.log(val);
    twitchName = val.getPlayer.socials.twitch;
  })
</script>

{#if pos == 0}
<div class="w-auto h-auto">
  <StreamView bind:twitchName bind:scale bind:muted style="border-[#FFFFFF30] border-b-[5px] border-r-[9px]"/>
  <PlayerInfo bind:playerName bind:pos bind:playerGUID bind:playerId/>
</div>
{:else if pos == 1}
<div class="w-auto h-auto">
  <StreamView bind:twitchName bind:scale bind:muted style="border-[#FFFFFF30] border-b-[5px] border-r-[9px] rounded-br-[38px]"/>
  <PlayerInfo bind:playerName bind:pos bind:playerGUID bind:playerId/>
</div> 
{:else if pos == 2}
<div class="w-auto h-auto">
  <StreamView bind:twitchName bind:scale bind:muted style="border-[#FFFFFF30] border-b-[5px] border-l-[9px]"/>
  <PlayerInfo bind:playerName bind:pos bind:playerGUID bind:playerId/>
</div> 
{:else if pos == 3}
<div class="w-auto h-auto">
  <StreamView bind:twitchName bind:scale bind:muted style="border-[#FFFFFF30] border-b-[5px] border-l-[9px] rounded-bl-[38px]"/>
  <PlayerInfo bind:playerName bind:pos bind:playerGUID bind:playerId/>
</div> 
{/if}