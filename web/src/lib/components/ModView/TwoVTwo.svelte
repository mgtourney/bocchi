<script lang="ts">
  import { goto } from "$app/navigation";
  import { io } from "$lib/socket";
  import type { Match, Player, State } from "shared/relayTypes";
  import { onDestroy, onMount } from "svelte";

  
  function redirectToMatch(e: any) {
    if (e.target == null) return;
    // console.log(e.target.id);

    // io.emit("ChangeScene", {
    //   page: "2v2"
    // });

    goto("/modview/match");

    io.emit("SetMatch", e.target.id);
  }

  function formatPlayers(players: Player[] | undefined) {
    console.log(players);
    const iterPlayers = players?.values() ?? [];
    return Array.from(iterPlayers)
      .flatMap((player) => player.name)
      .join(" ");
  }

  let eMatches: Match[] = [];
  io.on("state", (state : State) => {
    eMatches = state.matches;
  });

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
</script>

<div class="flex flex-col">
  <div class="items-center justify-center text-white text-2xl font-bold">
    <table class="table-auto">
      <thead>
        <tr>
          <th class="px-4 py-2">Match ID</th>
          <th class="px-4 py-2">Coordinator</th>
          <th class="px-4 py-2">Players</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#if eMatches.length === 0}
          <tr>
            <td class="border px-4 py-2 text-center" colspan="4">No Matches</td>
          </tr>
        {:else}
          {#each eMatches as match}
            <tr>
              <td class="border px-4 py-2 text-center">{match.guid}</td>
              <td class="border px-4 py-2 text-center"
                >{match.coordinator.name}</td
              >
              <td class="border px-4 py-2 text-center text-ellipsis">
                {formatPlayers(match.players)}
              </td>
              <td>
                <button
                  id={match.guid}
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
                  on:click={redirectToMatch}
                >
                  Select Match
                </button>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
