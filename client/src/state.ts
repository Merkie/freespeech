import { createSignal } from "solid-js";
import { Project, User, LocalSettings } from "./lib/types";

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
export const [localSettings, setLocalSettings] = createSignal<LocalSettings>({
  offlineVoice: "",
  elevenLabsVoice: "Rachel",
  voiceGenerator: "offline",
  speakOnTap: true,
  sentenceBuilder: true,
  skinTone: "medium",
  lastVisitedProjectId: "",
});

// Initialize local settings from localStorage
if (typeof localStorage !== "undefined") {
  const saved = localStorage.getItem("localSettings");
  if (saved) {
    setLocalSettings({ ...localSettings(), ...JSON.parse(saved) });
  }

  // Save local settings when they change
  let isInitializing = true;
  setTimeout(() => {
    isInitializing = false;
  }, 0);

  (() => {
    let prev = localSettings();
    return setInterval(() => {
      const current = localSettings();
      if (!isInitializing && current !== prev) {
        localStorage.setItem("localSettings", JSON.stringify(current));
        prev = current;
      }
    }, 100);
  })();
}
