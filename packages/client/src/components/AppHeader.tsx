import { Link } from '@solidjs/router';
import { Component } from 'solid-js';
import { css } from 'solid-styled';
import { Colors } from "@blueprintjs/core";
import { Icon } from 'solid-heroicons';
import { chatAlt_2, cog } from "solid-heroicons/solid";


export const AppHeader: Component = () => {
  css`
    header {
      background-color: var(--brand-color);
      color: white;
      height: 20px;
      display: flex;
      gap: 10px;
      align-items: center;
      padding: 5px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .spacer {
      flex: 1;
    }
  `;
  return (
    <header>
      <p class="brand">
        <Icon width={20} path={chatAlt_2} /> FreeSpeech <span>AAC</span>
      </p>
      <div class="spacer"></div>
      <Link class="nav-item" href="/"><Icon width={20} path={cog} /></Link>
    </header>
  );
};