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

<div class="fixed left-0 top-0 z-40 w-screen border-b border-zinc-300 bg-zinc-100">
	<div class="mx-auto flex h-[60px] w-[90%] max-w-[1200px] items-center p-2">
		<img src="/favicon.png" class="mix-blend-multiply" width={40} alt="asdasd" />
		<p class="text-lg font-semibold">FreeSpeech <span class="text-sm font-light">AAC</span></p>
		<div class="flex-1" />
		{#if data.user}
			<a
				class="ml-4 rounded-md border border-blue-600 bg-blue-600 p-1 px-3 text-blue-50 transition-all hover:bg-transparent hover:text-blue-600"
				href="/app/dashboard">Go to App <i class="bi bi-box-arrow-in-right" /></a
			>
		{:else}
			<a class="hover:underline" href="/login">Login</a>
			<a
				class="ml-4 rounded-md border border-blue-600 bg-blue-600 p-1 px-3 text-blue-50 transition-all hover:bg-transparent hover:text-blue-600"
				href="/register">Create Account</a
			>
		{/if}
	</div>
</div>

<main class="mt-[59px] flex min-h-screen flex-col bg-zinc-300">
	<div
		class="mx-auto flex w-[90%] max-w-[1200px] flex-1 flex-col border-x border-zinc-300 bg-zinc-100"
	>
		<!-- hero -->
		<div class="hero relative h-[300px]">
			<div
				class="absolute left-0 top-0 grid h-full w-full place-items-center bg-[rgba(255,255,255,0.5)]"
			>
				<h1 class="w-fit text-center text-4xl font-bold text-zinc-800">
					Free and Open-Source AAC <span class="border-b-8 border-blue-500">For Everyone</span>.
				</h1>
			</div>
		</div>
		<!-- pitch -->
		<div
			class="flex flex-col items-center justify-center gap-8 border-b border-zinc-300 p-8 sm:flex-row sm:gap-16"
		>
			<div class="min-w-[160px] flex-col items-center justify-center">
				<img class="w-fit rounded-lg bg-white shadow-md" src="/favicon.png" width={150} alt="" />
				<p class="mt-4 text-center text-xl font-bold">FreeSpeech AAC</p>
			</div>
			<div class="flex max-w-[500px] flex-col gap-2 text-left">
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
		<div class="flex flex-col gap-4 border-b border-zinc-300 p-8 text-lg">
			<h1 class="text-3xl font-bold">Features:</h1>
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
			class="flex flex-col items-center justify-center gap-4 border-b border-zinc-300 p-8 text-lg"
		>
			<a
				class="rounded-md border border-zinc-600 bg-zinc-900 p-2 px-3 text-zinc-50"
				href="https://github.com/merkie/freespeech"
				target="_blank"
			>
				<i class="bi bi-github mr-2" />Check out the source code on GitHub!</a
			>
			<a
				class="rounded-md border border-red-500 bg-red-600 p-2 px-3 text-red-50"
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
