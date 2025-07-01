import { setIsModalOpen } from "@/state";
import { JSX, Show } from "solid-js";

export function ModalTitle({
  title,
  children,
  onClose,
}: {
  title?: string;
  children?: JSX.Element;
  onClose?: () => void;
}) {
  return (
    <div class="mb-2 flex items-center justify-between gap-2">
      <Show when={title} fallback={children}>
        <p class="text-lg font-bold">{title}</p>
      </Show>
      <button
        class="cursor-pointer"
        onClick={async () => {
          setIsModalOpen(false);
          await new Promise((resolve) => setTimeout(resolve, 100));
          onClose?.();
        }}
      >
        <i class="bi bi-x-lg flex items-center"></i>
      </button>
    </div>
  );
}
