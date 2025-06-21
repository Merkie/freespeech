import api from "@/lib/api";
import { createSignal, onMount, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { project, setProject } from "@/state";
import useMeasure from "@/lib/hooks/useMeasure";
export default function Page() {
  const params = useParams();

  onMount(async () => {
    const { project } = await api.project.view(params.id);
    setProject(project);
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
        <Show when={project()}>
          <pre>{JSON.stringify(project(), null, 2)}</pre>
        </Show>
      </div>
    </div>
  );
}
