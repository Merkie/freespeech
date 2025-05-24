import { setIsModalOpen } from "@/state";
import { JSX, Show } from "solid-js";

export function ModalTitle({
  title,
  children,
}: { title?: string; children?: JSX.Element } = {}) {
  return (
    <div class="mb-2 flex items-center justify-between gap-2">
      <Show when={title} fallback={children}>
        <p class="text-lg font-bold">{title}</p>
      </Show>
      <button
        class="cursor-pointer"
        onClick={() => {
          setIsModalOpen(false);
        }}
      >
        <i class="bi bi-x-lg flex items-center"></i>
      </button>
    </div>
  );
}
