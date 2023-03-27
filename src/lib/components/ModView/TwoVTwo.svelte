<script lang="ts">
  import type { Models } from "tournament-assistant-client";
  import { ta } from "$lib/realtime";

  let matches: Models.Match[] = [];
  let users: Models.User[] = [];

  let eMatches: any = [];

  setInterval(() => {
    matches = ta.State.matches;
    users = ta.State.users;

    eMatches = matches.map((e) => {
      let players = users.filter((u) => e.associated_users.includes(u.guid) && u.guid != e.leader);

      return {
        guid: e.guid,
        leader: e.leader,
        players: players.map((p) => {
          return {
            guid: p.guid,
            name: p.name,
          };
        }),
      };
    });
  }, 500);
</script>

<div class="flex">
  <div class="flex flex-col justify-center text-white">
    {#each eMatches as match}
      <p class="text-2xl font-bold">{match.guid}</p>
      <p class="text-2xl italic">{match.leader}</p>
	  <div class="flex text-gray-500">
		  {match.players.join(", ")}
	  </div>
    {/each}
  </div>
</div>
