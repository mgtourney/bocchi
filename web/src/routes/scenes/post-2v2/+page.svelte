<script lang="ts">
  import { type BeatSaverMetadata, getBeatSaverMeta } from '$lib/beatsaver';
  import { GQL } from '$lib/constants';
	import { io } from '$lib/socket';
  import { gql } from 'graphql-request';
  import type { State, Match, Team } from 'shared/relayTypes';
  import { onDestroy, onMount, tick } from 'svelte';

  let match: Match
  let meta: BeatSaverMetadata | undefined
  let localTeams: Map<string, Team> = new Map<string, Team>();

  io.on("state", async ({ selectedMatch } : State) => {
    await tick();

    if (selectedMatch?.song?.id === undefined) return;
    match = selectedMatch
    meta = await getBeatSaverMeta(selectedMatch.song.id.split('_').pop())
    meta = meta

    updateTeams(selectedMatch);
  })

  function updateTeams(match: Match | undefined) {
    let query = gql`
      query GetPlayer($where: PlayerWhereUniqueInput!) {
        getPlayer(where: $where) {
          team
        }
      }
    `;
    let teamsQuery = gql`
      query GetTeam($where: TeamWhereUniqueInput!) {
        getTeam(where: $where) {
          id
          logo
          name
        }
      }
    `;

    match?.players?.map((player) => {
      if (player?.team?.guid == undefined) return;
      GQL.request(query, { where: { steam: player.steamid } }).then(
        (res: any) => {
          GQL.request(teamsQuery, { where: { id: res.getPlayer.team } }).then(
            (res2: any) => {
              let team = player.team!;
              team.avatar = res2.getTeam.logo;
              team.name = res2.getTeam.name;
              localTeams.set(team.guid, team);
            }
          );
        }
      );
      // if(!teamIds.includes(res.getPlayer.team)) teamIds.push(res.getPlayer.team);
    });

    localTeams = localTeams;
  }
    
  let int: NodeJS.Timer;
  onMount(() => {
    io.emit("updateState")
    int = setInterval(() => {
      io.emit("updateState")
    }, 1000)
  })

  onDestroy(() => {
    clearInterval(int)
  })
</script>

<div class="flex w-screen h-screen flex-col justify-center items-center">
  <div class="flex-grow" />
  <div class="flex flex-row justify-center items-center">
    <!-- Team 1 -->
    <div
      class="flex flex-col border-red-500 border mr-[15vw] justify-center items-center"
    >
      <!-- Team Image -->
      <div
        class="flex w-[15vw] aspect-square  justify-center items-center"
      >
      <img alt="team1" src={Array.from(localTeams.values())[0]?.avatar ?? ""}/>
    </div>

      <!-- Team Name -->
      <h1 class="text-white font-bold text-3xl">Team 1 - {Array.from(localTeams.values())[0]?.name ?? ""}</h1>
    </div>
    <!-- Map Card -->
    <div
      class="flex flex-col border border-white bw-3 align-center items-center"
    >
      <!-- Map Icon -->
      <div class="">
        <img src={"https://na.cdn.beatsaver.com/" + match?.song?.id.split('_').pop()?.toLowerCase() + ".jpg"} alt="loading" />
      </div>
      <!-- Map info -->
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-white font-bold text-3xl">
          {meta?.songName ?? ""} by {meta?.levelAuthorName ?? ""}
        </h1>
        <h2 class="text-white font-bold text-3xl">{match?.song?.difficulty}</h2>
      </div>
    </div>
    <!-- Team 2 -->
    <div
      class="flex flex-col border-red-500 border ml-[15vw] justify-center items-center"
    >
      <!-- Team Image -->
      <div
        class="flex w-[15vw] aspect-square  justify-center items-center"
      >
      <img alt="team2" src={Array.from(localTeams.values())[1]?.avatar ?? ""}/>
    </div>

      <!-- Team Name -->
      <h1 class="text-white font-bold text-3xl">Team 2 - {Array.from(localTeams.values())[1]?.name ?? ""}</h1>
    </div>
  </div>

  <!-- Scoreboard -->

  <div class="flex-grow mt-[-7vh]" />
  <!-- Casters -->
  <div class="flex flex-row justify-center items-center">
    <iframe
      title="Casters"
      src="https://reactive.fugi.tech/group"
      width=""
      class="bg-opacity-75 p-3 rounded-xl"
    /> 
  </div>
  
  <div class="h-[1vh]"/>
</div>
