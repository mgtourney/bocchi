<script lang="ts">
  export let stinger: string;
  export let delay: string;
</script>

{#key stinger}
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    class="w-full h-full object-cover fixed top-0 left-0 z-50"
    autoplay
    playsinline
    disablePictureInPicture
    src="/assets/stream_transition.webm"
  />
{/key}
{#key delay}
  <slot />
{/key}
