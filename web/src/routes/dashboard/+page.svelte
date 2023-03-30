<script lang="ts">
  import { loadFull } from "tsparticles";
  import type { Engine } from "tsparticles-engine";
  import Particles from "svelte-particles";
  import { Models } from "tournament-assistant-client";
  import { io } from "$lib/socket";

  let matches: any[] = []

  async function particlesInit(engine: Engine) {
    await loadFull(engine);
  }

  let eMatches: any[] = [];
  
  io.on("state", (state: any) => {
    eMatches = state.matches.map((match: Models.Match) => {
      return {
        guid: match.guid,
        coordinator: state.users.find(
          (user: Models.User) => user.guid == match.leader
        ),
        players: match.associated_users.map((userGuid: string) =>
          state.users.find(
            (user: Models.User) =>
              user.guid == userGuid &&
              user.client_type == Models.User.ClientTypes.Player
          )
        ),
      };
    });
  });
</script>

<div id="particles" class="bg-[#161616]">
  <Particles
    id="tsparticles"
    url="/assets/modview-particles.json"
    {particlesInit}
  />
</div>

{#each eMatches as match}
  <table class="">
    <thead class="bg-gray-800">

    </thead>
  </table>
{/each}

<style>
  #particles {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -5;
  }
</style>
