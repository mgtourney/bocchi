<script lang="ts">
  import StreamView from "$lib/components/GameView/StreamView.svelte"
  import PlayerInfo from "$lib/components/GameView/PlayerInfo.svelte";
  import { GQL } from "$lib/constants";
  import { gql } from "graphql-request";

  export let playerName = "Loading...";

  export let accuracy: number;
  export let missCount: number;

  export let steamId: string = "0";

  export let scale: number = 1;
  export let muted: boolean = true;
  export let flipped: boolean = false;
  export let bottom: boolean = false;

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

  const styling = () => {
    let base = "border-[#FFFFFF30] border-b-[5px] ";
    let side = flipped ? "border-l-[9px]" : "border-r-[9px]";
    let roundCorner = flipped ? " rounded-bl-[38px]" : " rounded-br-[38px]";
    return bottom ? base + side + roundCorner : base + side;
  }
  
  GQL.request(twitch_query, { where: { steam: steamId } }).then((val: any) => {
    console.log(val);
    twitchName = val.getPlayer.socials.twitch; // the fuck the live share's still open? LMAO
  })
</script>

<div class="w-auto h-auto">
  <StreamView bind:twitchName bind:scale bind:muted style={styling()}/>
  <PlayerInfo bind:playerName bind:flipped bind:accuracy bind:missCount bind:playerId={steamId}/>
</div>
