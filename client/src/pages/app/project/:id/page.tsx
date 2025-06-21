import api from "@/lib/api";
import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { page, project, setLocalSettings, setPage, setProject } from "@/state";
import useMeasure from "@/lib/hooks/useMeasure";
import { Tile } from "@/lib/types";
import { cn } from "@/lib/cn";
export default function Page() {
  const params = useParams();

  onMount(async () => {
    // set the last visited project id in local settings
    setLocalSettings("lastVisitedProjectId", params.id);

    // -- data fetching --

    // 1) Fetch the project by ID
    const { project } = await api.project.view(params.id);
    if (!project) return console.log("No project found");
    setProject(project);

    // 2) Parse the home page from the project
    const homePageId = project.connectedPages.find(
      (page) => page.tilePage.name.toLowerCase() === "home"
    )?.tilePageId;
    if (!homePageId) return console.log("No home page found");

    // 3) Fetch the home page by ID
    const { page } = await api.project.viewPage(params.id, homePageId!);
    if (!page) return console.log("No page found");
    setPage(page);
  });

  return (
    <div class="h-full w-full grid grid-cols-1 grid-rows-[56px_100px_1fr]">
      <div class="h-full w-full bg-zinc-900 text-zinc-50"></div>
      <div class="h-full w-full bg-zinc-50 border-b border-zinc-200"></div>
      <TilePageContainer />
    </div>
  );
}

const buttonPages = createMemo(() => {
  const tiles = page()?.tilePage.tiles as Tile[];
  if (!tiles) return [];

  return tiles.reduce((acc, tile) => {
    const pageIndex = tile.page || 0;
    (acc[pageIndex] = acc[pageIndex] || []).push(tile);
    return acc;
  }, [] as Tile[][]);
});

function TilePageContainer() {
  const [containerRef, setContainerRef] = createSignal<HTMLElement | undefined>(
    undefined
  );
  const containerSize = useMeasure(containerRef);

  return (
    <div
      ref={setContainerRef}
      class="h-full w-full bg-zinc-100 relative overflow-auto"
    >
      <p class="absolute bottom-2 right-2 text-blue-500">
        {containerSize().height}px
      </p>
      <div class="h-full w-full absolute top-0 left-0">
        <Show when={page()}>
          <For each={buttonPages()}>
            {(tiles, index) => (
              <PageSection
                index={index}
                containerSize={containerSize}
                tiles={tiles}
              />
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}

function PageSection({
  index,
  containerSize,
  tiles,
}: {
  index: () => number;
  containerSize: () => { height: number };
  tiles: Tile[];
}) {
  return (
    <div
      style={{
        transform: `translateY(${index() * containerSize().height}px)`,
        "grid-template-columns": `repeat(${project()!.columns}, 1fr)`,
        "grid-template-rows": `repeat(${project()!.rows}, 1fr)`,
      }}
      class={cn("absolute top-0 left-0 w-full h-full grid p-2 gap-2", {
        "bg-zinc-200": index() % 2 !== 0,
      })}
    >
      <For each={tiles}>
        {(tile) => (
          <button
            onClick={() => {
              console.log("Tile clicked:", tile);
            }}
            class="h-full w-full relative brightness-100 hover:brightness-105 active:brightness-100 transition-all cursor-pointer"
            style={{
              "grid-column": `${tile.x + 1} / span 1`,
              "grid-row": `${tile.y + 1} / span 1`,
            }}
          >
            <div
              class={cn(
                "transition grid border rounded-md overflow-hidden absolute top-0 left-0 w-full h-full",
                {
                  "grid-rows-[25%_75%] grid-cols-1": tile.image,
                  "place-items-center": !tile.image,
                }
              )}
              style={{
                "background-color": tile.backgroundColor,
                "border-color": tile.borderColor,
              }}
            >
              <div class="relative h-full w-full">
                <div class="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                  <p
                    style="font-size: 25px;"
                    class={cn("text-[2vw] flex-1 truncate px-2 text-center", {
                      "text-[25px]": tile.image,
                    })}
                  >
                    {tile.displayText || tile.text}
                  </p>
                </div>
              </div>
              <Show when={tile.image}>
                <img
                  src={tile.image}
                  class="h-full w-full object-contain"
                  alt="Tile media"
                ></img>
              </Show>
            </div>
            <Show when={tile.navigation}>
              <div
                style={{
                  "background-color": tile.backgroundColor,
                  "border-color": tile.borderColor,
                }}
                class="absolute -top-1 left-0 h-[10px] w-[50%] rounded-t-md border border-b-0"
              ></div>
            </Show>
          </button>
        )}
      </For>
    </div>
  );
}
