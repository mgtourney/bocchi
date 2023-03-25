<script lang="ts">
  export let playerName = "bobross";
  export let scale: number = 1;
  export let muted: boolean = true;
  let width = 1920 * scale;
  let height = 1080 * scale;
</script>

<div>
  <iframe
    id="{playerName}-twitch"
    title="{playerName}'s stream"
    src="https://player.twitch.tv/?channel={playerName}&height={height}&width={width}&parent=localhost&autoplay=true&muted={muted}"
    {height}
    {width}
    frameborder="0"
    scrolling="no"
    class="rounded-xl shadow-lg pointer-events-none"
  />
</div>
