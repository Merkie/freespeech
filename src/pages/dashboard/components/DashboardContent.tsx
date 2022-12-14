import { Show } from "solid-js";
import Library from "./Library";

function DashboardContent({ category }: { category: string }) {
  return (
    <div class="flex-1 rounded-md border border-gray-700 bg-gray-800 p-4 shadow-md">
      <Show when={category === "library"}>
        <Library />
      </Show>
    </div>
  );
}

export default DashboardContent;
