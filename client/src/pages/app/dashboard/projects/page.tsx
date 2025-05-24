import api from "@/lib/api";
import {
  projects,
  projectsLoadingState,
  setProjects,
  setProjectsLoadingState,
  localSettings,
  setModal,
  setIsModalOpen,
  modal,
  isModalOpen,
} from "@/state";
import { createSignal, onMount, createMemo, Show, For, JSX } from "solid-js";
import Fuse from "fuse.js";
import { Project } from "@/lib/types";
import { cn } from "@/lib/cn";

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
    const lastVisitedId = localSettings().lastVisitedProjectId;

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

      <main
        class={cn(
          "bg-[rgba(0,0,0,0.75)] absolute top-0 left-0 w-full h-full grid place-items-center transition-all",
          {
            "pointer-events-none opacity-0": !isModalOpen(),
            "pointer-events-auto opacity-100": isModalOpen(),
          }
        )}
      >
        <ModalContainer>
          <CreateProjectModal />
        </ModalContainer>
      </main>
    </>
  );
}

function ProjectCard(props: { project: Project }) {
  const isSelected = createMemo(
    () => localSettings().lastVisitedProjectId === props.project.id
  );

  return (
    <div class="relative">
      <a
        href={`/app/project/${props.project.id}`}
        class={`relative flex h-fit w-full flex-col gap-4 rounded-lg border border-zinc-300 bg-zinc-200 p-2 shadow-sm ${
          isSelected()
            ? "border-blue-200 ring-4 ring-blue-200 ring-offset-2 ring-offset-zinc-100"
            : ""
        }`}
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
      </a>
    </div>
  );
}

function ModalContainer({ children }: { children: JSX.Element }) {
  return (
    <div
      class={cn(
        "flex max-h-[90%] transition-all w-[100%] flex-col overflow-y-auto border border-zinc-800 bg-zinc-900 p-6 text-zinc-200 shadow-md sm:w-[90%] sm:max-w-[500px] sm:rounded-xl",
        {
          "translate-y-[10px] opacity-0": !isModalOpen(),
        }
      )}
    >
      {children}
    </div>
  );
}

function ModalTitle({
  title,
  children,
}: { title?: string; children?: JSX.Element } = {}) {
  return (
    <div class="mb-2 flex items-center justify-between gap-2">
      <Show when={title} fallback={children}>
        <p class="text-lg font-bold">{title}</p>
      </Show>
      <button
        class="cursor-pointer"
        onClick={() => {
          setIsModalOpen(false);
        }}
      >
        <i class="bi bi-x-lg flex items-center"></i>
      </button>
    </div>
  );
}

function CreateProjectModal() {
  const [step, setStep] = createSignal<
    "type" | "blank" | "template" | "import"
  >("type");
  const [name, setName] = createSignal("");
  const [columns, setColumns] = createSignal(6);
  const [rows, setRows] = createSignal(4);
  const [showAdvanced, setShowAdvanced] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setStep("type");
    setName("");
    setColumns(6);
    setRows(4);
    setShowAdvanced(false);
    setLoading(false);
  };

  const createProject = async () => {
    if (loading() || !name().trim()) return;
    setLoading(true);

    try {
      const response = await api.project.create({
        name: name().trim(),
        columns: columns(),
        rows: rows(),
      });

      if (response.error) {
        alert(response.error);
        setLoading(false);
        return;
      }

      if (response.projectId) {
        await api.project.updateThumbnail(response.projectId);
        // Update projects list
        const { projects: updatedProjects } = await api.project.list();
        if (updatedProjects) setProjects(updatedProjects);
        closeModal();
        window.location.assign(`/app/project/${response.projectId}`);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setLoading(false);
    }
  };

  return (
    <Show when={modal() === "create project"}>
      <ModalTitle title={"Create Project"} />

      <Show when={step() === "type"}>
        <div class="grid grid-rows-3 gap-4">
          <ProjectTypeButton
            icon="plus-square-dotted"
            title="Blank Project"
            description="Start from scratch with an empty project"
            onClick={() => setStep("blank")}
          />
          <ProjectTypeButton
            icon="file-earmark-code"
            title="Use Template"
            description="Choose from pre-made project templates"
            onClick={() => setStep("template")}
          />
          <ProjectTypeButton
            icon="file-earmark-arrow-up"
            title="Import File"
            description="Import an existing project from a file"
            onClick={() => setStep("import")}
          />
        </div>
      </Show>

      <Show when={step() === "blank"}>
        <div class="space-y-4">
          <button
            onClick={() => setStep("type")}
            class="mb-4 text-sm text-zinc-500 hover:text-zinc-700"
          >
            <i class="bi bi-arrow-left" /> Back
          </button>

          <div>
            <label class="mb-2 block text-sm font-medium">Project name:</label>
            <input
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              class="w-full rounded-md border border-zinc-300 p-2 px-4 text-zinc-800"
              placeholder="Enter project name"
            />
          </div>

          <Show
            when={showAdvanced()}
            fallback={
              <button
                onClick={() => setShowAdvanced(true)}
                class="text-sm text-blue-600 hover:underline"
              >
                Show advanced settings
              </button>
            }
          >
            <div>
              <label class="mb-2 block text-sm font-medium">
                Project Dimensions:
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  value={columns()}
                  onInput={(e) =>
                    setColumns(parseInt(e.currentTarget.value) || 6)
                  }
                  class="w-1/2 rounded-md border border-zinc-300 p-2 text-zinc-800"
                  placeholder="Columns"
                  min="1"
                  max="20"
                />
                <span>×</span>
                <input
                  type="number"
                  value={rows()}
                  onInput={(e) => setRows(parseInt(e.currentTarget.value) || 4)}
                  class="w-1/2 rounded-md border border-zinc-300 p-2 text-zinc-800"
                  placeholder="Rows"
                  min="1"
                  max="20"
                />
              </div>
            </div>
          </Show>

          <button
            onClick={createProject}
            disabled={!name().trim() || loading()}
            class="w-full rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50 transition-all disabled:pointer-events-none disabled:opacity-50"
          >
            {loading() ? "Creating..." : "Create Project"}
          </button>
        </div>
      </Show>

      <Show when={step() === "template"}>
        <div class="text-center">
          <button
            onClick={() => setStep("type")}
            class="mb-4 text-sm text-zinc-500 hover:text-zinc-700"
          >
            <i class="bi bi-arrow-left" /> Back
          </button>
          <p class="text-zinc-500">Templates coming soon...</p>
        </div>
      </Show>

      <Show when={step() === "import"}>
        <div class="text-center">
          <button
            onClick={() => setStep("type")}
            class="mb-4 text-sm text-zinc-500 hover:text-zinc-700"
          >
            <i class="bi bi-arrow-left" /> Back
          </button>
          <p class="text-zinc-500">Import functionality coming soon...</p>
        </div>
      </Show>
    </Show>
  );
}

function ProjectTypeButton({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      class="grid w-full cursor-pointer place-items-center rounded-lg bg-zinc-800 transition-all hover:brightness-110 active:brightness-90"
    >
      <div class="flex flex-col items-center p-4 text-center text-white">
        <i class={`bi bi-${icon} mb-4 text-5xl`}></i>
        <p class="text-xl font-semibold opacity-80">{title}</p>
        <p class="text-sm opacity-60">{description}</p>
      </div>
    </button>
  );
}
