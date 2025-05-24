import { RouteSectionProps } from "@solidjs/router";
import { Component } from "solid-js";

const AppWrapper: Component<RouteSectionProps<unknown>> = (props) => {
  return (
    <div>
      <h1>App Wrapper</h1>
      {props.children}
    </div>
  );
};

export default AppWrapper;
