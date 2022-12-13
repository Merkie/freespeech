import { AppMode, EditModeData } from "../../../lib/client/signals";
import ListBox from "../../../components/ListBox";

const ActionMenu = () => {
  return (
    <section
      class={`flex h-[40px] w-full items-center gap-2 bg-gray-900 p-2 ${
        AppMode() === "edit" ? "" : "hidden"
      }`}
    >
      <p>
        Selected Tool:{" "}
        <span class="border border-y-0 border-gray-700 bg-gray-800 p-4 px-2 text-center capitalize">
          {EditModeData().selectedTool}
        </span>
      </p>
      {EditModeData().selectedTool === "text" && (
        <>
          <p>Mode: </p>
          <ListBox
            selected="Display Text"
            items={[{ text: "Speak Text" }, { text: "Display Text" }]}
            setSignal={() => null}
          />
          <p>Tip: Click or tap on a tile to edit its text.</p>
        </>
      )}
    </section>
  );
};

export default ActionMenu;
