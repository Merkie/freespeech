import { cn } from "@/lib/cn";
import { CreateProjectModal } from "./modals/CreateProjectModal";
import { isModalOpen } from "@/state";
import { JSX } from "solid-js";

export function ModalLoader() {
  return (
    <ModalBackground>
      <ModalContainer>
        <CreateProjectModal />
      </ModalContainer>
    </ModalBackground>
  );
}

function ModalBackground({ children }: { children: JSX.Element }) {
  return (
    <main
      class={cn(
        "bg-[rgba(0,0,0,0.75)] absolute top-0 left-0 w-full h-full grid place-items-center transition-all",
        {
          "pointer-events-none select-none opacity-0": !isModalOpen(),
          "pointer-events-auto opacity-100": isModalOpen(),
        }
      )}
    >
      {children}
    </main>
  );
}

function ModalContainer({ children }: { children: JSX.Element }) {
  return (
    <div
      class={cn(
        "flex max-h-[90%] transition-all w-[100%] flex-col overflow-y-auto border border-zinc-800 bg-zinc-900 p-6 text-zinc-200 shadow-md sm:w-[90%] sm:max-w-[500px] sm:rounded-xl",
        {
          "translate-y-[10px] opacity-0": !isModalOpen(),
        }
      )}
    >
      {children}
    </div>
  );
}
