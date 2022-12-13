import { createEffect, createSignal } from "solid-js";
import { AppMode, Project, Page } from "../../../lib/client/signals";
import AddTileBtn from "./EditModeAddTileButton";
import Tile from "./Tile";

const TileGrid = () => {
  return (
    <main
      class={`flex-1 grid-cols-4 grid-rows-5 gap-2 bg-gray-200 p-2 text-gray-900 sm:grid-cols-8 ${
        AppMode() !== "keyboard" ? "grid" : "hidden"
      }`}
    >
      {Array.from(
        { length: Project().columns * Project().rows },
        (_, i) => i
      ).map((i) => {
        const x = (i % Project().columns) + 1;
        const y = Math.floor(i / Project().columns) + 1;
        const tile = Project()
          ?.pages.find((page) => page.id === Page())
          ?.tiles.find((_tile) => _tile.x === x && _tile.y === y);
        if (tile) {
          return <Tile {...tile} />;
        }
        if (AppMode() === "edit") return <AddTileBtn x={x} y={y} />;
        return <div></div>;
      })}
    </main>
  );
};

export default TileGrid;
