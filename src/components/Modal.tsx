import { createEffect, createSignal } from "solid-js";
import { ModalData, setModalData } from "../lib/client/signals";

function Modal() {
  return (
    <main
      onClick={(e) => {
        if (e.target.tagName === "MAIN") {
          setModalData({ ...ModalData(), visible: false } as unknown as null);
        }
      }}
      style={
        ModalData()?.visible ? `pointer-events: all` : `pointer-events: none`
      }
      class={`fixed top-0 left-0 z-40 h-screen w-screen ${
        ModalData()?.visible ? "bg-[rgba(0,0,0,0.5)]" : ""
      }`}
    >
      <div
        style="transform: all 0.3s ease-in-out;"
        class={`absolute ${
          ModalData()?.visible
            ? "-translate-y-1/2 opacity-100"
            : "-translate-y-1/3 opacity-0"
        } left-1/2 top-1/2 flex w-full max-w-[450px] -translate-x-1/2 flex-col gap-4 rounded-lg bg-gray-800 p-4`}
      >
        <h1 class="border border-x-0 border-t-0 border-gray-700 pb-4 text-xl text-gray-50">
          {ModalData()?.header}
        </h1>
        <span class="text-gray-400">{ModalData()?.body}</span>
        {ModalData()?.options?.map((option) => (
          <button
            onClick={() => {
              setModalData({
                ...ModalData(),
                visible: false,
              } as unknown as null);
              option.action();
            }}
            class="w-full rounded-lg bg-blue-600 p-4 py-2 text-lg text-blue-200"
          >
            {option.text}
          </button>
        ))}
      </div>
    </main>
  );
}

export default Modal;
