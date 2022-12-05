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
// Page Logic
export const CurrentPage = writable<string>("Home");
export const PageIndex = writable<number>(0);
export const PageHistory = writable<string[]>(["Home"]);

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

// Edit Mode
export const TileEditQueue = writable<any>({});
export const EditModeToolSelection = writable<EditModeToolSelections>("");
// Text Editing
export const TextEditTileId = writable<string>(""); // Tile
export const EditingSpeakText = writable<boolean>(false);
// Color Editing
export const EditModeColorSelectedValue = writable<string>("500");
export const EditModeColorSelectedShade = writable<string>("gray");
export const EditModeColorSelectedType = writable<string>("border");
// Swap Editing
export const EditModeSwapTile = writable<Tile | null>(null); // Tile
// Folder Editing
export const CreateFolderTile = writable<Tile | null>(null); // Tile

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
