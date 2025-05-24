import { cn } from "@/lib/cn";
import { user } from "@/state";
import { A, useLocation } from "@solidjs/router";
import { For, Show } from "solid-js";

const links = [
  {
    name: "Your Projects",
    icon: "grid",
    path: "/app/dashboard/projects",
  },
  {
    name: "Application Settings",
    icon: "sliders",
    path: "/app/dashboard/settings",
  },
];

export default function Navbar() {
  return (
    <div class="flex items-center gap-2 bg-zinc-900 font-light text-zinc-100">
      <For each={links}>{(link) => <NavbarLink link={link} />}</For>
      <div class="flex-1" />
      <A href="/app/dashboard/profile" class="px-4">
        <Show when={user()?.profileImgUrl} fallback={<DefaultProfilePic />}>
          <img
            src={user()!.profileImgUrl!}
            alt="profile"
            class="h-[40px] w-[40px] rounded-full bg-white object-cover"
          />
        </Show>
      </A>
    </div>
  );
}

function NavbarLink({ link }: { link: (typeof links)[0] }) {
  const location = useLocation();
  const isSelected = () => location.pathname === link.path;

  return (
    <A
      href={link.path}
      class={cn(
        "flex items-center gap-4 border-b-4 px-4 h-[56px] transition-all",
        {
          "border-zinc-600": isSelected(),
          "border-transparent text-zinc-500 hover:text-zinc-400": !isSelected(),
        }
      )}
    >
      <i class={`bi bi-${link.icon} text-lg`} />
      <span class="text-base">{link.name}</span>
    </A>
  );
}

function DefaultProfilePic() {
  const initials = () =>
    (user()?.name || "")
      .split(" ")
      .map((str) => str.trim().toUpperCase())
      .filter(Boolean)
      .map((str) => str[0])
      .join("");

  return (
    <p class="grid h-[40px] w-[40px] place-items-center rounded-full bg-blue-500 text-xs font-bold text-blue-50">
      {initials()}
    </p>
  );
}
