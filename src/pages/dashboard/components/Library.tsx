import { setModalData } from "../../../lib/client/signals";

function Library() {
  return (
    <div class="flex items-center justify-between border border-x-0 border-t-0 border-gray-700 pb-4">
      <h1 class="text-2xl font-bold ">Your Library</h1>
      <button
        onClick={() =>
          setModalData({
            visible: true,
            header: "Create Project",
            body: (
              <div class="flex w-full flex-col gap-2">
                <p>Project Name</p>
                <input
                  class="rounded-md border border-gray-600 p-2 text-gray-600"
                  type="text"
                />
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
  );
}

export default Library;
