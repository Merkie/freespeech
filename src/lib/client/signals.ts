import type { Tile } from "@prisma/client";
import { createSignal } from "solid-js";
import { AppModes, ProjectWithPages } from "../types";

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
export const [Project, setProject] = createSignal<ProjectWithPages>({
  rows: 5,
  columns: 8,
  pages: [
    {
      id: "1",
      name: "Home",
      tiles: [
        {
          id: "1",
          x: 1,
          y: 1,
          text: "1,1 tile",
        },
        {
          id: "2",
          x: 3,
          y: 4,
          text: "3,4 tile",
        },
      ],
    },
  ],
} as unknown as ProjectWithPages);
export const [Page, setPage] = createSignal("1"); // ID of the current page
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
