import { A } from "@solidjs/router";

export default function Page() {
  return (
    <main class="grid h-screen place-items-center">
      <div class="flex w-full max-w-[800px] flex-col gap-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-zinc-900">
            Create a Free Speech Account
          </h1>
        </div>
        <div class="flex flex-col border-y border-zinc-200 bg-zinc-50 p-4 sm:rounded-md sm:border">
          <input
            class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
            type="text"
            placeholder="Name"
            // bind:value={name}
          />
          <input
            class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
            type="text"
            placeholder="Email"
            // bind:value={email}
          />
          <input
            class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
            type="password"
            placeholder="Password (Must be at least 8 characters)"
            // bind:value={password}
          />
          <input
            class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
            type="password"
            placeholder="Confirm Password"
            // bind:value={confirmPassword}
          />
          {/* {#if error}
				<small class="mb-4 text-red-500">{error}</small>
			{/if} */}
          <button
            // on:click={submitRegistration}
            class="rounded-md bg-blue-600 p-2 text-lg font-bold text-blue-50"
          >
            Create Account
          </button>
          <A href="/login" class="mt-4 p-4 text-zinc-400">
            <span class="mr-4">{`Already have an account?`}</span>
            <i class="bi bi-arrow-right"></i>
          </A>
        </div>
      </div>
    </main>
  );
}
