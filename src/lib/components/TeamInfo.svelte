<script lang="ts">
  export let pos: number = 0;
</script>

{#if pos == 0}
  <div
    class="flex flex-row items-center pt-20 pl-6 space-x-3 shadow-xl w-[500px] h-[100px]"
  >
    <!-- Profile Picture -->
    <img
      src={"https://upload.wikimedia.org/wikipedia/commons/a/aa/TwibrightLinksTestCard.png"}
      alt="bobross"
      class="rounded-[28px] w-36 h-36 border-gray-700 border-[6px] shadow-xl bg-opacity-50"
    />

    <!-- Name -->
    <div class="flex flex-col">
      <h1 class="text-4xl font-extrabold text-white text-ellipsis">
        Loading...
      </h1>
      <h2 class="font-medium text-white text-ellipsis">Players: me and you</h2>
    </div>
  </div>
{:else}
  <!-- Mirrored to the right -->
  <div
    class="flex flex-row-reverse items-center pt-20 pr-6 space-x-3 shadow-xl w-[500px] h-[100px] space-x-reverse"
  >
    <!-- Profile Picture -->
    <img
      src={"https://upload.wikimedia.org/wikipedia/commons/a/aa/TwibrightLinksTestCard.png"}
      alt="bobross"
      class="rounded-[28px] w-36 h-36 border-gray-700 border-[6px] shadow-xl bg-opacity-50"
    />

    <!-- Name -->
    <div class="flex flex-col items-end justify-center">
      <h1 class="text-4xl font-extrabold text-white text-ellipsis">
        Loading...
      </h1>
      <h2 class="font-medium text-white text-ellipsis">Players: me and you</h2>
    </div>
  </div>
{/if}
