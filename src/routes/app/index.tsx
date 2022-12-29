import { Show } from "solid-js";
import { Head, Title } from "solid-start";
import AppNavigation from "~/components/app/AppNavigation";
import { ActiveAppPage } from "~/components/app/AppNavigation";
import SentenceDisplay from "~/components/app/SentenceDisplay";
import Dashboard from "./dashboard";

function App() {
  return (
    <>
      <Head>
        <Title>Hello!</Title>
      </Head>
      <main class="w-screen h-screen flex flex-col justify-end">
        <Show when={["home", "edit"].includes(ActiveAppPage())}>
          <SentenceDisplay />
          <div class="flex-1 bg-sky-400" />
        </Show>
        <Show when={["dashboard"].includes(ActiveAppPage())}>
          {/* <Head>
            <Title>Hello!</Title>
          </Head> */}
          <main class="w-screen h-screen flex flex-col justify-end">
            <main class="flex-1 bg-zinc-800"></main>
            <AppNavigation />
          </main>
        </Show>
        <AppNavigation />
      </main>
    </>
  );
}

export default App;
