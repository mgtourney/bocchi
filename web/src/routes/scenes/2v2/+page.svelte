<script lang="ts">
  import ScoreLine from "$lib/components/ScoreLine.svelte";
  import GameView from "$lib/components/GameView/GameView.svelte";
  import DiffBar from "$lib/components/DiffBar.svelte";
  import ScoreCluster from "$lib/components/ScoreCluster.svelte";
  import TeamInfo from "$lib/components/TeamInfo.svelte";
  import SongTitle from "$lib/components/SongTitle.svelte";
  import { io } from "$lib/socket";
  import { gql } from "graphql-request";
  import { GQL } from "$lib/constants";
  import type { Player, RTState, Song, State, Team } from "shared/relayTypes";
  import { onMount, onDestroy } from "svelte";

  let globalScale = 0.412;

  let song: Song | undefined;
  let team1: string;
  let team2: string;
  let localTeams: Map<string, Team> = new Map<string, Team>();
  let player1: string;
  let player2: string;
  let player3: string;
  let player4: string;
  let localPlayers: Map<string, Player> = new Map<string, Player>();
  let diff: number = 0;

  // please for the love of god end me.  - niko@velvet.moe
  let qTeams: Map<string, any> = new Map();

  function updateTeam(id: string) {
    // let query = gql`
    //   query Query($where: PlayerWhereUniqueInput!) {
    //     getPlayer(where: $where) {
    //       team
    //     }
    //   }
    // `;
    // GQL.request(query, { where: { steam: id } }).then((val: any) => {
    //   //console.log(val)
    //   let query = gql`
    //     query Query($where: TeamWhereUniqueInput!) {
    //       getTeam(where: $where) {
    //         name
    //         logo
    //       }
    //     }
    //   `;
    //   GQL.request(query, { where: { id: val.getPlayer.team } }).then(
    //     (val: any) => {
    //       // console.log(val)
    //       qTeams.set(id, val.getTeam);
    //     }
    //   );
    // }).catch(() => {
    //   return;
    // });
  }

  io.on("state", ({ teams, players, selectedMatch }: State) => {
    // Set the guids of the players and teams per teams
    //console.log(teams)
    teams?.forEach((team) => {
      if (team1 == undefined || teams.find((e) => e.guid == team1) == undefined) {
        team1 = team.guid;
        console.log(team);
        team.playerGUIDs?.forEach((player) => {
          if (player1 == undefined || players?.find((e) => e.guid == player1) == undefined) {
            console.log("player1");
            player1 = player;
          } else if (player2 == undefined || players?.find((e) => e.guid == player2) == undefined) {
            console.log("player2");
            player2 = player;
          }
        });
      } else if (team2 == undefined || teams.find((e) => e.guid == team2) == undefined) {
        team2 = team.guid;
        team.playerGUIDs?.forEach((player) => {
          if (player3 == undefined || players?.find((e) => e.guid == player3) == undefined) {
            console.log("player3");
            player3 = player;
          } else if (player4 == undefined || players?.find((e) => e.guid == player4) == undefined) {
            console.log("player4");
            player4 = player;
          }
        });
      }
    });
    // Update the state of everything
    teams?.forEach((team) => localTeams.set(team.guid, team));
    players?.forEach((player) => localPlayers.set(player.guid, player));

    song = selectedMatch?.song;
  });

  io.on("realtimeScore", ({ team, player }: RTState) => {
    // Update the RTScore of the player
    let modifiedPlayer = localPlayers.get(player.guid);
    console.log(modifiedPlayer);
    if (modifiedPlayer != undefined) {
      modifiedPlayer.score = player.score;
      localPlayers.set(player.guid, modifiedPlayer);
    }
    // Update the RTScore of the team of the player
    let modified = localTeams.get(team.guid);
    if (modified != undefined) {
      modified.score = team.score;
      localTeams.set(team.guid, modified);
    }
    // Calculate the diff
    diff = (
      (localTeams.get(team2)?.score?.accuracy ?? 1) - (localTeams.get(team1)?.score?.accuracy ?? 1)) * 100;
  });
  let int: NodeJS.Timer;

  onMount(() => {
    int = setInterval(() => {
      io.emit("updateState");
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(int);
  });

  const trunc = (input: string) =>
    input.length > 10 ? `${input.substring(0, 10)}...` : input;
  
  const songTrunc = (input: string) => 
    input.length > 25 ? `${input.substring(0, 25)}...` : input;
</script>

<div class="flex-col w-full h-full">
  <DiffBar bind:diff />
  <div class="flex items-center justify-center">
    <div class="flex-col">
      {#if team1 !== undefined}
        <GameView
          playerName={localPlayers.get(player1)?.name}
          accuracy={Math.round((localPlayers.get(player1)?.score?.accuracy ?? 1) * 10000) / 100}
          missCount={localPlayers.get(player1)?.score?.misscount ?? 0}
          steamId={localPlayers.get(player1)?.steamid}
          scale={globalScale}
          muted={false}
        />
        <GameView
          playerName={localPlayers.get(player2)?.name}
          accuracy={Math.round((localPlayers.get(player2)?.score?.accuracy ?? 1) * 10000) / 100}
          missCount={localPlayers.get(player2)?.score?.misscount ?? 0}
          steamId={localPlayers.get(player2)?.steamid}
          scale={globalScale}
          muted={true}
          bottom={true}
        />
      {/if}
      <!-- <GameView playerName="!!!" scale={globalScale} muted={true} pos={1} /> -->
    </div>

    <div class="flex-col w-full">
      <div class="flex m-10 mb-28">
        <ScoreCluster teamGUID={localTeams.get(team1)?.guid} />
        <div class="flex-grow" />
      </div>
      <div class="flex mx-7">
        <ScoreLine points={localTeams.get(team1)?.score?.points ?? 0} />
        <div class="flex-grow" />
        <ScoreLine points={localTeams.get(team2)?.score?.points ?? 0} />
      </div>
      <div class="flex m-10 mt-28">
        <div class="flex-grow" />
        <ScoreCluster flipped={true} teamGUID={localTeams.get(team2)?.guid} />
      </div>
    </div>

    <div class="flex-col">
      {#if team2 !== undefined}
        <GameView
          playerName={localPlayers.get(player3)?.name}
          accuracy={Math.round((localPlayers.get(player3)?.score?.accuracy ?? 1) * 10000) / 100}
          missCount={localPlayers.get(player3)?.score?.misscount ?? 0}
          steamId={localPlayers.get(player3)?.steamid}
          scale={globalScale}
          muted={true}
          flipped={true}
        />
        <GameView
          playerName={localPlayers.get(player4)?.name}
          accuracy={Math.round((localPlayers.get(player4)?.score?.accuracy ?? 1) * 10000) / 100}
          missCount={localPlayers.get(player4)?.score?.misscount ?? 0}
          steamId={localPlayers.get(player4)?.steamid}
          scale={globalScale}
          muted={true}
          flipped={true}
          bottom={true}
        />
      {/if}
    </div>
  </div>
  <div class="flex items-center justify-center">
    <TeamInfo
      avatar={localTeams.get(team1)?.avatar}
      name={localTeams.get(team1)?.name}
      members={`${trunc(localPlayers.get(player1)?.name ?? "")} & ${trunc(localPlayers.get(player2)?.name ?? "")}`}
    />
    <div class="w-full" />
    <TeamInfo
      flipped={true}
      avatar={localTeams.get(team2)?.avatar}
      name={localTeams.get(team2)?.name}
      members={`${trunc(localPlayers.get(player3)?.name ?? "")} & ${trunc(localPlayers.get(player4)?.name ?? "")}`}
    />
  </div>
  <div class="flex items-center justify-center h-full">
    <SongTitle
      songName={song?.name ?? "Loading..."}
      songDiff={song?.difficulty ?? "Loading..."}
    />
    <!-- <marquee
  direction="down"
  width="250"
  height="200"
  behavior="alternate"
  style="border:solid">
  <marquee class="text-white" behavior="alternate"> seven twenty seven </marquee>
</marquee> -->
  </div>
</div>
