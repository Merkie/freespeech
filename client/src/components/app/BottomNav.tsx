import { cn } from "@/lib/cn";
import { A, useLocation } from "@solidjs/router";
import { Accessor, Show } from "solid-js";

export default function BottomNav() {
  const location = useLocation();

  return (
    <div class="flex gap-2 border border-x-0 border-b-0 border-zinc-700 bg-zinc-900 p-2 text-[25px] font-light text-zinc-100">
      <DashboardButton
        selected={() => location.pathname.startsWith("/app/project")}
        icon="house-fill"
        href="/app/project"
      />
      <DashboardButton
        selected={() => location.pathname.startsWith("/app/project")}
        icon="pencil-fill"
        href="/app/project"
      />
      <DashboardButton
        selected={() => location.pathname.startsWith("/app/dashboard")}
        icon="gear-fill"
        href="/app/dashboard/projects"
      />
    </div>
  );
}

function DashboardButton({
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
          class={cn("flex-1 rounded-md p-1 text-center transition-colors", {
            "bg-zinc-800": selected(),
            "pointer-events-none opacity-50": !selected(),
          })}
        >
          <i class={`bi bi-${icon}`}></i>
        </button>
      }
    >
      <A
        class={cn("flex-1 rounded-md p-1 text-center transition-colors", {
          "bg-zinc-800": selected(),
          "pointer-events-none opacity-50": !selected(),
        })}
        href={href!}
      >
        <i class={`bi bi-${icon}`}></i>
      </A>
    </Show>
  );
}
