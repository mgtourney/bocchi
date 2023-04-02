<script lang="ts">
  import { loadFull } from 'tsparticles';
  import type { Engine } from "tsparticles-engine";
  import Particles from "svelte-particles";

  async function particlesInit(engine: Engine) {
      await loadFull(engine);
  }
</script>

<div id="particles" class="bg-[#161616]">
  <Particles id="tsparticles" 
  url="/assets/modview-particles.json"
  particlesInit="{particlesInit}"/>
</div>

<slot />

<style>
  #particles {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -5;
  }
</style>