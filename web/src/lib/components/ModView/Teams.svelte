<script lang="ts">
  import { GQL } from "$lib/constants";
  import { gql } from "graphql-request";
  import { onMount } from "svelte";

  let teams: any[] = [];

  let name;
  let players;
  let logo;

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
      // console.log(JSON.stringify(val))
      teams = val.teams;
    });
  }

  function deleteTeam(id: number) {
    let query = gql`
      mutation Mutation($where: TeamWhereUniqueInput!) {
        deleteOneTeam(where: $where) {
          id
        }
      }
    `;

    GQL.request(query, { where: { id: id } }).then(() => {
      getTeams();
    });
  }

  function createTeam(name: string, logo: string) {
    let query = gql`
      mutation Mutation($data: TeamCreateInput!) {
        createOneTeam(data: $data) {
          logo
          name
        }
      }
    `;

    GQL.request(query, { data: { name: name, logo: logo } }).then((val) => {
      getTeams();
    })
  }

  onMount(() => {
    setInterval(() => {
      getTeams();
    }, 1000);
  });
</script>

<div class="flex flex-row items-center justify-center h-screen">
  <div class="flex flex-row items-center justify-center h-screen p-4 text-2xl font-bold text-white bg-gray-700 border border-gray-400 rounded">
    <table class="border border-collapse border-gray-400 table-auto">
      <thead class="bg-gray-800">
        <tr>
          <th class="p-2 border">Team ID</th>
          <th class="p-2 border">Logo URL</th>
          <th class="p-2 border">Name</th>
          <th class="p-2 border">Action</th>
        </tr>
      </thead>
      <tbody class="bg-gray-700">
        {#each teams as team}
          <tr>
            <td class="p-2 border">{team.id}</td>
            <td class="p-2 border">
              <img src={team.logo} alt="Team logo" class="w-28"/>
            </td>
            <td class="p-2 border">{team.name}</td>
            <td class="p-2 border">
              <button
                class="bg-gray-800 border border-gray-400 rounded"
                on:click={() => deleteTeam(team.id)}
                >Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div
    class="flex flex-row items-center justify-center h-full text-2xl font-bold text-white"
  >
    <div
      class="flex flex-col items-center justify-center h-screen p-4 bg-gray-700 border border-gray-400 rounded"
    >
      <input
        type="text"
        bind:value={name}
        placeholder="Name"
        class="mb-2 bg-gray-800 border border-gray-400 rounded"
      />
      <input
        type="text"
        bind:value={logo}
        placeholder="Logo (Url)"
        class="mb-2 bg-gray-800 border border-gray-400 rounded"
      />
      <button
        class="bg-gray-800 border border-gray-400 rounded"
        on:click={() => createTeam(name, logo)}
        >Add Team</button
      >
    </div>
  </div>
</div>
