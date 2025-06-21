import api from "@/lib/api";
import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import {
  currentPageId,
  PageExpanded,
  project,
  setCurrentPageId,
  setLocalSettings,
  setProject,
  TileExpanded,
} from "@/state";
import useMeasure from "@/lib/hooks/useMeasure";
import { cn } from "@/lib/cn";
export default function Page() {
  const params = useParams();

  onMount(async () => {
    // set the last visited project id in local settings
    setLocalSettings("lastVisitedProjectId", params.id);

    // fetch and set the project data
    const { project } = await api.project.viewExpanded(params.id);
    if (!project) return console.log("No project found");

    setProject({
      data: project,
    });
    setCurrentPageId(project.homePage);
  });

  return (
    <div class="h-full w-full grid grid-cols-1 grid-rows-[56px_100px_1fr]">
      <div class="h-full w-full bg-zinc-900 text-zinc-50"></div>
      <div class="h-full w-full bg-zinc-50 border-b border-zinc-200"></div>
      <TilePageContainer />
    </div>
  );
}

function TilePageContainer() {
  const buttonPages = createMemo(() => {
    const currentPage = project.data?.pages[
      currentPageId() as keyof typeof project.data.pages
    ] as PageExpanded;

    const tiles = Object.values(currentPage?.tiles || {});
    if (!tiles) return [];

    return tiles.reduce((acc, tile) => {
      const pageIndex = tile.position.innerPageIndex || 0;
      (acc[pageIndex] = acc[pageIndex] || []).push(tile);
      return acc;
    }, [] as TileExpanded[][]);
  });

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
        <Show when={project.data}>
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
  tiles: TileExpanded[];
}) {
  return (
    <div
      style={{
        transform: `translateY(${index() * containerSize().height}px)`,
        "grid-template-columns": `repeat(${project.data!.columns}, 1fr)`,
        "grid-template-rows": `repeat(${project.data!.rows}, 1fr)`,
      }}
      class={cn("absolute top-0 left-0 w-full h-full grid p-2 gap-2", {
        "bg-zinc-200": index() % 2 !== 0,
      })}
    >
      <For each={tiles}>
        {(tile) => (
          <button
            onClick={() => {
              const navigateAction = tile.actions?.find(
                (a) => a.type === "navigate"
              );
              if (navigateAction) {
                const pageId = navigateAction.pageId;
                if (pageId) {
                  setCurrentPageId(pageId);
                } else {
                  console.error("No page ID found for navigation action");
                }
              }

              console.log("Tile clicked:", tile);
            }}
            class="h-full w-full relative brightness-100 hover:brightness-105 active:brightness-100 transition-all cursor-pointer"
            style={{
              "grid-column": `${tile.position.x + 1} / span 1`,
              "grid-row": `${tile.position.y + 1} / span 1`,
            }}
          >
            <div
              class={cn(
                "transition grid border rounded-md overflow-hidden absolute top-0 left-0 w-full h-full",
                {
                  "grid-rows-[25%_75%] grid-cols-1": tile.mediaSrc,
                  "place-items-center": !tile.mediaSrc,
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
                      "text-[25px]": tile.mediaSrc,
                    })}
                  >
                    {tile.displayText || tile.text}
                  </p>
                </div>
              </div>
              <Show when={tile.mediaSrc}>
                <img
                  src={tile.mediaSrc}
                  class="h-full w-full object-contain"
                  alt="Tile media"
                ></img>
              </Show>
            </div>
            <Show when={tile.actions?.find((a) => a.type === "navigate")}>
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
