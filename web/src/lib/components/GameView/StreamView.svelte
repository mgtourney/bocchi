<script lang="ts">
  export let twitchName = "bobross";
  export let scale: number = 1;
  export let muted: boolean = true;
  export let style: string;

  let width = 1920 * scale;
  let height = 1080 * scale;
</script>

<iframe
  id="{twitchName}-twitch"
  title="{twitchName}'s stream"
  src="https://player.twitch.tv/?channel={twitchName}&height={height}&width={width}&parent=localhost&autoplay=true&muted={muted}&controls=false"
  {height}
  {width}
  frameborder="0"
  scrolling="no"
  class={style}
/>
