<script lang="ts">
  //@ts-ignore
  import isEmail from "is-email";
  export let isLogin: boolean;

  let email: HTMLInputElement;
  let name: HTMLInputElement;
  let password: HTMLInputElement;
  let confirmPassword: HTMLInputElement;

  let emailTaken = false;
  let emailInvalid = false;
  let passwordInvalid = false;
  let passwordsDontMatch = false;

  const submit = async () => {
    if (emailTaken || emailInvalid || passwordInvalid || passwordsDontMatch) {
      alert("Please fix the errors before submitting");
      return;
    }
    if (email.value.length === 0 || password.value.length === 0) {
      alert("Please fill out all fields");
      return;
    }
    const resp = await fetch(
      `/api/v1/user/${isLogin ? "login" : "create"}.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
          name: name?.value || "",
          userAgent: window.navigator.userAgent,
        }),
      }
    );
    const data = await resp.json();
    if (data.success === false) {
      alert(
        "Something went wrong, please check your credentials and try again"
      );
    } else {
      document.cookie = `token=${data.token.token}; path=/; max-age=31536000; SameSite=Lax`;
      window.location.assign("/dashboard");
    }
  };
</script>

<div class="flex w-full flex-col">
  <p>{isLogin ? "Your email" : "Add your email"}</p>
  <input
    on:change={async () => {
      isEmail(email.value) ? (emailInvalid = false) : (emailInvalid = true);
      if (emailInvalid) return; // If the email is invalid no need to check
      if (isLogin) return; // If we are logging in, we don't need to check any further
      const respone = await fetch("/api/v1/user/checkEmail.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
        }),
      });
      const data = await respone.json();
      emailTaken = data.taken;
    }}
    bind:this={email}
    class={`${emailTaken || emailInvalid ? "" : "mb-4"} rounded-sm border ${
      emailTaken || emailInvalid ? "border-red-400" : "border-gray-300"
    } bg-gray-200 p-2 text-gray-500`}
    type="text"
  />
  {#if emailTaken}
    <p class="mb-2 text-sm text-red-400">Email is already taken</p>
  {/if}
  {#if emailInvalid}
    <p class="mb-2 text-sm text-red-400">Invalid email</p>
  {/if}
  {#if !isLogin}
    <p>Add your name</p>
    <input
      bind:this={name}
      class="mb-4 rounded-sm border border-gray-300 bg-gray-200 p-2 text-gray-500"
      type="text"
    />
  {/if}
  <p>{isLogin ? "Your password" : "Choose a password"}</p>
  <input
    bind:this={password}
    on:change={() => {
      if (isLogin) return;
      password.value.length > 5
        ? (passwordInvalid = false)
        : (passwordInvalid = true);
      password.value === confirmPassword.value
        ? (passwordsDontMatch = false)
        : (passwordsDontMatch = true);
    }}
    class={`rounded-sm border ${
      passwordInvalid || passwordsDontMatch
        ? "border-red-400"
        : "border-gray-300"
    }  bg-gray-200 p-2 text-gray-500`}
    type="password"
  />
  {#if !isLogin}
    <p
      class={`mb-4 text-sm ${
        passwordInvalid ? "text-red-400" : "text-gray-400"
      }`}
    >
      Min 6 characters
    </p>
    <p>Confirm your password</p>
    <input
      bind:this={confirmPassword}
      on:change={() => {
        password.value === confirmPassword.value
          ? (passwordsDontMatch = false)
          : (passwordsDontMatch = true);
      }}
      class={`rounded-sm border ${
        passwordInvalid || passwordsDontMatch
          ? "border-red-400"
          : "border-gray-300"
      }  bg-gray-200 p-2 text-gray-500`}
      type="password"
    />
  {/if}
  <button
    on:click={submit}
    class="my-4 flex justify-center rounded-md border border-blue-400 bg-blue-600 p-2 text-blue-50"
    >{isLogin ? "Log in" : "Create account"}</button
  >
  <p>
    {isLogin ? "Don't have an account?" : "Already have an account?"}
    <a
      class="text-sm text-blue-500 underline"
      href={isLogin ? "/portal/signup" : "/portal/login"}
      >{isLogin ? "Create one instead" : "Log in instead"}</a
    >
  </p>
</div>
