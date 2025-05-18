/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import LoginPage from "./pages/login/page";
import RegisterPage from "./pages/register/page";
import RegisterEmailPage from "./pages/register/email/page";
import LoginEmailPage from "./pages/login/email/page";

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/register/email" component={RegisterEmailPage} />
      <Route path="/login/email" component={LoginEmailPage} />
    </Router>
  ),
  root!
);
