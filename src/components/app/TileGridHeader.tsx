import { AppMode } from "../../lib/client/signals";

const TileGridHeader = () => {
  return (
    <section
      class={`h-[50px] bg-gray-900 ${AppMode() === "home" ? "" : "hidden"}`}
    ></section>
  );
};

export default TileGridHeader;
