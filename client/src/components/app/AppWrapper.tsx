import api from "@/lib/api";
import { setUser, user } from "@/state";
import { RouteSectionProps, useNavigate } from "@solidjs/router";
import { Component, onMount, Show } from "solid-js";

const AppWrapper: Component<RouteSectionProps<unknown>> = (props) => {
  const navigate = useNavigate();

  onMount(async () => {
    // If the user is already set, no need to fetch again
    if (user()) return;

    // Set the user from the token in local storage
    const token = localStorage.getItem("token");
    if (token) {
      const data = await api.auth.me();
      if (data.user) {
        setUser(data.user);
      }
    }

    // If for whatever reason the user is still not set, redirect to login
    if (!user()) {
      navigate("/login");
    }
  });

  // Show the children only if the user is set
  return <Show when={user()}>{props.children}</Show>;
};

export default AppWrapper;
