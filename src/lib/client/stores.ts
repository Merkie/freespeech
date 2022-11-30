import type { Tile } from "@prisma/client";
import { writable } from "svelte/store";
import type {
  UserWithProjects,
  AppModes,
  EditModeToolSelections,
  ProjectWithPages,
} from "../types";

// App Logic
export const AppMode = writable<AppModes>("home");
export const Me = writable<UserWithProjects>({} as UserWithProjects);
export const EditModeToolSelection = writable<EditModeToolSelections>("");
export const CurrentProject = writable<ProjectWithPages>(
  {} as ProjectWithPages
);
export const CurrentPage = writable<string>("Home");
export const TextEditTileId = writable<string>("");
export const TileEditQueue = writable<any>({});
export const Loading = writable<boolean>(false);
export const EditingSpeakText = writable<boolean>(false);
export const EditModeColorSelectedValue = writable<string>("500");
export const EditModeColorSelectedShade = writable<string>("gray");
export const EditModeColorSelectedType = writable<string>("border");
export const EditModeSwapTile = writable<Tile | null>(null);
export const CreateFolderTile = writable<Tile | null>(null);
export const PageHistory = writable<string[]>(["Home"]);
export const PageIndex = writable<number>(0);
export const Sentence = writable<Tile[]>([]);

// Modal Logic
export const ModalCreateProjectOpen = writable(false);
export const ModalProjectSettingsOpen = writable(false);

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
