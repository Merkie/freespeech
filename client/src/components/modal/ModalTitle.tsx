import { modal, setIsModalOpen } from "@/state";
import { JSX, Show } from "solid-js";
import modals from "./modals";

export function ModalTitle({
  children,
  onClose,
}: {
  children?: JSX.Element;
  onClose?: () => void;
}) {
  const modalItem = () => modals[modal()];

  return (
    <div class="mb-2 flex items-center justify-between gap-2">
      <Show when={modalItem()?.modal_title} fallback={children}>
        <p class="text-lg font-bold">{modalItem()?.modal_title}</p>
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
