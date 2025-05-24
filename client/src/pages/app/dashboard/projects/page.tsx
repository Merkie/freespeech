import api from "@/lib/api";
import {
  projects,
  projectsLoadingState,
  setProjects,
  setProjectsLoadingState,
  localSettings,
  setModal,
  setIsModalOpen,
  setLocalSettings,
} from "@/state";
import { createSignal, onMount, createMemo, Show, For } from "solid-js";
import Fuse from "fuse.js";
import { Project } from "@/lib/types";
import { cn } from "@/lib/cn";
import { A } from "@solidjs/router";

export default function Page() {
  const [searchQuery, setSearchQuery] = createSignal("");

  onMount(async () => {
    if (projectsLoadingState() === "unloaded") {
      setProjectsLoadingState("loading");

      const { projects: projectsData } = await api.project.list();
      if (projectsData) setProjects(projectsData);

      setProjectsLoadingState("loaded");
    }

    // Open create modal if no projects exist
    if (projects().length === 0) {
      setModal("create project");
      setIsModalOpen(true);
    }
  });

  const searchedProjects = createMemo(() => {
    const query = searchQuery();
    if (!query.trim()) return projects();

    const fuse = new Fuse(projects(), {
      keys: ["name", "description"],
      threshold: 0.3,
    });
    return fuse.search(query).map((result) => result.item);
  });

  const sortedProjects = createMemo(() => {
    const projectsList = searchedProjects();
    const lastVisitedId = localSettings.lastVisitedProjectId;

    return [...projectsList].sort((a, b) => {
      if (a.id === lastVisitedId) return -1;
      if (b.id === lastVisitedId) return 1;
      return 0;
    });
  });

  return (
    <>
      {/* Search Bar */}
      <div class="mb-2 flex items-center gap-2 border-b border-zinc-300 p-2">
        <div class="flex flex-1 items-center gap-2 rounded-md border border-zinc-300 bg-zinc-200 p-1 px-4 text-sm">
          <i class="bi bi-search" />
          <input
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            placeholder="Search..."
            type="text"
            class="flex-1 bg-transparent p-1 outline-none"
          />
        </div>
        <button
          onClick={() => {
            setModal("create project");
            setIsModalOpen(true);
          }}
          class="hidden rounded-md border gap-2 items-center border-blue-500 bg-blue-600 p-2 px-4 text-sm text-blue-50 sm:flex cursor-pointer"
        >
          <i class="bi bi-plus-lg" />
          <span>Create New Project</span>
        </button>
        <button
          onClick={() => {
            setModal("manage projects");
            setIsModalOpen(true);
          }}
          class="hidden rounded-md border gap-2 items-center border-zinc-600 bg-zinc-700 p-2 px-4 text-sm text-zinc-50 sm:flex cursor-pointer"
        >
          <i class="bi bi-gear" />
          <span>Manage Projects</span>
        </button>
      </div>

      {/* Loading State */}
      <Show when={projectsLoadingState() === "loading"}>
        <div class="flex justify-center p-8">
          <div class="text-lg text-zinc-600">Loading projects...</div>
        </div>
      </Show>

      {/* Projects Grid */}
      <Show when={projectsLoadingState() === "loaded"}>
        <div class="m-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <For each={sortedProjects()}>
            {(project) => <ProjectCard project={project} />}
          </For>
        </div>
      </Show>

      {/* Empty State */}
      <Show
        when={projectsLoadingState() === "loaded" && projects().length === 0}
      >
        <div class="flex flex-col items-center justify-center p-16 text-center">
          <i class="bi bi-folder-plus mb-4 text-6xl text-zinc-400" />
          <h2 class="mb-2 text-xl font-semibold text-zinc-700">
            No Projects Yet
          </h2>
          <p class="mb-6 text-zinc-500">
            Create your first project to get started
          </p>
        </div>
      </Show>
    </>
  );
}

function ProjectCard(props: { project: Project }) {
  const isSelected = () =>
    localSettings.lastVisitedProjectId === props.project.id;

  return (
    <A
      onClick={() => {
        setLocalSettings("lastVisitedProjectId", props.project.id);
      }}
      href={`/app/project/${props.project.id}`}
      class={cn(
        "relative flex h-fit w-full flex-col gap-4 rounded-lg border border-zinc-300 bg-zinc-200 p-2 shadow-sm",
        {
          "border-blue-200 ring-4 ring-blue-200 ring-offset-2 ring-offset-zinc-100":
            isSelected(),
        }
      )}
    >
      <Show
        when={props.project.imageUrl}
        fallback={
          <div class="aspect-video w-full rounded-md bg-zinc-100 p-1 flex items-center justify-center">
            <i class="bi bi-image text-4xl text-zinc-400" />
          </div>
        }
      >
        <img
          src={import.meta.env.VITE_R2_URL + props.project.imageUrl!}
          class="aspect-video w-full rounded-md bg-zinc-100 object-cover p-1 text-zinc-100"
          alt="preview"
          width={100}
        />
      </Show>
      <div class="flex w-full items-center gap-2 text-lg">
        <p class="flex-1 truncate whitespace-nowrap">{props.project.name}</p>
        <Show when={isSelected()}>
          <div class="rounded-md bg-blue-500 p-1 px-2 text-sm font-bold text-white shadow-md">
            SELECTED
          </div>
        </Show>
      </div>
      <Show when={isSelected()}>
        <div class="pointer-events-none absolute left-0 top-0 h-full w-full bg-blue-200/[20%]" />
      </Show>
    </A>
  );
}
