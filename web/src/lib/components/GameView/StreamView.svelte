<script lang="ts">
  export let twitchName = "bobross";
  export let scale: number = 1;
  export let muted: boolean;
  export let style: string;

  let width = 1920 * scale;
  let height = 1080 * scale;

  let overlaySrc;

  // Wait a random amount of time before loading the iframe (500ms to 1000)
  setTimeout(() => {
    overlaySrc =`https://player.twitch.tv/?channel=${twitchName}&height=${height}&width=${width}&parent=overlay.magnesium.gg&autoplay=true&muted=${muted}&controls=false`;
  }, Math.random() * 5000);
</script>

<iframe
  id="{twitchName}-twitch"
  title="{twitchName}'s stream"
  src={overlaySrc}
  {height}
  {width}
  frameborder="0"
  scrolling="no"
  class={style}
/>
