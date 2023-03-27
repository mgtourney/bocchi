<script lang="ts">
  import ScoreLine from "$lib/components/ScoreLine.svelte";
  import GameView from "$lib/components/GameView/GameView.svelte";
  import DiffBar from "$lib/components/DiffBar.svelte";
  import ScoreCluster from "$lib/components/ScoreCluster.svelte";
  import TeamInfo from "$lib/components/TeamInfo.svelte";
  import SongTitle from "$lib/components/SongTitle.svelte";
  import { ta } from "$lib/realtime";
  import type { Models, Client } from "tournament-assistant-client";
  import { GameDifficulty } from "$lib/constants"; //! <<< <3

  let diff: number = 100;
  let globalScale = 0.412;

  setInterval(() => {
    diff = diff - 5;
  }, 5000);

  let songName: string;
  let songDiff: string;

  setInterval(() => {
    ta.State.matches.flatMap((e: Models.Match) => {
      if (e.has_selected_level) {
        songName = e.selected_level.name;
      }
      if (e.selected_difficulty != undefined && e.selected_difficulty != null) {
        songDiff = GameDifficulty[e.selected_difficulty] == undefined 
        ? "" : GameDifficulty[e.selected_difficulty];
      }
    });
  }, 3000);
</script>

<div class="flex-col w-full h-full">
  <DiffBar bind:diff />
  <div class="flex items-center justify-center">
    <div class="flex-col">
      <GameView playerName="!!!" scale={globalScale} muted={true} pos={0} />
      <GameView playerName="!!!" scale={globalScale} muted={false} pos={1} />
    </div>

    <div class="flex-col w-full">
      <div class="flex m-10 mb-28">
        <ScoreCluster />
        <div class="flex-grow" />
      </div>
      <div class="flex mx-7">
        <ScoreLine points={1} />
        <div class="flex-grow" />
        <ScoreLine points={2} />
      </div>
      <div class="flex m-10 mt-28">
        <div class="flex-grow" />
        <ScoreCluster flipped={true} />
      </div>
    </div>

    <div class="flex-col">
      <GameView playerName="!!!" scale={globalScale} muted={true} pos={2} />
      <GameView playerName="!!!" scale={globalScale} muted={true} pos={3} />
    </div>
  </div>
  <div class="flex items-center justify-center">
    <TeamInfo pos={0} avatar={"https://i.imgur.com/X29Xuha.png"} />
    <div class="w-full" />
    <TeamInfo pos={1} avatar={"https://i.imgur.com/X29Xuha.png"} />
  </div>
  <div class="flex h-full items-center justify-center">
    <SongTitle bind:songName bind:songDiff />
  </div>
</div>
