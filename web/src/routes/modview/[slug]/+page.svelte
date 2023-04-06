<script lang="ts">
  import StartingSoon from "$lib/components/ModView/StartingSoon.svelte";
  import TwoVTwo from "$lib/components/ModView/TwoVTwo.svelte";
  import Players from "$lib/components/ModView/Players.svelte";
  import Teams from "$lib/components/ModView/Teams.svelte";
  import Match from "$lib/components/ModView/Match.svelte";

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

{#if data.path === "starting-soon"}
  <StartingSoon />
{:else if data.path === "2v2"}
  <TwoVTwo />
{:else if data.path === "players"}
  <Players />
{:else if data.path === "teams"}
  <Teams />
{:else if data.path === "match"}
  <Match />
{/if}
