import { AppMode } from "../../lib/client/signals";
import Tile from "./Tile";

const TileGrid = () => {
  return (
    <main
      class={`flex-1 grid-cols-4 grid-rows-5 gap-2 bg-gray-200 p-2 text-gray-900 sm:grid-cols-8 ${
        AppMode() !== "keyboard" ? "grid" : "hidden"
      }`}
    >
      {Array.from({ length: 8 * 5 }, (_, i) => i).map(() => (
        <Tile
          text={"Awesome tile!"}
          image={
            "https://i.scdn.co/image/ab6761610000e5eb35f91df1e1a8703f27132550"
          }
        />
      ))}
    </main>
  );
};

export default TileGrid;
