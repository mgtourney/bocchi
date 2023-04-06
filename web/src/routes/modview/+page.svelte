<script lang="ts">
  import { scenes, settings } from "$lib/constants";
  import { goto } from "$app/navigation";
  import { io } from "$lib/socket";

  function changePage(e: any) {
    goto(`/modview/${e.target.id!}`);
    return null;
  }

  function spinButton(
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
  ): any {
    io.emit("effect", "spin");
  }
</script>

<div class="h-screen text-purple-500">
  <div class="flex items-center justify-center h-screen">
    <div
      class="
    bg-[#121212] rounded-lg bg-opacity-80 shadow-lg
    text-center border-purple-500 border-4 border-opacity-40"
    >
      <h1 class="p-3 text-4xl font-bold shadow-md">Mod View</h1>

      <!-- Seperator -->
      <span class="flex items-center justify-center w-full">
        <hr class="w-1/2 border-2 border-purple-500" />
      </span>

      <!-- Scenes -->
      <div class="flex flex-col items-center justify-center">
        <h1 class="p-3 text-2xl font-bold">Switch Scene</h1>
        <div
          class="flex flex-row flex-wrap items-center justify-center gap-1 pb-3 w-[20vw]"
        >
          {#each scenes as scene}
            <button
              id={scene.id}
              on:click={changePage}
              class="px-4 py-2 font-bold text-white bg-red-600 rounded hover:bg-red-300"
            >
              {scene.name}
            </button>
          {/each}
        </div>
      </div>

      <!-- Seperator -->
      <span class="flex items-center justify-center w-full">
        <hr class="w-1/2 border-2 border-purple-500" />
      </span>

      <!-- Effects -->
      <div class="flex flex-col items-center justify-center pb-3">
        <h1 class="p-3 text-2xl font-bold">Effects</h1>
        <div
          class="flex flex-row items-center justify-center flex-wrap w-[25vw] gap-1"
        >
          <button
            on:click={spinButton}
            class="px-4 py-2 font-bold text-white bg-purple-500 rounded hover:bg-purple-700"
          >
            Spin
          </button>
        </div>
      </div>

      <!-- Seperator -->
      <span class="flex items-center justify-center w-full">
        <hr class="w-1/2 border-2 border-purple-500" />
      </span>

      <!-- Admin -->
      <div class="flex flex-col items-center justify-center">
        <h1 class="p-3 text-2xl font-bold">Admin</h1>
        <div
          class="flex flex-row items-center justify-center flex-wrap gap-1 w-[25vw] pb-3"
        >
          {#each settings as setting}
            <button
              id={setting.id}
              on:click={changePage}
              class="px-4 py-2 font-bold text-white bg-purple-500 rounded hover:bg-purple-700"
            >
              {setting.name}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
