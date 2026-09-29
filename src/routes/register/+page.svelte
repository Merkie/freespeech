<script lang="ts">
	export let data;
</script>

<main class="grid h-screen place-items-center">
	<div class="flex w-full max-w-[800px] flex-col gap-16">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-zinc-900">Create a Free Speech Account</h1>
		</div>
		<div class="flex flex-col border-y border-zinc-200 bg-zinc-50 p-4 sm:rounded-md sm:border">
			<a href={data.url} class="mb-4">
				<div
					class="flex items-center justify-center gap-4 rounded-md border border-zinc-200 p-4 transition-all hover:bg-zinc-100"
				>
					<img
						src={'https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png'}
						width={20}
						alt="Google"
					/>
					<span class="text-zinc-800">Continue with Google</span>
				</div>
			</a>
			<a href={'/register/email'}>
				<div
					class="flex items-center justify-center gap-4 rounded-md border border-zinc-200 p-4 transition-all hover:bg-zinc-100"
				>
					<i class="bi bi-envelope"></i>
					<span class="text-zinc-800">Continue with Email</span>
				</div>
			</a>
			<a href="/login" class="mt-4 p-4 text-zinc-400">
				<span class="mr-4">{`Already have an account?`}</span>
				<i class="bi bi-arrow-right"></i>
			</a>
		</div>
		<p class="px-4 text-center text-sm text-zinc-500">
			By creating an account, you agree to the <a href="/tos" class="underline">Terms of Service</a>
			and <a href="/privacy" class="underline">Privacy Policy</a>. Accounts are for adults; if you
			set up boards for a child, you must be their parent or guardian or have their school's
			authorization.
		</p>
	</div>
</main>

<style lang="postcss">
	:global(body) {
		@apply bg-zinc-100;
	}
</style>
