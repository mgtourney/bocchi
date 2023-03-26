<script lang="ts">
  import { getPlayerInfoFull, type PlayerInfoFull } from "$lib/scoresaber";
  import { onMount } from "svelte";
  import MiniScoreCluster from "./MiniScoreCluster.svelte";
  export let playerId = "-1";
  export let pos: number;

  let data: PlayerInfoFull | null = null;
  onMount(async () => {
    data = await getPlayerInfoFull(playerId)!;
    console.log(data);
  });
</script>

{#if pos == 0 || pos == 1}
  <div class="relative bottom-[105px] w-0 h-0">
    <div
      class="flex flex-row items-center rounded-xl p-5 space-x-3
        shadow-xl absolute w-[790px] h-[90px]"
    >
      <!-- Profile Picture -->
      <img
        src={data == null ? "https://upload.wikimedia.org/wikipedia/commons/a/aa/TwibrightLinksTestCard.png" : data.profilePicture}
        alt="bobross"
        class="rounded-xl w-[80px] h-[80px] border-gray-700 border-4 shadow-xl bg-opacity-30"
      />

      <!-- Flag  -->
      <div class="flex flex-col w-[300px]">
        <img
          src={data == null
            ? "https://cdn.ipregistry.co/flags/twemoji/aq.svg"
            : `https://cdn.ipregistry.co/flags/twemoji/${data.country.toLowerCase()}.svg`}
          alt={data == null ? "" : data.country}
          class="w-8"
        />

        <!-- Name -->
        <h1 class="text-4xl font-bold text-white text-ellipsis">
          {data == null ? "Loading..." : data.name}
        </h1>
      </div>
      <div class="w-full"/>
      <MiniScoreCluster flipped={true}/>
    </div>
  </div>
{:else if pos == 2 || pos == 3}
<!-- Anchor this to the right side of the screen  -->
<div class="relative bottom-[105px] w-0 h-0 float-right right-[790px]">
    <div
      class="flex flex-row-reverse items-center rounded-xl p-5 space-x-3
        shadow-xl absolute w-[790px] h-[90px] space-x-reverse"
    >
      <!-- Profile Picture -->
      <img
        src={data == null ? "https://upload.wikimedia.org/wikipedia/commons/a/aa/TwibrightLinksTestCard.png" : data.profilePicture}
        alt="bobross"
        class="rounded-xl w-[80px] h-[80px] border-gray-700 border-4 shadow-xl bg-opacity-30"
      />

      <!-- Flag  -->
      <div class="flex flex-col items-end justify-center w-[300px]">
        <img
          src={data == null
            ? "https://cdn.ipregistry.co/flags/twemoji/aq.svg"
            : `https://cdn.ipregistry.co/flags/twemoji/${data.country.toLowerCase()}.svg`}
          alt={data == null ? "" : data.country}
          class="w-8"
        />

        <!-- Name -->
        <h1 class="text-4xl font-bold text-white text-ellipsis">
          {data == null ? "Loading..." : data.name}
        </h1>
      </div>
      <div class="w-full"/>
      <MiniScoreCluster />
    </div>
    </div>
{/if}
