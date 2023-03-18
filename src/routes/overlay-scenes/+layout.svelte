<section class="h-[100vh]">
	<div class="fixed top-0 left-0 w-full h-full z-[-2] bg-stone-900" />
	<video
		class="object-cover w-full h-full fixed top-0 left-0 z-[-1] filter brightness-50"
		autoplay
		loop
		muted
		playsinline
		src="/assets/BGVid.mp4"
	/>

	<!-- Use a slot to load in the content for the page -->
	<slot />
</section>

<style>
	video {
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
