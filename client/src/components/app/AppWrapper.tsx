import api from "@/lib/api";
import { setUser, user } from "@/state";
import { RouteSectionProps, useNavigate } from "@solidjs/router";
import { Component, onMount, Show } from "solid-js";

const AppWrapper: Component<RouteSectionProps<unknown>> = (props) => {
  const navigate = useNavigate();

  onMount(async () => {
    if (user()) return;

    const token = localStorage.getItem("token");
    if (token) {
      const data = await api.auth.me();
      if (data.user) {
        setUser(data.user);
      }
    }

    if (!user()) {
      navigate("/login");
    }
  });

  return (
    <Show when={user()}>
      <div>
        <h1>App Wrapper</h1>
        {props.children}
      </div>
    </Show>
  );
};

export default AppWrapper;
