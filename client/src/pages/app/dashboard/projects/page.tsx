import api from "@/lib/api";
import {
  projects,
  projectsLoadingState,
  setProjects,
  setProjectsLoadingState,
  user,
} from "@/state";
import { onMount } from "solid-js";

export default function Page() {
  onMount(async () => {
    if (projectsLoadingState() === "unloaded") {
      setProjectsLoadingState("loading");

      const { projects } = await api.project.list();
      if (projects) setProjects(projects);

      setProjectsLoadingState("loaded");
    }
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome to the dashboard! Here you can manage your projects and
        settings.
      </p>
      <p>Use the navigation menu to explore different sections.</p>
      <pre>
        {JSON.stringify({ user: user(), projects: projects() }, null, 2)}
      </pre>
    </div>
  );
}
