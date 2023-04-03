<script lang="ts">
  import { scenes } from "$lib/constants";
  import { goto } from "$app/navigation";
  import { io } from "$lib/socket";

  function changePage(e: any) {
    goto(`/modview/${e.target.id!}`);
    return null;
  }

  function spinButton(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }): any {
    io.emit("effect", "spin");
  }
</script>

<div class="h-screen text-purple-500">
  <div class="flex flex-col items-center justify-center h-full">
    <div class="bg-[#121212] rounded-lg p-5 shadow-lg text-center">
      <h1 class="text-4xl font-bold shadow-md">Mod View</h1>
      <div class="flex flex-row items-center justify-center">
        {#each scenes as scene}
        <button id={scene.id} on:click={changePage} class="px-4 py-2 m-2 font-bold text-white duration-200 ease-in-out bg-purple-500 rounded hover:bg-purple-600">
          {scene.name}
        </button>
        {/each}
      </div>
      <div class="flex flex-row items-center justify-center">
        <button id="spin" on:click={spinButton} class="px-4 py-2 m-2 font-bold text-white duration-200 ease-in-out bg-purple-500 rounded hover:bg-purple-600 hover:animate-spin">
          SPIN ETERNALLY
        </button>
      </div>
    </div>
  </div>
</div>