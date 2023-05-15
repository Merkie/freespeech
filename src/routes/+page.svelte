<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>FreeSpeech AAC - Free and Open-Source AAC For Everyone</title>
	<meta
		name="description"
		content="AAC designed to last, FreeSpeech AAC is a free and open-source AAC app for everyone. Communicate with symbols and text, and generate ultra-realistic AI voices for free."
	/>
</svelte:head>

<div class="bg-zinc-100 border-b border-zinc-300 fixed top-0 left-0 w-screen z-40">
	<div class="w-[90%] max-w-[1200px] p-2 flex items-center mx-auto h-[60px]">
		<img src="/favicon.png" class="mix-blend-multiply" width={40} alt="asdasd" />
		<p class="font-semibold text-lg">FreeSpeech <span class="font-light text-sm">AAC</span></p>
		<div class="flex-1" />
		{#if data.user}
			<a
				class="bg-blue-600 text-blue-50 px-3 p-1 rounded-md ml-4 border border-blue-600 hover:bg-transparent hover:text-blue-600 transition-all"
				href="/app">Go to App <i class="bi bi-box-arrow-in-right" /></a
			>
		{:else}
			<a class="hover:underline" href="/login">Login</a>
			<a
				class="bg-blue-600 text-blue-50 px-3 p-1 rounded-md ml-4 border border-blue-600 hover:bg-transparent hover:text-blue-600 transition-all"
				href="/register">Create Account</a
			>
		{/if}
	</div>
</div>

<main class="min-h-screen bg-zinc-300 flex flex-col mt-[59px]">
	<div
		class="w-[90%] max-w-[1200px] bg-zinc-100 border-x border-zinc-300 flex-1 mx-auto flex flex-col"
	>
		<!-- hero -->
		<div class="hero h-[300px] relative">
			<div
				class="absolute top-0 left-0 w-full h-full bg-[rgba(255,255,255,0.5)] grid place-items-center"
			>
				<h1 class="text-4xl font-bold text-zinc-800 text-center w-fit">
					Free and Open-Source AAC <span class="border-b-8 border-blue-500">For Everyone</span>.
				</h1>
			</div>
		</div>
		<!-- pitch -->
		<div
			class="flex sm:flex-row flex-col items-center justify-center gap-8 sm:gap-16 p-8 border-b border-zinc-300"
		>
			<div class="flex-col items-center justify-center min-w-[160px]">
				<img class="bg-white shadow-md rounded-lg w-fit" src="/favicon.png" width={150} alt="" />
				<p class="font-bold text-center mt-4 text-xl">FreeSpeech AAC</p>
			</div>
			<div class="max-w-[500px] flex flex-col gap-2 text-left">
				<p class="text-xl font-semibold">Turn Tapping into Talking with FreeSpeech AAC</p>
				<p>
					Communication goes beyond the power of speech, and FreeSpeech AAC understands this. As a
					free and open-source AAC (Augmentative and Alternative Communication) app, we provide a
					daily communication tool for children, teens, and adults who may not have the ability to
					speak. The development of language skills is also possible with our easy-to-navigate
					interface. With only a few taps after creating an account and launching the app, users can
					instantly start sharing their thoughts with the world.
				</p>
			</div>
		</div>
		<!-- features -->
		<div class="flex flex-col p-8 gap-4 text-lg border-b border-zinc-300">
			<h1 class="font-bold text-3xl">Features:</h1>
			<p>
				<span class="font-semibold">Free Forever</span> - FreeSpeech AAC will always be free for everyone
				to use. We do our best to offer premium features such as AI voice generation and file hosting
				to free users through community donations. We do not plan on adding a paid tier to the app, or
				offering paid features.
			</p>
			<p>
				<span class="font-semibold">Support for iOS, Android, Mac, PC, and Linux</span> - FreeSpeech
				AAC was designed to run on almost any tablet or computer, so there's no need to worry about purchasing
				expensive devices to access FreeSpeech AAC.
			</p>
			<p>
				<span class="font-semibold">Cross-Device Sharing & Compatibility</span> - By default all FreeSpeech
				AAC pages and projects are cross-compatible between devices, so if you are sharing a page between
				a Windows computer and an iOS device, there will be no issues with the page's layout or functionality.
			</p>
			<p>
				<span class="font-semibold">Ultra-Realistic AI Generated Voices</span> - FreeSpeech AAC uses
				AI generated voices via ElevenLabs to generate incredibly realisic voices for users. These voices
				have tonality, inflection, and emotion. These are some of the highest quality voices on the market
				today, and we are so excited to deliver them to you for free.
			</p>
			<p>
				<span class="font-semibold">Easy-to-Use Interface</span> - We strive to create intuitive interfaces
				that can be utilized by casual and advanced users to create a communication experience tailored
				to the user.
			</p>
			<p>
				<span class="font-semibold">Secure & Open-Source</span> - FreeSpeech AAC is 100% open-source
				meaning that all the source code that makes up the app is public, and can be improved and iterrated
				on by the community. That being said, no private user data is exposed. All user data is stored
				in a secure postgres database. The only data that is collected is the projects and pages a user
				has created, we do not store information about communication history or anything of that nature.
				We will never sell your information.
			</p>
			<p class="text-zinc-400">
				Text Documentation and Tutorial Videos <span class="italic">(Coming Soon)</span>
			</p>
			<p class="text-zinc-400">
				Expansive Symbol and Icon Library <span class="italic">(Coming Soon)</span>
			</p>
			<p class="text-zinc-400">Pre-Made AAC Projects <span class="italic">(Coming Soon)</span></p>
			<p class="text-zinc-400">
				Shared Community AAC Projects and Pages <span class="italic">(Coming Soon)</span>
			</p>
			<p class="text-zinc-400">
				Complete Offline Support <span class="italic">(Coming Soon)</span>
			</p>
			<p class="text-zinc-400">
				Organization & Enterprise Features for Schools and Clinics <span class="italic"
					>(Coming Soon)</span
				>
			</p>
		</div>
		<!-- Github -->
		<div
			class="flex flex-col items-center justify-center p-8 gap-4 text-lg border-b border-zinc-300"
		>
			<a
				class="bg-zinc-900 border border-zinc-600 text-zinc-50 px-3 p-2 rounded-md"
				href="https://github.com/merkie/freespeech"
				target="_blank"
			>
				<i class="bi bi-github mr-2" />Check out the source code on GitHub!</a
			>
			<a
				class="bg-red-600 border border-red-500 text-red-50 px-3 p-2 rounded-md"
				href="https://github.com/sponsors/Merkie"
				target="_blank"
			>
				<i class="bi bi-heart mr-2" />Sponsor the Project</a
			>
		</div>
		<!-- footer -->
		<div class="h-[100px]" />
	</div>
</main>

<style>
	.hero {
		background-image: url('/hero.jpg');
		background-size: cover;
		background-position: center;
	}
</style>
