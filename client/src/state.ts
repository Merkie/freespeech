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

export const [project, setProject] = createSignal<Project | null>(null);
