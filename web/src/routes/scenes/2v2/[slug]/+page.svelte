<script lang="ts">
  import ScoreLine from "$lib/components/ScoreLine.svelte";
  import GameView from "$lib/components/GameView/GameView.svelte";
  import DiffBar from "$lib/components/DiffBar.svelte";
  import ScoreCluster from "$lib/components/ScoreCluster.svelte";
  import TeamInfo from "$lib/components/TeamInfo.svelte";
  import SongTitle from "$lib/components/SongTitle.svelte";
  import { GameDifficulty } from "$lib/constants";
  import type { Models, Packets, TAEvents } from "tournament-assistant-client";
  import type { PageData } from "./$types";
  import { io } from "$lib/socket";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  export let data: PageData;

  let diff: number = 0;
  let globalScale = 0.412;

  let songName: string;
  let songChar: string;
  let songDiff: string;
  let match: Models.Match | null = null;

  let team1: Models.User[] = [];
  let team2: Models.User[] = [];

  let team2GUIDS;
  let team1GUIDS;
  let team1accMap: Map<string, number> = new Map();
  let team2accMap: Map<string, number> = new Map();
  let team1acc: number = 100;
  let team2acc: number = 100;

  io.on("state", (state: any) => {
    match = state.matches.filter(
      (e: Models.Match) => e.guid == data.matchId
    )[0];
    if (match != undefined) {
      if (match.selected_level != undefined) {
        songName = match.selected_level.name;
        if (match.selected_characteristic != undefined) {
          songChar = match.selected_characteristic.serialized_name;

          songDiff =
            GameDifficulty[match.selected_difficulty] == undefined
              ? "Expert+"
              : GameDifficulty[match.selected_difficulty];
        }
      }

      let _players = match!.associated_users.filter(
        (e) => e != match!.leader && e != state.self.guid
      );
      let players = state.users.filter((e: Models.User) =>
        _players.includes(e.guid)
      );

      team1 = players.filter(
        (e: Models.User) => e.team.id == "c99d666c-0bbb-4530-9803-0d2e1d6034e1"
      );
      team2 = players.filter(
        (e: Models.User) => e.team.id == "c195776a-6307-4cc3-b6f2-f1f122c89c81"
      );
      team1GUIDS = team1.flatMap((e) => e.guid);
      team2GUIDS = team2.flatMap((e) => e.guid);
    }
  });

  onMount(() => {
    let int = setInterval(() => {
      // console.log(team1);
      if (match == undefined) {
        clearInterval(int);
        io.emit("getLastSceneChange");
      }
    }, 1000);
  });

  io.on("realtimeScore", (score: Packets.Push.RealtimeScore) => {
    if (team1GUIDS.includes(score.user_guid)) {
      team1accMap.set(score.user_guid, score.accuracy);
      team1acc =
        Array.from(team1accMap.values()).reduce((a, b) => a + b, 0) * 100;
    }
    if (team2GUIDS.includes(score.user_guid)) {
      team2accMap.set(score.user_guid, score.accuracy);
      team2acc =
        Array.from(team2accMap.values()).reduce((a, b) => a + b, 0) * 100;
    }
    diff = (team2acc - team1acc) * 2;
    // console.log(diff);
  });
</script>

<div class="flex-col w-full h-full">
  <DiffBar bind:diff />
  <div class="flex items-center justify-center">
    <div class="flex-col">
      {#if team1 != undefined}
        {#each team1 as player, index}
          <GameView
            playerName={player.name}
            playerGUID={player.guid}
            playerId={player.user_id}
            scale={globalScale}
            muted={index != 0}
            pos={index}
          />
        {/each}
      {/if}
      <!-- <GameView playerName="!!!" scale={globalScale} muted={true} pos={1} /> -->
    </div>

    <div class="flex-col w-full">
      <div class="flex m-10 mb-28">
        <ScoreCluster teamGUIDS={team1.flatMap((e) => e.guid)} />
        <div class="flex-grow" />
      </div>
      <div class="flex mx-7">
        <ScoreLine points={1} />
        <div class="flex-grow" />
        <ScoreLine points={2} />
      </div>
      <div class="flex m-10 mt-28">
        <div class="flex-grow" />
        <ScoreCluster flipped={true} teamGUIDS={team2.flatMap((e) => e.guid)} />
      </div>
    </div>

    <div class="flex-col">
      {#if team2 != undefined}
        {#each team2 as player, index}
          <GameView
            playerName={player.name}
            playerGUID={player.guid}
            playerId={player.user_id}
            scale={globalScale}
            muted={true}
            pos={index + 2}
          />
        {/each}
      {/if}
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
