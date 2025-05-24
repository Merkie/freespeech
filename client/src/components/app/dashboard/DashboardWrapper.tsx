import { RouteSectionProps } from "@solidjs/router";
import { Component } from "solid-js";
import Navbar from "./Navbar";

const DashboardWrapper: Component<RouteSectionProps<unknown>> = (props) => {
  return (
    <div class="w-full h-full grid grid-cols-1 grid-rows-[56px_1fr]">
      <Navbar />
      <div class="h-full w-full overflow-y-auto">{props.children}</div>
    </div>
  );
};

export default DashboardWrapper;
