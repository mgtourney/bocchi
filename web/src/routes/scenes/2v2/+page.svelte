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
  import { onMount, onDestroy, tick } from "svelte";

  //! The meaning of life, the universe, and everything.
  //! If you change this number, you will be cursed by the gods of the internet.
  let globalScale = 0.41203703703703727; 

  let team1: string;
  let team2: string;
  let localTeams: Map<string, Team> = new Map<string, Team>();
  
  let player1: string;
  let player2: string;
  let player3: string;
  let player4: string;
  let localPlayers: Map<string, Player> = new Map<string, Player>();
  
  let diff: number = 0;
  let song: Song | undefined;

  // please for the love of god end me.  - niko@velvet.moe
  let qTeams: any[] = []

  function updateTeam(id: string) {
    let query = gql`
      query Query($where: PlayerWhereUniqueInput!) {
        getPlayer(where: $where) {
          team
        }
      }
    `;
    GQL.request(query, { where: { steam: id } }).then((val: any) => {
      //console.log(val)
      let query = gql`
        query Query($where: TeamWhereUniqueInput!) {
          getTeam(where: $where) {
            name
            logo
            id
          }
        }
      `;

      GQL.request(query, { where: { id: val.getPlayer.team } }).then(
        (val: any) => {
          if (val.getTeam != null) {
            if (!qTeams.includes(val.getTeam))
              qTeams.push(val.getTeam);
              qTeams = qTeams;
          }
        }
      );
    });
  }

  io.on("state", async ({ teams, players, selectedMatch }: State) => {
    if (teams == undefined || players == undefined || selectedMatch == undefined) return;
    if (players[0].playing ?? false) return;
    
    await tick();

    // Set the guids of the players and teams per teams
    //console.log(teams)
    teams?.forEach((team) => {
      if (team1 == undefined || teams.find((e) => e.guid == team1) == undefined) {
        team1 = team.guid;
        team.playerGUIDs?.forEach((player) => {
          if (player1 == undefined || players?.find((e) => e.guid == player1) == undefined) {
            updateTeam((players?.find((e) => e.guid == player)?.steamid) ?? "")
            player1 = player;
          } else if (player2 == undefined || players?.find((e) => e.guid == player2) == undefined) {
            player2 = player;
          }
        });

      } else if (team2 == undefined || teams.find((e) => e.guid == team2) == undefined) {
        team2 = team.guid;
        team.playerGUIDs?.forEach((player) => {
          if (player3 == undefined || players?.find((e) => e.guid == player3) == undefined) {
            updateTeam((players?.find((e) => e.guid == player)?.steamid) ?? "");
            player3 = player;
          } else if (player4 == undefined || players?.find((e) => e.guid == player4) == undefined) {
            player4 = player;
          }
        });
      }
    });

    // Update the state of everything
    teams?.forEach((team) => localTeams.set(team.guid, team));
    players?.forEach((player) => localPlayers.set(player.guid, player));

    localTeams = localTeams;
    
    song = selectedMatch?.song;
  });

  io.on("realtimeScore", async ({ team, player }: RTState) => {
    // Update the RTScore of the player
    let modifiedPlayer = localPlayers.get(player.guid);
    if (modifiedPlayer != undefined) {
      modifiedPlayer.score = player.score;
      localPlayers.set(player.guid, modifiedPlayer);
      localPlayers = localPlayers;
    }
    // Update the RTScore of the team of the player
    let modifiedTeam = localTeams.get(team.guid);
    if (modifiedTeam != undefined) {
      modifiedTeam.score = team.score;
      localTeams.set(team.guid, modifiedTeam);
      localTeams = localTeams;
    }
    // Calculate the diff
    diff = ((localTeams.get(team2)?.score?.accuracy ?? 1) - (localTeams.get(team1)?.score?.accuracy ?? 1)) * 100;
  });

  let muted = false;
  io.on("toggleMute", () => {
    muted = !muted;
  });

  let spin = false;
  io.on("effect", (data) => {
    if (data === "spin") {
      spin = true;
      setTimeout(() => {
        spin = false;
      }, 1000);
    }
  });

  let int: NodeJS.Timer;

  onMount(() => {
    int = setInterval(() => { // rust async closures when
      io.emit("updateState");
      // console.log(localPlayers);
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
    <div class="flex-col {spin ? 'animate-spin' : ''}">
      {#if team1 !== undefined}
        <GameView
          accuracy={Math.round((localPlayers.get(player1)?.score?.accuracy ?? 1) * 10000) / 100}
          missCount={localPlayers.get(player1)?.score?.totalmisscount ?? 0}
          steamId={localPlayers.get(player1)?.steamid}
          scale={globalScale}
          muted={muted}
        />
        <GameView
          accuracy={Math.round((localPlayers.get(player2)?.score?.accuracy ?? 1) * 10000) / 100}
          missCount={localPlayers.get(player2)?.score?.totalmisscount ?? 0}
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

    <div class="flex-col {spin ? 'animate-spin' : ''}">
      {#if team2 !== undefined}
        <GameView
          accuracy={Math.round((localPlayers.get(player3)?.score?.accuracy ?? 1) * 10000) / 100}
          missCount={localPlayers.get(player3)?.score?.totalmisscount ?? 0}
          steamId={localPlayers.get(player3)?.steamid}
          scale={globalScale}
          muted={true}
          flipped={true}
        />
        <GameView
          accuracy={Math.round((localPlayers.get(player4)?.score?.accuracy ?? 1) * 10000) / 100}
          missCount={localPlayers.get(player4)?.score?.totalmisscount ?? 0}
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
      avatar={qTeams[0]?.logo}
      name={qTeams[0]?.name}
      members={`${trunc(localPlayers.get(player1)?.name ?? "")} & ${trunc(localPlayers.get(player2)?.name ?? "")}`}
    />
    <div class="w-full" />
    <TeamInfo
      flipped={true}
      avatar={qTeams[1]?.logo}
      name={qTeams[1]?.name}
      members={`${trunc(localPlayers.get(player3)?.name ?? "")} & ${trunc(localPlayers.get(player4)?.name ?? "")}`}
    />
  </div>
  <div class="flex items-center justify-center h-full">
    <SongTitle
      songName={song?.name ?? "Loading..."}
      songDiff={song?.difficulty ?? "Loading..."}
    />
  </div>
</div>
