import { createEffect, createSignal, onMount, Show } from "solid-js";
import generateRandomUsername from "~/lib/resources/randomUsername";

function AccountPortal({ isLogin }: { isLogin: boolean }) {
  const [rememberMe, setRememberMe] = createSignal(false);
  const [randomUsername, setRandomUsername] = createSignal("");
  let rememberMeCheckbox: HTMLInputElement | any;

  // OnMount that generates a random username
  onMount(() => {
    setRandomUsername(generateRandomUsername());
  });

  // createEffect that sets the rememberMe checkbox to the value of rememberMe
  createEffect(() => {
    rememberMeCheckbox.checked = rememberMe();
  }, [rememberMe, rememberMeCheckbox]);

  const handleSubmit = () => {};

  return (
    <main class="h-screen w-screen bg-zinc-200 grid place-items-center">
      <div class="p-8 shadow-md w-full sm:max-w-[500px] sm:rounded-lg bg-zinc-100 border border-zinc-300 flex flex-col gap-2">
        <h1 class="text-xl text-zinc-600 mb-2">
          {isLogin ? "Login to FreeSpeech" : "Create a FreeSpeech account"}
        </h1>
        <p class="text-sm">Email</p>
        <input
          type="text"
          class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
          placeholder=""
        />
        <Show when={!isLogin}>
          <p class="text-sm">Name</p>
          <input
            type="text"
            class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
            placeholder={randomUsername()}
          />
        </Show>
        <p class="text-sm">Password</p>
        <input
          type="password"
          class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
          placeholder=""
        />

        <Show when={!isLogin}>
          <p class="text-sm">Confirm Password</p>
          <input
            type="password"
            class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
            placeholder=""
          />
        </Show>

        <div
          class="cursor-pointer"
          onClick={(e) => {
            if (e.target.tagName !== "INPUT") setRememberMe(!rememberMe());
          }}
        >
          <input
            ref={rememberMeCheckbox}
            class="mr-4 cursor-pointer"
            type="checkbox"
          />
          <span class="text-sm select-none">Remember me</span>
        </div>

        <button
          onClick={handleSubmit}
          class="bg-blue-500 text-blue-50 p-2 rounded-md mt-2"
        >
          Continue
        </button>

        <p class="mt-2 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a
            class="text-blue-400 underline"
            href={isLogin ? "/signup" : "/login"}
          >
            {isLogin ? "Sign up" : "Login"}
          </a>
        </p>
      </div>
    </main>
  );
}

export default AccountPortal;
