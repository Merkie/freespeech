import { writable } from "svelte/store";

export const AppMode = writable("home");
export const Me = writable({});
export const EditModeToolSelection = writable("");
