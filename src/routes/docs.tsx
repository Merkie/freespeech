import { Icon } from "solid-heroicons";
import { arrowSmRight } from "solid-heroicons/outline";
import { createSignal, For, Show } from "solid-js";
import SiteHeader from "~/components/SiteHeader";

import "~/styles/docs.css";

export default function Documentation() {
  const [currentPage, setCurrentPage] = createSignal(0);

  const docsContent = [
    { name: "Introduction" },
    {
      name: "Getting Started",
      inner: [{ name: "Installation" }, { name: "Usage" }],
    },
    { name: "Interface" },
  ];

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
                  class={`inner-pages ${
                    Math.floor(currentPage()) == i()
                      ? "inner-open"
                      : "inner-closed"
                  }`}
                >
                  <For each={page.inner}>
                    {(innerPage, j) => {
                      return (
                        <p
                          onClick={() =>
                            setCurrentPage(
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
    </>
  );
}
