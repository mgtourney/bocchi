<script lang="ts">
  export let hash: string;
  export let title: string;
  export let artist: string;
  export let diff: string;
  export let doSpin: boolean = false;
  export let banned: boolean | undefined;

  const pickId = (e: boolean | undefined) => {
    if (e === undefined) return "default";
    return banned? "banned" : "picked";
  }
</script>

<div id={pickId(banned)} class="flex flex-row m-1 bg-[#08080860] h-[90px] w-[27vw] {doSpin ? "animate-spin" : ''}">
  <div
    id="map-card"
    class="flex flex-row justify-center w-full h-full shadow-lg"
  >
    <div class="flex flex-row w-full h-full">
      <!-- cover -->
			<img
				id="map-cover"
				class="flex w-20 rounded-bl-[18px] rounded-tl-[18px]"
				src="https://scoresaber.com/imports/images/songs/{hash}.png"
				alt={title}
			/>
      <!-- Info panel -->
      <div class="flex flex-col justify-end w-full h-full text-white">
        <!-- Title -->
        <h1 id="map-title" class="flex pb-[2px] pl-2">{title}</h1>
        <!-- Map metadata panel -->
        <div
          class="flex flex-row w-full bg-[#090909] rounded-br-[18px] bg-opacity-40 justify-end"
        >
          <h2 id="map-artist" class="flex pl-2">{artist}</h2>
          <div class="flex w-full" />
          <h2 id="map-diff" class="flex pr-3 text-right">{diff}</h2>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  #map-card {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  #map-cover {
    position: relative;
    box-shadow: #00000038 0 0 20px 0px;
    clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 100%);
  }

  #map-title {
    font-style: normal;
    font-weight: 700;
    font-size: 1.3em;
  }

  #map-diff {
    font-style: normal;
    font-weight: 900;
    font-size: 1.1em;
  }

  #map-artist {
    font-style: normal;
    font-weight: 600;
    font-size: 1.1em;
    white-space: nowrap;
  }

  #map-icon {
    width: 80px;
    height: 80px;
    clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
  }

  #picked {
    border: 6px solid #ffffffb0;
    border-radius: 25px;
  }

  #banned {
    border: 6px solid #88888830;
    border-radius: 25px;
    filter: grayscale(100%) brightness(80%);
  }

  #default {
    border: 6px solid #aaaaaa80;
    border-radius: 25px;
  }
</style>
