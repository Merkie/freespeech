import { cn } from "@/lib/cn";
import { A, useLocation } from "@solidjs/router";
import { Accessor, Show } from "solid-js";

export default function BottomNav() {
  const location = useLocation();

  return (
    <div class="grid grid-cols-3 grid-rows-1 gap-2 border border-x-0 border-b-0 border-zinc-700 bg-zinc-900 p-2 text-[25px] text-zinc-100">
      <NavButton
        selected={() => location.pathname.startsWith("/app/project")}
        icon="house-fill"
        href="/app/project"
      />
      <NavButton
        selected={() => false}
        icon="pencil-fill"
        onClick={() => null}
      />
      <NavButton
        selected={() => location.pathname.startsWith("/app/dashboard")}
        icon="gear-fill"
        href="/app/dashboard/projects"
      />
    </div>
  );
}

function NavButton({
  icon,
  selected,
  href,
  onClick,
}: {
  icon: string;
  selected: Accessor<boolean>;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <Show
      when={href}
      fallback={
        <button
          onClick={onClick}
          class={cn(
            "rounded-md w-full h-full p-1 text-center flex items-center justify-center transition-all",
            {
              "bg-zinc-800 opacity-100": selected(),
              "opacity-50": !selected(),
            }
          )}
        >
          <i class={`bi bi-${icon}`}></i>
        </button>
      }
    >
      <A
        class={cn(
          "rounded-md w-full h-full p-1 text-center flex items-center justify-center transition-all",
          {
            "bg-zinc-800 opacity-100": selected(),
            "opacity-50": !selected(),
          }
        )}
        href={href!}
      >
        <i class={`bi bi-${icon}`}></i>
      </A>
    </Show>
  );
}
