<script lang="ts">
  import { io } from "$lib/socket";
  import { Models, Packets } from "tournament-assistant-client";
  import type { Match, Player, State } from "$lib/relayTypes";

  function redirectToMatch(e: any) {
    if (e.target == null) return;
    // console.log(e.target.id);

    io.emit("ChangeScene", {
      page: "2v2",
      slug: `/${e.target.id}`,
    });

    io.emit("SetMatch", e.target.id);
  }

  function formatPlayers(players: Map<string,Player> | undefined) {
    const iterPlayers = players?.values() ?? [];

    return Array.from(iterPlayers).flatMap((player: Player) => player.name).join(" ");
  }

  let eMatches: Match[] = [];
  io.on("state", ({ matches }: State) => {
    eMatches = Array.from(matches.values());
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
        {#if eMatches.length == 0}
          <tr>
            <td class="border px-4 py-2 text-center" colspan="4">No Matches</td>
          </tr>
        {/if}
        {#each eMatches as match}
          <tr>
            <td class="border px-4 py-2 text-center">{match.guid}</td>
            <td class="border px-4 py-2 text-center"
              >{match.coordinator.name}</td
            >
            <td class="border px-4 py-2 text-center">
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
      </tbody>
    </table>
  </div>
</div>
