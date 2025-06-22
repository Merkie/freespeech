import { cn } from "@/lib/cn";
import { A } from "@solidjs/router";

export default function Page() {
  return (
    <>
      <p class="text-4xl text-zinc-800 m-8 pb-8 border-b border-zinc-200">
        Application Settings
      </p>
      <div class="grid grid-cols-2 gap-8 p-8">
        <SettingsButton
          href="/app/dashboard/settings/voice"
          label="Voice"
          color="blue"
          icon="bi bi-volume-up-fill"
        />
        <SettingsButton
          href="/app/dashboard/settings/behavior"
          label="Behavior"
          color="pink"
          icon="bi bi-gear-wide-connected"
        />
        <SettingsButton
          href="#"
          label="Sharing"
          color="orange"
          icon="bi bi-people-fill"
          disabled={true}
        />

        <SettingsButton
          href="#"
          label="Usage"
          color="lime"
          icon="bi bi-bar-chart-fill"
          disabled={true}
        />
        <SettingsButton
          href="#"
          label="Access Controls"
          color="purple"
          icon="bi bi-lock-fill"
          disabled={true}
        />
        <SettingsButton
          href="#"
          label="Appearance"
          color="amber"
          icon="bi bi-palette-fill"
          disabled={true}
        />
      </div>
    </>
  );
}

function SettingsButton({
  href,
  label,
  color,
  icon,
  disabled = false,
}: {
  href: string;
  label: string;
  color: string;
  icon: string;
  disabled?: boolean;
}) {
  return (
    <A
      href={href}
      class={cn(
        "group flex flex-1 select-none items-center gap-4 rounded-xl border-2 border-zinc-300 p-4 transition-all",
        {
          "hover:border-blue-200 hover:bg-blue-50": color === "blue",
          "hover:border-pink-200 hover:bg-pink-50": color === "pink",
          "hover:border-orange-200 hover:bg-orange-50": color === "orange",
          "hover:border-lime-200 hover:bg-lime-50": color === "lime",
          "hover:border-amber-200 hover:bg-amber-50": color === "amber",
          "hover:border-purple-200 hover:bg-purple-50": color === "purple",
          "grayscale opacity-50 pointer-events-none": disabled,
        }
      )}
    >
      <div
        class={cn("grid h-[70px] w-[70px] place-items-center rounded-lg", {
          "bg-blue-600/[10%]": color === "blue",
          "bg-pink-600/[10%]": color === "pink",
          "bg-orange-600/[10%]": color === "orange",
          "bg-lime-600/[10%]": color === "lime",
          "bg-amber-600/[10%]": color === "amber",
          "bg-purple-600/[10%]": color === "purple",
        })}
      >
        <i
          class={cn(`${icon} text-[40px]`, {
            "text-blue-500": color === "blue",
            "text-pink-500": color === "pink",
            "text-orange-500": color === "orange",
            "text-lime-500": color === "lime",
            "text-amber-500": color === "amber",
            "text-purple-500": color === "purple",
          })}
        ></i>
      </div>
      <span
        class={cn("text-3xl text-zinc-800 transition-all", {
          "group-hover:text-blue-500": color === "blue",
          "group-hover:text-pink-500": color === "pink",
          "group-hover:text-orange-500": color === "orange",
          "group-hover:text-lime-500": color === "lime",
          "group-hover:text-amber-500": color === "amber",
          "group-hover:text-purple-500": color === "purple",
        })}
      >
        {label}
      </span>
      <div class="flex-1"></div>
      <i
        class={cn(
          "bi bi-arrow-right-short text-6xl text-zinc-500 transition-all",
          {
            "group-hover:text-blue-500": color === "blue",
            "group-hover:text-pink-500": color === "pink",
            "group-hover:text-orange-500": color === "orange",
            "group-hover:text-lime-500": color === "lime",
            "group-hover:text-amber-500": color === "amber",
            "group-hover:text-purple-500": color === "purple",
          }
        )}
      ></i>
    </A>
  );
}
