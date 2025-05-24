import api from "@/lib/api";
// @ts-expect-error - custom hook
import bind from "@/lib/hooks/bind";
import { setToken, setUser } from "@/state";
import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function Page() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const navigate = useNavigate();

  async function submitLogin() {
    const { token } = await api.auth.email.login({
      email: email(),
      password: password(),
    });
    if (!token) return;

    setToken(token);
    localStorage.setItem("token", token);

    const { user } = await api.auth.me();
    if (!user) return;

    setUser(user);

    navigate("/app/dashboard/projects");
  }

  return (
    <main class="grid h-screen place-items-center">
      <div class="flex w-full max-w-[800px] flex-col gap-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-zinc-900">Login To Free Speech</h1>
        </div>
        <div class="flex flex-col border-y border-zinc-200 bg-zinc-50 p-4 sm:rounded-md sm:border">
          <input
            class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
            type="text"
            placeholder="Email"
            use:bind={[email, setEmail]}
          />
          <input
            class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
            type="password"
            placeholder="Password (Must be at least 8 characters)"
            use:bind={[password, setPassword]}
          />
          <button
            onClick={submitLogin}
            class="rounded-md bg-blue-600 p-2 text-lg font-bold text-blue-50"
          >
            Log In
          </button>
          <A href="/register" class="mt-4 p-4 text-zinc-400">
            <span class="mr-4">{`Don't have an account?`}</span>
            <i class="bi bi-arrow-right"></i>
          </A>
        </div>
      </div>
    </main>
  );
}
