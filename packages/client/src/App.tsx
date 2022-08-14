import type { Component } from 'solid-js';
import { Routes, Route } from '@solidjs/router';

import Home from "./pages/Home";
import About from "./pages/About";
import { css } from 'solid-styled';

const App: Component = () => {

  css`
    @global {
      * {
        margin: 0;
      }

      :root {
        --brand-color: #0052D0;
      }

      body {
        font-family: sans-serif;
      }

      a {
        text-decoration: none;
        color: inherit;
      }
    }
  `

  return (
    <Routes>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Routes>
  );
};

export default App;
