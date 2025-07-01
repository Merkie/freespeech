import { ValidComponent } from "solid-js";

const modules = import.meta.glob("./*.tsx", { eager: true });

const modals = Object.entries(modules).reduce((acc, [_, module]) => {
  const moduleDefault = (module as any).default;
  if (!moduleDefault) return acc;
  if (
    !moduleDefault.modal_title ||
    !moduleDefault.modal_component ||
    !moduleDefault.modal_id
  ) {
    console.warn("Modal module is missing required properties:", moduleDefault);
    return acc;
  }

  acc[moduleDefault.modal_id] = moduleDefault;

  return acc;
}, {} as Record<string, { modal_title: string; modal_component: ValidComponent; modal_id: string }>);

export default modals;
