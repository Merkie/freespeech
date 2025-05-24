import { createSignal } from "solid-js";
import { User } from "./lib/types";

export const [token, setToken] = createSignal("");
export const [user, setUser] = createSignal<User | null>(null);
