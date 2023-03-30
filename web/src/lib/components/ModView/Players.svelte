<script lang="ts">
  import { onMount } from "svelte";
  import { request, gql } from "graphql-request";
  import { GQL } from "$lib/constants";

  let steamid: string = "";
  let name: string = "";
  let twitch: string = "";
  let discord: string = "";
  let team: number;

  let players: any = [];
  let teams: any = [];

  function GetAllPlayers() {
    request(
      "http://localhost:4000/graphql",
      `
    query GetAllPlayers {
    players {
      name
      steam
      team
      socials {
        discord,
        twitch
      }    
    }
  }`
    )
      .then((data: any) => {
        players = data.players;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function addPlayer(
    steam: string,
    name: string,
    twitch: string,
    discord: string,
    team: number | null
  ) {
    let mutation = gql`
      mutation CreateOnePlayer($data: PlayerCreateInput!) {
        createOnePlayer(data: $data) {
          name
          steam
          team
          socials {
            twitch
            steam
            discord
          }
        }
      }
    `;

    let varible = {
      data: {
        name: name,
        team: team,
        socials: {
          create: {
            twitch: twitch,
            discord: discord,
            steam: steam,
          },
        },
      },
    };

    GQL.request(mutation, varible).then((val:any ) => {
      GetAllPlayers();
    });
  }

  function deletePlayer(steam: string) {
    let mutation = gql`
      mutation DeleteOnePlayer($where: PlayerWhereUniqueInput!, $socialsWhere: SocialsWhereUniqueInput!) {
        deleteOnePlayer(where: $where) {
          name
          steam
          socials {
            twitch
            steam
            discord
          }
        }
        
        deleteOneSocials(where: $socialsWhere) {
          twitch
          steam
          discord
        }
      }
    `;

    let varible = {
      where: {
        steam,
      },
      socialsWhere: {
        steam
      }
    };

    GQL.request(mutation, varible).then((val:any ) => {
      GetAllPlayers()
    });
  }

  function getTeams() {
    let query = gql`
      query Query {
        teams {
          name
          logo
          id
        }
      }
    `;

    GQL.request(query, {}).then((val: any) => {
      teams = val.teams;
    });
  }

  onMount(() => {
    GetAllPlayers();
    getTeams();
  });
</script>

<div class="flex flex-row justify-center items-center h-screen">
  <div
    class="flex flex-row text-white text-2xl font-bold justify-center items-center bg-gray-700 rounded border border-gray-400 p-4 h-screen"
  >
    <table class="table-auto border-collapse border border-gray-400">
      <thead class="bg-gray-800">
        <tr>
          <th class="border p-2">Steam ID</th>
          <th class="border p-2">Name</th>
          <th class="border p-2">Team</th>
          <th class="border p-2">Twitch</th>
          <th class="border p-2">Discord</th>
          <th class="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-gray-700">
        {#each players as player}
          <tr>
            <td class="border p-2">{player.steam}</td>
            <td class="border p-2">{player.name}</td>
            <td class="border p-2">{teams.filter((e) => e.id == player.team).flatMap((e) => e.name)}</td>
            <td class="border p-2">{player.socials?.twitch}</td>
            <td class="border p-2">{player.socials?.discord}</td>
            <td class="border p-2">
              <button
                class="bg-gray-800 rounded border border-gray-400"
                on:click={() => deletePlayer(player.steam)}>Delete</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div
    class="flex flex-row text-white text-2xl font-bold h-full justify-center items-center"
  >
    <div
      class="flex flex-col justify-center items-center bg-gray-700 rounded border border-gray-400 p-4 h-screen"
    >
      <input
        type="text"
        bind:value={steamid}
        placeholder="Steam ID"
        class="mb-2 bg-gray-800 rounded border border-gray-400"
      />
      <input
        type="text"
        bind:value={name}
        placeholder="Name"
        class="mb-2 bg-gray-800 rounded border border-gray-400"
      />
      <input
        type="text"
        bind:value={twitch}
        placeholder="Twitch"
        class="mb-2 bg-gray-800 rounded border border-gray-400"
      />
      <input
        type="text"
        bind:value={discord}
        placeholder="Discord"
        class="mb-2 bg-gray-800 rounded border border-gray-400"
      />
      <label for="team_select">Select A Team</label>
      <select bind:value={team} id="team_select" class="mb-2 bg-gray-800 rounded border border-gray-400" >
        <option value={null}>No Team</option>
        {#each teams as t}
          <option value={t.id}>{t.name}</option>
        {/each}
      </select>
      <button
        class="bg-gray-800 rounded border border-gray-400"
        on:click={() => addPlayer(steamid, name, twitch, discord, team)}
        >Add Player</button
      >
    </div>
  </div>
</div>
