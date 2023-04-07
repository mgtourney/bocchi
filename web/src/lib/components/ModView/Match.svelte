<script lang="ts">
  import { io } from "$lib/socket";
  import type { State, Match, Player, Team } from "shared/relayTypes";
  import { onDestroy, onMount, tick } from "svelte";
  import { request, gql } from "graphql-request";
  import { GQL } from "$lib/constants";
  import DiffBar from "../DiffBar.svelte";

  let team_points: Map<string, number> = new Map<string, number>();
  let localTeams: Map<string, Team> = new Map<string, Team>();

  function changePlus(e: any) {
    if (e.target.id == undefined) return;
    const lTeam = localTeams.get(e.target.id);
    if (lTeam?.score?.points == undefined) return;

    e.target.disabled = true;
    setTimeout(() => {
      e.target.disabled = false;
    }, 5000);

    lTeam.score.points++;
    localTeams.set(lTeam.guid, lTeam);
    localTeams = localTeams;
    io.emit("setTeamPoints", lTeam.guid, lTeam.score.points);
    io.emit("updateState");
  }

  function changeMinus(e: any) {
    if (e.target.id == undefined) return;
    const lTeam = localTeams.get(e.target.id);
    if (lTeam?.score?.points == undefined) return;
    if (lTeam?.score?.points <= 0) return; // gg

    e.target.disabled = true;
    setTimeout(() => {
      e.target.disabled = false;
    }, 5000);

    lTeam.score.points--;
    localTeams.set(lTeam.guid, lTeam);
    localTeams = localTeams;
    io.emit("setTeamPoints", lTeam.guid, lTeam.score.points);
    io.emit("updateState");
  }

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

  io.on("state", async (state: State) => {
    await tick();
    updateTeams(state.selectedMatch);
  });

  function redirectToMatch(e: any) {
    if (e.target == null) return;
    io.emit("ChangeScene", {
        page: "2v2",
    });
  }

  function redirectToPost(e: any) {
    if (e.target == null) return;
    io.emit("ChangeScene", {
        page: "post-2v2",
    });
  }


  let int: NodeJS.Timer;

  onMount(() => {
    if (int == undefined) {
      int = setInterval(() => {
        io.emit("updateState");
      }, 1000);
    }
  });

  onDestroy(() => {
    clearInterval(int);
  });


  function activateScene(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
    throw new Error("Function not implemented.");
  }
</script>

<div class="flex flex-col items-center justify-center w-screen h-screen">
  <div class="flex flex-row flex-wrap items-center justify-center gap-3">
    {#each Array.from(localTeams.values()) as team}
      <div
        class="flex flex-col items-center justify-center p-3 text-center border-4 border-purple-500 rounded-lg shadow-lg bw-3 bg-opacity-80 border-opacity-40 aspect-square"
        style={`background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${team.avatar}'); background-size: cover;`}
      >
        <!-- Header -->
        <h2 class="flex text-3xl text-white text-bold">{team.name}</h2>

        <!-- Seperator -->
        <span class="flex items-center justify-center w-full">
          <hr class="w-1/2 border-2 border-purple-500" />
        </span>

        <!-- Up chevron button -->
        <div class="p-2">
          <button
            id={team.guid}
            class="flex items-center justify-center w-[25vw] p-2 text-5xl text-white bg-purple-500 rounded text-bold disabled:grayscale disabled:cursor-not-allowed"
            on:click={changePlus}
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          </button>
        </div>

        <!-- Points Display -->
        <h1 class="flex p-1 text-4xl text-white">{team?.score?.points}</h1>

        <!-- Down chevron button -->
        <div class="p-2">
          <button
            id={team.guid}
            class="flex items-center justify-center w-[25vw] p-2 text-5xl text-white bg-purple-500 rounded text-bold disabled:grayscale disabled:cursor-not-allowed"
            on:click={changeMinus}
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex flex-row flex-wrap items-center justify-center gap-3 py-3">
    <button
      class="flex items-center justify-center w-[25vw] p-2 text-5xl text-white bg-purple-500 rounded text-bold"
      on:click={redirectToMatch}>Activate Scene</button
    >
    <button
      class="flex items-center justify-center w-[25vw] p-2 text-5xl text-white bg-purple-500 rounded text-bold"
      on:click={redirectToPost}>Post 2v2</button
    >
  </div>
</div>
