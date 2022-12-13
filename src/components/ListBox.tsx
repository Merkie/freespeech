import { createSignal } from "solid-js";

type ListBoxItem = {
  text: string;
  element?: any;
};

const ListBox = (props: {
  items: ListBoxItem[];
  selected: string;
  setSignal: (item: any) => void;
}) => {
  const [isOpen, setIsOpen] = createSignal(false);
  return (
    <>
      <main
        onClick={(e) => {
          if (e.target.tagName === "MAIN") setIsOpen(!isOpen());
        }}
        class="relative z-30 grid cursor-pointer place-items-center rounded-md bg-gray-800 p-2 px-2 text-center capitalize"
      >
        <span class="pointer-events-none">
          {props.selected} <i class="bx bx-chevron-down"></i>
        </span>
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
            <p
              onClick={async () => {
                props.setSignal(item.text);

                await new Promise((r) => setTimeout(r, 10));
                setIsOpen(false);
              }}
              class="w-full rounded-md border-gray-600 p-4 py-2 text-left hover:bg-gray-700  active:bg-blue-500"
            >
              {item.element ? item.element : ""}
              {item.text}
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
