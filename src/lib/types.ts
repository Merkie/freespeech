import type { User, Project, Page, Tile } from "@prisma/client";

export type PageWithTiles = Page & {
  tiles: Tile[];
};
export type ProjectWithPages = Project & {
  pages: PageWithTiles[];
};
export type UserWithProjects = User & {
  projects: ProjectWithPages[];
};
export type AppModes = "home" | "edit" | "keyboard";
export type EditModeToolSelections =
  | "text"
  | "image"
  | "color"
  | "move"
  | "accent"
  | "invisible"
  | "folder"
  | "link"
  | "delete"
  | "settings"
  | "";
