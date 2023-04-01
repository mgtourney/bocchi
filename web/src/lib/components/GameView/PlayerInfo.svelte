<script lang="ts">
  import { getPlayerInfoFull, type PlayerInfoFull } from "$lib/scoresaber";
  import { onMount } from "svelte";
  import MiniScoreCluster from "$lib/components/GameView/MiniScoreCluster.svelte";

  export let playerName: string;
  export let playerId: string = "1";
  export let flipped: boolean = false;

  export let accuracy: number;
  export let missCount: number;

  let data: PlayerInfoFull | null = null;
  onMount(async () => {
    data = await getPlayerInfoFull(playerId)!;
    // console.log(data);
  });
</script>

{#if flipped}
<!-- Anchor this to the right side of the screen  -->
<div class="relative bottom-[105px] w-0 h-0 float-right right-[790px]">
  <div
    class="flex flex-row-reverse items-center rounded-xl p-5 space-x-3
      absolute w-[790px] h-[90px] space-x-reverse"
  >
    <!-- Profile Picture -->
    <img
      src={data == null ? "/assets/loading.png" : data.profilePicture}
      alt="bobross"
      class="rounded-[15px] w-[70px] h-[70px] border-gray-700 border-[3px] shadow-xl bg-opacity-30 ease-in-out duration-500"
    />

    <!-- Flag  -->
    <div class="flex flex-col items-end justify-center w-[300px]">
      <img
        src={data == null
          ? "https://cdn.ipregistry.co/flags/twemoji/aq.svg"
          : `https://cdn.ipregistry.co/flags/twemoji/${data.country.toLowerCase()}.svg`}
        alt={data == null ? "" : data.country}
        class="w-6 ease-in-out duration-500"
      />

      <!-- Name -->
      <h1 class="text-3xl leading-10 font-bold text-[#FFFFFFC0] text-ellipsis ease-in-out duration-500">
        {playerName}
      </h1>
    </div>
    <div class="w-full"/>
    <MiniScoreCluster bind:accuracy bind:missCount/>
  </div>
</div>
{:else}
<div class="relative bottom-[105px] w-0 h-0">
  <div
    class="flex flex-row items-center rounded-xl p-5 space-x-3
      absolute w-[790px] h-[90px]"
  >
    <!-- Profile Picture -->
    <img
      src={data == null ? "/assets/loading.png" : data.profilePicture}
      alt="bobross"
      class="rounded-[15px] w-[70px] h-[70px] border-gray-700 border-[3px] shadow-xl bg-opacity-30 ease-in-out duration-500"
    />

    <!-- Flag  -->
    <div class="flex flex-col w-[300px]">
      <img
        src={data == null
          ? "https://cdn.ipregistry.co/flags/twemoji/aq.svg"
          : `https://cdn.ipregistry.co/flags/twemoji/${data.country.toLowerCase()}.svg`}
        alt={data == null ? "" : data.country}
        class="w-6"
      />

      <!-- Name -->
      <h1 class="text-3xl leading-10 font-bold text-[#FFFFFFC0] text-ellipsis">
        {playerName}
      </h1>
    </div>
    <div class="w-full"/>
    <MiniScoreCluster flipped={true} bind:accuracy bind:missCount/>
  </div>
</div>
{/if}