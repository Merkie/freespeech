import { createSignal } from "solid-js";
import { Project, User, LocalSettings } from "./lib/types";
import { createStore } from "solid-js/store";

export const [token, setToken] = createSignal("");
export const [user, setUser] = createSignal<User | null>(null);

export const [projects, setProjects] = createSignal<Project[]>([]);
export const [projectsLoadingState, setProjectsLoadingState] = createSignal<
  "unloaded" | "loading" | "loaded"
>("unloaded");

// Modal states
export const [modal, setModal] = createSignal("");
export const [isModalOpen, setIsModalOpen] = createSignal(false);

// Local settings
export const [localSettings, setLocalSettings] = createStore<LocalSettings>({
  offlineVoice: "",
  elevenLabsVoice: "Rachel",
  voiceGenerator: "offline",
  speakOnTap: true,
  sentenceBuilder: true,
  skinTone: "medium",
  lastVisitedProjectId: "",
});

export type ProjectExpanded = {
  id: string;
  name: string;
  columns: number;
  rows: number;
  homePage: string;
  pages: PageExpanded[];
};

export type PageExpanded = {
  id: string;
  name: string;
  tiles: TileExpanded[];
};

export type TileExpanded = {
  id: string;
  position: {
    type: string;
    x: number;
    y: number;
    innerPageIndex: number;
  };
  text: string;
  displayText?: string;
  backgroundColor?: string;
  borderColor?: string;
  mediaSrc?: string;
  actions?: {
    type: "navigate";
    pageId: string;
  }[];
};

export const [project, setProject] = createStore<{
  data: ProjectExpanded | null;
}>({
  data: null,
});

export const [currentPageId, setCurrentPageId] = createSignal<string | null>(
  null
);
