import {
  AppMode,
  EditModeData,
  setEditModeData,
} from "../../../lib/client/signals";

const Tools = [
  {
    name: "text",
    icon: "text",
  },
  {
    name: "image",
    icon: "image",
  },
  {
    name: "color",
    icon: "palette",
  },
  {
    name: "accent",
    icon: "bookmark",
  },
  {
    name: "move",
    icon: "move",
  },
  {
    name: "folder",
    icon: "folder",
  },
  {
    name: "link",
    icon: "link",
  },
  {
    name: "delete",
    icon: "trash",
  },
  {
    name: "settings",
    icon: "cog",
  },
];

const ToolBar = () => {
  return (
    <section
      class={`z-10 flex flex-col items-center gap-2 bg-gray-900 pb-2 text-gray-50 ${
        AppMode() === "edit" ? "" : "hidden"
      }`}
    >
      <p class="w-full border border-x-0 border-gray-700 bg-gray-800 p-2 px-4">
        Tools
      </p>
      {Tools.map((tool) => (
        <button
          onClick={() =>
            setEditModeData({ ...EditModeData(), selectedTool: tool.name })
          }
          class={`relative w-4/5 flex-1 rounded-md border border-r-0 border-b-0 border-gray-700 text-2xl shadow-md ${
            EditModeData().selectedTool === tool.name
              ? "border-transparent"
              : "bg-gray-800"
          }`}
        >
          <i
            style="transform: translate(-50%, -50%)"
            class={`bx absolute left-1/2 top-1/2 bx-${tool.icon}`}
          ></i>
        </button>
      ))}
    </section>
  );
};

export default ToolBar;
