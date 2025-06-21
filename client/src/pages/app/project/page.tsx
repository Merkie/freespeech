import { project } from "@/state";
import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

export default function Page() {
  const navigate = useNavigate();
  onMount(() => {
    if (project.data?.id) {
      navigate(`/app/project/${project.data.id}`);
    } else {
      navigate("/app/dashboard/projects");
    }
  });

  return <div></div>;
}
