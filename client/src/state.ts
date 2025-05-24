import { createSignal } from "solid-js";
import { Project, User } from "./lib/types";

export const [token, setToken] = createSignal("");
export const [user, setUser] = createSignal<User | null>(null);

export const [projects, setProjects] = createSignal<Project[]>([]);
export const [projectsLoadingState, setProjectsLoadingState] = createSignal<
  "unloaded" | "loading" | "loaded"
>("unloaded");
