<script lang="ts">
  import TeamInfo from "$lib/components/TeamInfo.svelte";
  import SongInfo from "$lib/components/SongInfo.svelte";
  import { getPool, type Pool, type BkSong } from "$lib/beatkhana";
  import { onMount } from "svelte";
  import { io } from "$lib/socket";

  let torunyId = "2147484271";
  let poolName = "Grand Finals";

  let pool: Pool | undefined;
  onMount(() => {
    getPool(torunyId).then((e) => {
      pool = e.find((e) => e.poolName == poolName);
    });
  });

  let doSpin = false;

  io.on("effect", (type: string) => {
    switch (type) {
      case "spin":
        doSpin = true;
        setTimeout(() => {
          doSpin = false;
        }, 1000);
        break;

      default:
        break;
    }
  });

  function justify(e: number | undefined) {
    if (e === undefined) return "justify-center";
    if (e === 0) return "justify-start";
    if (e === 1) return "justify-end";
  }
</script>

<div class="flex flex-col justify-center h-full align-center">
  <div class="flex items-center justify-center">
    <!-- <TeamInfo
      avatar={localTeams.get(team1)?.avatar}
      name={localTeams.get(team1)?.name}
      members={`${trunc(localPlayers.get(player1)?.name ?? "")} & ${trunc(localPlayers.get(player2)?.name ?? "")}`}
    /> -->
    <TeamInfo avatar="/assets/loading.png" name="Team Orange" members="" />
    <div class="w-full" />
    <!-- <TeamInfo
      flipped={true}
      avatar={localTeams.get(team2)?.avatar}
      name={localTeams.get(team2)?.name}
      members={`${trunc(localPlayers.get(player3)?.name ?? "")} & ${trunc(localPlayers.get(player4)?.name ?? "")}`}
    /> -->
    <TeamInfo flipped={true} avatar="/assets/loading.png" name="Team Blue" members="" />
  </div>
	<div class="flex h-[50px]"/>
  <div class="flex flex-col justify-center align-center flex-nowrap">
    {#each pool?.songs ?? [] as song}
      <div class="flex flex-row {justify(song.team)} w-full">
        <SongInfo
          banned={song.banned}
          hash={song.hash}
          title={song.name + " / " + song.songAuthor}
          diff={song.diff}
          artist={song.levelAuthor}
          bind:doSpin
        />
      </div>
    {/each}
  </div>
</div>
