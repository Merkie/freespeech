import { AppMode } from "../../lib/client/signals";
import Key from "./Key";

const Keyboard = () => {
  return (
    <main
      class={`flex flex-1 flex-col bg-gray-900 p-2 ${
        AppMode() === "keyboard" ? "" : "hidden"
      }`}
    >
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex flex-1 justify-center gap-2">
          <Key letter={"q"} />
          <Key letter={"w"} />
          <Key letter={"e"} />
          <Key letter={"r"} />
          <Key letter={"t"} />
          <Key letter={"y"} />
          <Key letter={"u"} />
          <Key letter={"i"} />
          <Key letter={"o"} />
          <Key letter={"p"} />
        </div>
        <div class="flex flex-1 justify-center gap-2">
          <Key letter={"a"} />
          <Key letter={"s"} />
          <Key letter={"d"} />
          <Key letter={"f"} />
          <Key letter={"g"} />
          <Key letter={"h"} />
          <Key letter={"j"} />
          <Key letter={"k"} />
          <Key letter={"l"} />
        </div>
        <div class="flex flex-1 justify-center gap-2">
          <Key letter={"z"} />
          <Key letter={"x"} />
          <Key letter={"c"} />
          <Key letter={"v"} />
          <Key letter={"b"} />
          <Key letter={"n"} />
          <Key letter={"m"} />
          <Key letter={"."} />
        </div>
      </div>
    </main>
  );
};

export default Keyboard;
