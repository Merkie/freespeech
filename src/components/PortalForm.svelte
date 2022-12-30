<script lang="ts">
  import { onMount } from "svelte";
  import generateRandomUsername from "../lib/helpers/randomUsername";

  export let isLogin: Boolean;

  let email = "";
  let name = "";
  let password = "";
  let confirmPassword = "";
  let rememberMe = false;
  let randomUsername = "";
  let form: HTMLFormElement;

  onMount(() => {
    randomUsername = generateRandomUsername();
  });

  const handleSubmit = async () => {
    let response;
    // this is a hacky method of getting the captcha response from the form
    // so we can send it as json to the server
    const captcha = Object.fromEntries(new FormData(form).entries())[
      "cf-turnstile-response"
    ];

    const { ip } = await fetch("https://hutils.loxal.net/whois").then((res) =>
      res.json()
    );

    if (isLogin) {
      response = await fetch("/api/v1/user/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          captcha,
          ip,
        }),
      });
    } else {
      response = await fetch("/api/v1/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
          captcha,
          ip,
        }),
      });
    }

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    // set cookie
    document.cookie = `token=${data.token}; path=/; max-age=${
      rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24
    }; SameSite=Strict; Secure;`;
    // redirect to home
    window.location.href = "/app";
  };
</script>

<svelte:head>
  <script
    src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=_turnstileCb"
    async
    defer
  ></script>
</svelte:head>
<form
  bind:this={form}
  on:submit|preventDefault
  class="p-8 shadow-md w-full sm:max-w-[500px] sm:rounded-lg bg-zinc-100 border border-zinc-300 flex flex-col gap-2"
>
  <h1 class="text-xl text-zinc-600 mb-2">
    {isLogin ? "Login to FreeSpeech" : "Create a FreeSpeech account"}
  </h1>
  <p class="text-sm">Email</p>
  <input
    bind:value={email}
    type="text"
    class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
    placeholder=""
  />
  {#if !isLogin}
    <p class="text-sm">Name</p>
    <input
      bind:value={name}
      type="text"
      class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
      placeholder={randomUsername}
    />
  {/if}

  <p class="text-sm">Password</p>
  <input
    bind:value={password}
    type="password"
    class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
    placeholder=""
  />

  {#if !isLogin}
    <p class="text-sm">Confirm Password</p>
    <input
      bind:value={confirmPassword}
      type="password"
      class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
      placeholder=""
    />
  {/if}

  <div
    class="cursor-pointer"
    on:click={(e) => {
      rememberMe = !rememberMe;
    }}
    on:keypress={(e) => {
      if (e.key === "Enter") rememberMe = !rememberMe;
    }}
  >
    <input
      bind:checked={rememberMe}
      class="mr-4 cursor-pointer"
      type="checkbox"
    />
    <span class="text-sm select-none">Remember me</span>
  </div>

  <div class="mt-2" id="myWidget" />

  <button
    on:click={handleSubmit}
    class="bg-blue-500 text-blue-50 p-2 rounded-md mt-2"
  >
    Continue
  </button>

  <p class="mt-2 text-sm">
    {isLogin ? "Don't have an account? " : "Already have an account? "}
    <a class="text-blue-400 underline" href={isLogin ? "/signup" : "/login"}>
      {isLogin ? "Sign up" : "Login"}
    </a>
  </p>
</form>
