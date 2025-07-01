import api from "@/lib/api";
import { modal, setProjects } from "@/state";
import { createSignal, Show } from "solid-js";
import { ModalTitle } from "../ModalTitle";

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
      <ModalTitle title={"Create Project"} onClose={closeModal} />
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
        <div class="flex flex-col">
          <div class="flex flex-col">
            <p class="mb-2 ">Project name:</p>
            <input
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              class="w-full rounded-md border bg-white border-zinc-300 p-2 px-4 text-zinc-900"
              placeholder="Enter project name"
            />
          </div>

          <Show
            when={showAdvanced()}
            fallback={
              <button
                onClick={() => setShowAdvanced(true)}
                class="text-sm hover:underline w-fit text-left my-4 cursor-pointer"
              >
                Show advanced settings
              </button>
            }
          >
            <div class="my-4">
              <p class="mb-2"> Project Dimensions:</p>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  value={columns()}
                  onInput={(e) =>
                    setColumns(parseInt(e.currentTarget.value) || 6)
                  }
                  class="flex-1 rounded-md border bg-white border-zinc-300 p-2 px-4 text-zinc-900"
                  placeholder="Columns"
                  min="1"
                  max="20"
                />
                <span>×</span>
                <input
                  type="number"
                  value={rows()}
                  onInput={(e) => setRows(parseInt(e.currentTarget.value) || 4)}
                  class="flex-1 rounded-md border bg-white border-zinc-300 p-2 px-4 text-zinc-900"
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

export default {
  modal_title: "Create Project",
  modal_component: CreateProjectModal,
  modal_id: "create project",
};
