<script lang="ts">
  import { scenes } from "./data";
  import { io } from "$lib/realtime";
  import Particles from "svelte-particles";
  import SettingsModal from "$lib/components/SettingsModal.svelte"
	import { loadFull } from 'tsparticles';
  import type { Engine } from "tsparticles-engine";

  let liveButton: Element;
  
  // Modal stuff
  let showModal = false;
  let modalData: Object;

  async function particlesInit(engine: Engine) {
      await loadFull(engine);
  };

  function changeScene(e: any) {
    console.log(e.target.id)
    if (e.target === null) return;
    if (liveButton != undefined && liveButton != null) { liveButton.classList.remove("bg-red-500") }

    liveButton = e.target
    liveButton.classList.add("bg-red-500")
    
    io.emit("message", {
      type: "ChangeScene",
      page: `${e.target.id}`,
      data: {},
    })
  }
</script>

<div id="particles" class="bg-[#161616]">
  <Particles id="tsparticles" 
  url="/assets/modview-particles.json"
  particlesInit="{particlesInit}"/>
</div>

<div class="text-purple-500 h-screen">
  <div class="flex flex-col justify-center items-center h-full">
    <div class="bg-[#121212] rounded-lg p-5 shadow-lg text-center">
      <h1 class="text-4xl font-bold shadow-md">Mod View</h1>
      <div class="flex flex-row items-center justify-center">
        {#each scenes as scene}
        <button id={scene.id} on:click={changeScene} class="bg-purple-500 text-white font-bold py-2 px-4 rounded m-2 ease-in-out duration-200 hover:bg-purple-600">
          {scene.name}
        </button>
        {/each}
      </div>
    </div>
  </div>
</div>

<SettingsModal bind:showModal bind:modalData>

</SettingsModal>

<style>
  #particles {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -5;
  }
</style>