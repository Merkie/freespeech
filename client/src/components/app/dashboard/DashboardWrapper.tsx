import { RouteSectionProps } from "@solidjs/router";
import { Component } from "solid-js";
import Navbar from "./Navbar";
import BottomNav from "../BottomNav";

const DashboardWrapper: Component<RouteSectionProps<unknown>> = (props) => {
  return (
    <div
      style={{
        "grid-template-rows": "56px 1fr 56px",
        "grid-template-columns": "1fr",
      }}
      class="h-[100dvh] w-screen grid"
    >
      <Navbar />
      <div class="h-full w-full overflow-y-auto">{props.children}</div>
      <BottomNav />
    </div>
  );
};

export default DashboardWrapper;
