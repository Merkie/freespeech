import type { Tile } from "@prisma/client";
import { writable } from "svelte/store";
import type {
  UserWithProjects,
  AppModes,
  EditModeToolSelections,
  ProjectWithPages,
} from "../types";

// App Logic
export const Loading = writable<boolean>(false);
export const Me = writable<UserWithProjects>({} as UserWithProjects);
export const AppMode = writable<AppModes>("home");
export const CurrentProject = writable<ProjectWithPages>(
  {} as ProjectWithPages
);
export const Sentence = writable<Tile[]>([]);
// Page Logic
export const PageData = writable<{
  history: string[];
  index: number;
}>({
  history: ["Home"],
  index: 0,
});
export const CurrentPage = writable<string>("Home");
export const PageIndex = writable<number>(0);
export const PageHistory = writable<string[]>(["Home"]);
// Edit Mode Data
export const EditModeData = writable<{
  tool: EditModeToolSelections | string;
  queue: any;
  tile?: Tile;
  opts?: {
    speakText?: boolean;
    colorValue?: string;
    colorShade?: string;
    colorType?: "text" | "background" | "border";
  };
}>({
  tool: "",
  queue: {},
  opts: {
    speakText: false,
    colorValue: "500",
    colorShade: "red",
    colorType: "border",
  },
});
// Modal Data
export const ModalData = writable({
  createProject: false,
});

// Persistent Logic
// Me
const storedMe = localStorage.getItem("me");
try {
  if (storedMe) Me.set(JSON.parse(storedMe));
} catch {}
Me.subscribe((value) => {
  localStorage.setItem("me", JSON.stringify(value));
});
// CurrentProject
const storedCurrentProject = localStorage.getItem("currentProject");
try {
  if (storedCurrentProject)
    CurrentProject.set(JSON.parse(storedCurrentProject));
} catch {}
CurrentProject.subscribe((value) => {
  localStorage.setItem("currentProject", JSON.stringify(value));
});
