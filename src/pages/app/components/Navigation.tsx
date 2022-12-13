import { AppMode, setAppMode } from "../../../lib/client/signals";

const NavigationButtons: {
  name: string;
  icon: string;
  disabled?: boolean;
  alwaysSolid?: boolean;
  onClick?: () => void;
}[] = [
  {
    name: "home",
    icon: "home",
    onClick: () => setAppMode("home"),
  },
  {
    name: "keyboard",
    icon: "keyboard",
    alwaysSolid: true,
    onClick: () => setAppMode("keyboard"),
  },
  {
    name: "edit",
    icon: "pencil",
    onClick: () => setAppMode("edit"),
  },
];

const Navigation = () => {
  return (
    <section class="flex gap-2 bg-gray-800 p-2">
      {/* Map through all the NavigationButtons and assign them a DOM node */}
      {NavigationButtons.map((button) => (
        <button
          onClick={button.onClick}
          class={`flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-b-0 border-r-0 p-2 text-xl capitalize shadow-md ${
            AppMode() === button.name
              ? // a ternary operator to check if the button is selected, if so make it blue, if not make it gray
                "border-blue-500 bg-blue-600"
              : "border-gray-600 bg-gray-700"
          }`}
        >
          {/* Button icon */}
          <i
            class={`bx bx${
              AppMode() === button.name || button.alwaysSolid ? "s" : ""
            }-${button.icon}`}
          ></i>
          {button.name}
        </button>
      ))}
    </section>
  );
};

export default Navigation;
