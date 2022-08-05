import { Icon } from "solid-heroicons";
import { arrowSmRight } from "solid-heroicons/outline";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import SiteHeader from "~/components/SiteHeader";
import {micromark} from 'micromark';

import "~/styles/docs.css";
import { IDocs } from "~/types/ApiTypes";

export default function Documentation() {
  // Ref for the content div, thats where markdown gets compiled to
  let content: HTMLDivElement;
  
  // Float for the current page the user is viewing.
  const [currentPage, setCurrentPage] = createSignal(0.0);

  // Content of the docs
  const docsContent: IDocs[] = [
    { name: "Introduction", content: "introduction" },
    {
      name: "Getting Started",
      inner: [{ name: "Installation" }, { name: "Usage" }],
    },
    { name: "Interface" },
  ];

  // Function for fetching the docs, maybe make this in API
  const renderContent = async () => {
    const response = fetch(`/docs/${docsContent[currentPage()].content}.md`);
    response.then(res => res.text()).then(text => { content.innerHTML = micromark(text); });
  };

  // This is where the page gets rerendered if the current page changes
  // I think you have to use a signal here to make sure the page is rerendered
  // so thats why theres a log.
  createEffect(() => {
    console.log('Rendering docs for index: '+currentPage());
    renderContent();
  });

  return (
    <>
      <SiteHeader />
      <div class="left-col">
        <For each={docsContent}>
          {(page, i) => {
            return (
              <>
                <p
                  class={`${
                    Math.floor(currentPage()) == i() ? "selected" : ""
                  }`}
                  onClick={() => setCurrentPage(i())}
                >
                  {page.name}
                  <Show when={page.inner}>
                    <Icon path={arrowSmRight} />
                  </Show>
                </p>
                <div
                  class="inner-pages"
                  style={{"display": currentPage() == i() ? "block" : "none"}}
                >
                  <For each={page.inner}>
                    {(innerPage, j) => {
                      return (
                        <p
                          onClick={() =>
                            setCurrentPage(
                              // TODO: Maybe find something less complicated than this sketch vv
                              // Basically the issue is that I need a way to get the index of the page
                              // and subpage. I use this float system but it requires 3 casts,
                              // float int and string
                              parseFloat(
                                `${Math.floor(currentPage())}.${j() + 1}`
                              )
                            )
                          }
                          class={`inner-page ${
                            currentPage() ==
                            parseFloat(
                              `${Math.floor(currentPage())}.${j() + 1}`
                            )
                              ? "inner-select"
                              : ""
                          }`}
                        >
                          {innerPage.name}
                        </p>
                      );
                    }}
                  </For>
                </div>
              </>
            );
          }}
        </For>
      </div>
      <div ref={content} class="content"></div>
    </>
  );
}
