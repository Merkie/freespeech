import api from "@/lib/api";
import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { page, project, setPage, setProject } from "@/state";
import useMeasure from "@/lib/hooks/useMeasure";
import { Tile } from "@/lib/types";
import { cn } from "@/lib/cn";
export default function Page() {
  const params = useParams();

  onMount(async () => {
    const { project } = await api.project.view(params.id);
    if (!project) return console.log("No project found");
    setProject(project);

    const homePageId = project.connectedPages.find(
      (page) => page.tilePage.name.toLowerCase() === "home"
    )?.tilePageId;
    if (!homePageId) return console.log("No home page found");

    const { page } = await api.project.viewPage(params.id, homePageId!);
    if (!page) return console.log("No page found");

    setPage(page);
  });

  return (
    <div class="h-full w-full grid grid-cols-1 grid-rows-[56px_100px_1fr]">
      <div class="h-full w-full bg-zinc-900 text-zinc-50"></div>
      <div class="h-full w-full bg-zinc-50 border-b border-zinc-200"></div>
      <ButtonsContainer />
    </div>
  );
}

function ButtonsContainer() {
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
          <ButtonPages containerSize={containerSize} />
          {/* <pre class="absolute top-0 left-0 h-full w-full whitespace-pre-wrap break-words">
            {JSON.stringify(page(), null, 2)}
          </pre> */}
        </Show>
      </div>
    </div>
  );
}

const buttonPages = createMemo(() => {
  if (!page()) return [];

  return (page()!.tilePage.tiles as any[])
    .sort((a, b) => {
      return (a.page || 0) - (b.page || 0); // Sort by page number, defaulting to 0 if undefined
    })
    .reduce((acc, tile) => {
      const pageIndex = tile.page || 0; // Default to 0 if no page is specified
      if (!acc[pageIndex]) {
        acc[pageIndex] = [];
      }
      acc[pageIndex].push(tile);
      return acc;
    }, [] as Tile[][]);
});

function ButtonPages({
  containerSize,
}: {
  containerSize: () => { height: number };
}) {
  return (
    <For each={buttonPages()}>
      {(tiles, index) => (
        <div
          style={{
            transform: `translateY(${index() * containerSize().height}px)`,
            "grid-template-columns": `repeat(${project()!.columns}, 1fr)`,
            "grid-template-rows": `repeat(${project()!.rows}, 1fr)`,
          }}
          class={cn("absolute top-0 left-0 w-full h-full grid p-2 gap-2", {
            "pt-0": index() > 0,
          })}
        >
          <For each={tiles}>
            {(tile) => (
              <button
                class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                style={{
                  "grid-column": `${tile.x + 1} / span 1`,
                  "grid-row": `${tile.y + 1} / span 1`,
                  "font-size": "0.875rem", // Adjust font size as needed
                }}
                onClick={() => {
                  console.log("Tile clicked:", tile);
                }}
              >
                {tile.text || "No Text"}
              </button>
            )}
          </For>
        </div>
      )}
    </For>
  );
}
