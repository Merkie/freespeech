import type { Tile } from "@prisma/client";
import { createSignal } from "solid-js";
import type { AppModes } from "../types";

type AppSettings = {
  keyboardEnabled: boolean;
  guidedAccess: {
    enabled: boolean; // If guided access is enabled
    password: string; // Guided access password
  };
  voice: {
    offline: string; // The offline voice being used
    online: string; // The online voice being used
    default: "offline" | "online"; // The default voice to use
  };
};

export const [AppSettings, setAppSettings] = createSignal<AppSettings>({
  keyboardEnabled: false,
  guidedAccess: {
    enabled: false,
    password: "",
  },
  voice: {
    offline: "",
    online: "",
    default: "offline",
  },
});
export const [EditModeData, setEditModeData] = createSignal<{
  selectedTool: string;
}>({
  selectedTool: "text",
});

export const [AppMode, setAppMode] = createSignal<AppModes>("home");
export const [Sentence, setSentence] = createSignal<(Tile | string)[]>([]);
export const [CloudVoiceVariant, setCloudVoiceVariant] = createSignal<
  string | undefined
>(undefined);
