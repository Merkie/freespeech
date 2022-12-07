<script context="module" lang="ts">
  // Stores
  import {
    AppMode,
    PageData,
    CurrentProject,
  } from "../../../lib/client/stores";

  // Types
  import type { AppModes, ProjectWithPages } from "../../../lib/types";
  import type { Tile } from "@prisma/client";

  // Store values
  let appModeVal: AppModes;
  AppMode.subscribe((value) => {
    appModeVal = value;
  });
  let pageDataVal: {
    history: string[];
    index: number;
  };
  PageData.subscribe((value) => {
    pageDataVal = value;
  });

  export const createTile = async ({ x, y }: { x: number; y: number }) => {
    //@ts-ignore
    CurrentProject.set((data: ProjectWithPages) => {
      console.log(data);
      return data;
    });
    // CurrentProject.set((data: ProjectWithPages) => ({
    //   ...data,
    //   pages: [
    //     ...data.pages.filter(
    //       (page) => page.name === pageDataVal.history[pageDataVal.index]
    //     ),
    //   ],
    // }));
  };

  // Handles normal tile interaction
  const appTileInteraction = (tile: Tile) => {
    if (tile.navigationPageName) {
    }
  };

  // Routes the tile interaction to the correct function
  const handleTileInteraction = (tile: Tile) => {
    switch (appModeVal) {
      case "edit": {
      }
      case "home": {
        appTileInteraction(tile);
      }
    }
  };
</script>
