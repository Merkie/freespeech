import type { Tile } from "@prisma/client";
import { setProject, Project, Page } from "../../../lib/client/signals";

const AddTileBtn = (props: { x: number; y: number }) => {
  const AddTile = () => {
    // Set the Project signal to include the added tile
    setProject({
      ...Project(),
      pages: Project().pages.map((page) => {
        if (page.id === Page()) {
          return {
            ...page,
            tiles: [
              ...page.tiles,
              {
                id: Math.random().toString(36).substr(2, 9),
                x: props.x,
                y: props.y,
                text: "New Tile",
              } as Tile,
            ],
          };
        } else {
          return page;
        }
      }),
    });
    // TODO: Update the tile on the server
  };

  return (
    <button
      onClick={AddTile}
      class="grid place-items-center rounded-md border-2 border-dashed border-gray-400 text-gray-400"
    >
      <i class="bx bx-plus"></i>
    </button>
  );
};

export default AddTileBtn;
