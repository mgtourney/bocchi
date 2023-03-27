<script lang="ts">
  import StartingSoon from "$lib/components/ModView/StartingSoon.svelte";
  import TwoVTwo from "$lib/components/ModView/TwoVTwo.svelte";
  import Particles from "svelte-particles";
  import { loadFull } from "tsparticles";
  import type { Engine } from "tsparticles-engine";

  import type { PageData } from "./$types";

  export let data: PageData;

  async function particlesInit(engine: Engine) {
    await loadFull(engine);
  }
</script>

<div id="particles" class="bg-[#161616]">
  <Particles
    id="tsparticles"
    url="/assets/modview-particles.json"
    {particlesInit}
  />
</div>

{#if data.path == "starting-soon"}
  <StartingSoon />
{:else if data.path == "2v2"}
  <TwoVTwo />
{/if}

<style>
  #particles {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -5;
  }
</style>
