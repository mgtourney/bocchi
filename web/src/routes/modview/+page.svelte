<script lang="ts">
  import { goto } from "$app/navigation";
  import { scenes } from "./data";
  import { io } from "$lib/realtime";
  // onMount(() => {
  //   io.on("message", message => { // Listen to the message event
  //     messages = [...messages, message]
  //   })
  // })

  function changeScene(e: Event) {
    if (e.target === null) return;
    console.log(e.target.id);
    io.emit("message", {
      type: "ChangeScene",
      page: `${e.target.id}`
    })
  }
</script>

<div class="flex bg-gray-800 h-[100vh]">
  <div class="flex flex-col">
    {#each scenes as scene}
      <button
        on:click={changeScene}
        id={`${scene.id}`}
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
      >
        {scene.name}
      </button>
    {/each}
  </div>
</div>
