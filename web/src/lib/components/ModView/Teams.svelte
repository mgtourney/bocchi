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

<div class="flex flex-row justify-center items-center h-screen">
  <div
    class="flex flex-row text-white text-2xl font-bold justify-center items-center bg-gray-700 rounded border border-gray-400 p-4 h-screen"
  >
    <table class="table-auto border-collapse border border-gray-400">
      <thead class="bg-gray-800">
        <tr>
          <th class="border p-2">Team ID</th>
          <th class="border p-2">Logo URL</th>
          <th class="border p-2">Name</th>
          <th class="border p-2">Action</th>
        </tr>
      </thead>
      <tbody class="bg-gray-700">
        {#each teams as team}
          <tr>
            <td class="border p-2">{team.id}</td>
            <td class="border p-2">
              <img src={team.logo} alt="Team logo"/>
            </td>
            <td class="border p-2">{team.name}</td>
            <td class="border p-2">
              <button
                class="bg-gray-800 rounded border border-gray-400"
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
    class="flex flex-row text-white text-2xl font-bold h-full justify-center items-center"
  >
    <div
      class="flex flex-col justify-center items-center bg-gray-700 rounded border border-gray-400 p-4 h-screen"
    >
      <input
        type="text"
        bind:value={name}
        placeholder="Name"
        class="mb-2 bg-gray-800 rounded border border-gray-400"
      />
      <input
        type="text"
        bind:value={logo}
        placeholder="Logo (Url)"
        class="mb-2 bg-gray-800 rounded border border-gray-400"
      />
      <button
        class="bg-gray-800 rounded border border-gray-400"
        on:click={() => createTeam(name, logo)}
        >Add Team</button
      >
    </div>
  </div>
</div>
