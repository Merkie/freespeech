import { Show } from "solid-js";
import Modal from "../../../components/Modal";
import { setModalData } from "../../../lib/client/signals";

function DashboardContent({ category }: { category: string }) {
  return (
    <div class="flex-1 rounded-md border border-gray-700 bg-gray-800 p-4 shadow-md">
      <Show when={category === "library"}>
        <div class="flex items-center justify-between border border-x-0 border-t-0 border-gray-700 pb-4">
          <h1 class="text-2xl font-bold ">Your Library</h1>
          <button
            onClick={() =>
              setModalData({
                visible: true,
                header: "Create Project",
                body: (
                  <div class="flex w-full flex-col gap-2">
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                  </div>
                ),
                options: [
                  {
                    text: "Create",
                    action: () => {
                      console.log("Create!");
                    },
                    color: "blue",
                  },
                ],
              })
            }
            class="flex items-center gap-2 rounded-md border border-gray-600 bg-gray-700 p-4 py-2 hover:border-green-600 hover:bg-green-700"
          >
            <i class="bx bx-plus"></i>
            Create Project
          </button>
        </div>
      </Show>
      <Modal />
    </div>
  );
}

export default DashboardContent;
