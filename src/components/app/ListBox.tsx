import { createSignal } from "solid-js";

const ListBox = (props: { items: string[]; selected: string }) => {
  const [isOpen, setIsOpen] = createSignal(false);
  return (
    <>
      <main
        onClick={(e) => {
          if (e.target.tagName === "MAIN") setIsOpen(!isOpen());
        }}
        class="relative z-30 cursor-pointer border border-y-0 border-gray-700 bg-gray-800 p-2 px-2 text-center capitalize"
      >
        {props.selected} <i class="bx bx-chevron-down"></i>
        <div
          style={`bottom: ${
            isOpen() ? "-10px" : "0"
          }; left: 0; transform: translate(0, 100%) scale(${
            isOpen() ? "1" : "0.8"
          }); pointer-events: ${isOpen() ? "all" : "none"}; opacity: ${
            isOpen() ? "1" : "0"
          };`}
          class="absolute z-20 flex w-full min-w-[150px] flex-col rounded-md border border-gray-600 bg-gray-800 shadow-md"
        >
          {props.items.map((item) => (
            <p class="w-full rounded-md border border-x-0 border-t-0 border-gray-600 p-4 py-2 text-left hover:bg-gray-700">
              {item}
            </p>
          ))}
        </div>
      </main>
      {isOpen() && (
        <main
          onClick={() => setIsOpen(false)}
          class="fixed top-0 left-0 z-20 h-screen w-screen"
        ></main>
      )}
    </>
  );
};

export default ListBox;
