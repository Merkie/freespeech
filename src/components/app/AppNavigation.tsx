import { createEffect, createSignal, For } from "solid-js";

export type AppNavigationButtons = "home" | "edit" | "dashboard";

export const [AppNavigationButtons, setAppNavigationButtons] = createSignal([
  {
    label: "home",
    icon: "house",
    handler: () => {
      // if already on home page, do nothing
      // if (window.location.pathname === "/app") return;
      // otherwise, redirect to home page
      // window.location.href = "/app";
    },
    disabled: () => false,
  },
  {
    label: "edit",
    icon: "pencil",
    handler: () => {},
    disabled: () => ActiveAppPage() === "dashboard",
  },
  {
    label: "dashboard",
    icon: "gear",
    handler: () => {
      // if already on dashboard page, do nothing
      // if (window.location.pathname === "/app/dashboard") return;
      // otherwise, redirect to dashboard page
      // window.location.href = "/app/dashboard";
    },
    disabled: () => false,
  },
]);

export const [ActiveAppPage, setActiveAppPage] =
  createSignal<AppNavigationButtons>("home");

function AppNavigation() {
  // update active app page when url changes
  createEffect(() => {
    if (window.location.pathname === "/app/dashboard")
      setActiveAppPage("dashboard");
    else setActiveAppPage("home");
  }, []);

  return (
    <section class="p-2 border border-x-0 border-b-0 border-zinc-700 bg-zinc-900 text-zinc-100 flex gap-2 w-full">
      <For each={AppNavigationButtons()}>
        {(button) => (
          <button
            disabled={button.disabled()}
            onClick={() => {
              setActiveAppPage(button.label as AppNavigationButtons);
              button.handler();
            }}
            class={`p-2 capitalize rounded-md border  flex-1 bg-zinc-800 border-zinc-700 flex items-center justify-center gap-2`}
          >
            <i class={`bi bi-${button.icon}`}></i>
            <p>{button.label}</p>
          </button>
        )}
      </For>
    </section>
  );
}

export default AppNavigation;
