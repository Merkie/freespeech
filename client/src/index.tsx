/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import LoginPage from "./pages/login/page";
import RegisterPage from "./pages/register/page";
import RegisterEmailPage from "./pages/register/email/page";
import LoginEmailPage from "./pages/login/email/page";
import AppWrapper from "./components/app/AppWrapper";
import DashboardProjectsPage from "./pages/app/dashboard/projects/page";
import NotFoundPage from "./pages/not-found/page";
import DashboardWrapper from "./components/app/dashboard/DashboardWrapper";
import ProjectIdPage from "./pages/app/project/:id/page";

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/register/email" component={RegisterEmailPage} />
      <Route path="/login/email" component={LoginEmailPage} />
      <Route path="/app" component={AppWrapper}>
        <Route path="/project/:id" component={ProjectIdPage} />
        <Route path="/dashboard" component={DashboardWrapper}>
          <Route path="/projects" component={DashboardProjectsPage} />
        </Route>
      </Route>
      <Route path="*404" component={NotFoundPage} />
    </Router>
  ),
  root!
);
