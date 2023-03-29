<script lang="ts">
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import PageTransition from '$lib/components/PageTransition.svelte';
  import { io } from "$lib/socket";
	export let data;

	onMount(() => {
		if($page.route.id == "/scenes") {
			io.emit("getLastSceneChange");
		}
		io.on("sendLastSceneChange", (msg) => {
			goto(`/scenes/${msg.page}${msg.slug}`);
		})
		io.on("message", (msg) => {
			if(msg.type !== "ChangeScene") { return; }
			// console.log(msg);
			if(msg.page == null) { return; }
			goto(`/scenes/${msg.page}${msg.slug}`);
		});
	})
</script>

<div class="flex-col justify-center items-center">
	<div class="fixed top-0 left-0 w-full h-full z-[-2] bg-stone-900" />
	<video id="bgvid"
		class="object-cover w-full h-full fixed top-0 left-0 z-[-1] filter brightness-50"
		autoplay
		loop
		muted
		playsinline
		disablePictureInPicture
		src="/assets/BGVid.mp4"
	/>

	<!-- Use a slot to load in the content for the page -->
	<PageTransition pathname={data.pathname}>
		<slot />
	</PageTransition>
</div>

<style>
	#bgvid {
		opacity: 0;
		animation: fadeIn 1s ease-in-out forwards;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
