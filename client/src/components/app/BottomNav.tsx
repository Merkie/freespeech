import { cn } from "@/lib/cn";
import { project, setCurrentPageId } from "@/state";
import { useLocation, useNavigate } from "@solidjs/router";
import { Accessor } from "solid-js";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div class="grid grid-cols-3 grid-rows-1 gap-2 border border-x-0 border-b-0 border-zinc-700 bg-zinc-900 p-2 text-[25px] text-zinc-100">
      <NavButton
        selected={() => location.pathname.startsWith("/app/project")}
        icon="house-fill"
        onClick={() => {
          if (location.pathname.startsWith("/app/project")) {
            setCurrentPageId(project.data!.homePage!);
          } else {
            navigate("/app/project/" + project.data!.id);
          }
        }}
      />
      <NavButton
        selected={() => false}
        icon="pencil-fill"
        onClick={() => null}
      />
      <NavButton
        selected={() => location.pathname.startsWith("/app/dashboard")}
        icon="gear-fill"
        onClick={() => {
          navigate("/app/dashboard/projects");
        }}
      />
    </div>
  );
}

function NavButton({
  icon,
  selected,
  onClick,
}: {
  icon: string;
  selected: Accessor<boolean>;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      class={cn(
        "rounded-md cursor-pointer w-full h-full p-1 text-center flex items-center justify-center transition-all",
        {
          "bg-zinc-800 opacity-100": selected(),
          "opacity-50": !selected(),
        }
      )}
    >
      <i class={`bi bi-${icon}`}></i>
    </button>
  );
}
