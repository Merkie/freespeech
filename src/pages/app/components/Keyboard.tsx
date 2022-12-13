import {
  AppMode,
  Sentence,
  setSentence,
  CloudVoiceVariant,
  setCloudVoiceVariant,
} from "../../../lib/client/signals";
import Key from "./Key";
import ListBox from "../../../components/ListBox";
import { createEffect, createSignal } from "solid-js";

const Keyboard = () => {
  const [autocompleteOptions, setAutocompleteOptions] = createSignal<string[]>(
    []
  );

  createEffect(async () => {
    if (typeof Sentence()[Sentence().length - 1] !== "string") return;
    const response = await fetch("/api/v1/keyboard/autocomplete.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fragment: Sentence()[Sentence().length - 1],
      }),
    });
    const data = await response.json();
    setAutocompleteOptions(data.words);
  }, [Sentence]);

  return (
    <main
      class={`flex flex-1 flex-col bg-gray-900 p-2 ${
        AppMode() === "keyboard" ? "" : "hidden"
      }`}
    >
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex gap-2">
          <ListBox
            items={[
              {
                text: "assistant",
              },
              { text: "chat" },
              { text: "customerservice" },
              { text: "newscast" },
              { text: "angry" },
              { text: "cheerful" },
              { text: "sad" },
              { text: "excited" },
              { text: "friendly" },
              { text: "terrified" },
              { text: "shouting" },
              { text: "unfriendly" },
              { text: "whispering" },
              { text: "hopeful" },
              { text: "none" },
            ]}
            selected={CloudVoiceVariant() || "none"}
            setSignal={setCloudVoiceVariant}
          />
          <div class="flex h-[50px] flex-1 flex-wrap items-center gap-4 overflow-hidden rounded-md bg-gray-800 p-2 text-xl">
            {autocompleteOptions().map((option) => {
              return (
                <span
                  onClick={() => {
                    setSentence([...Sentence().slice(0, -1), option, ""]);
                    // setAutocompleteOptions([]);
                  }}
                  class="font-light"
                >
                  <span class="flex-0 font-bold">
                    {Sentence()[Sentence().length - 1] as string}
                  </span>
                  {option.replace(
                    Sentence()[Sentence().length - 1] as string,
                    ""
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <div class="flex flex-1 justify-center gap-2">
          <Key letter={"q"} />
          <Key letter={"w"} />
          <Key letter={"e"} />
          <Key letter={"r"} />
          <Key letter={"t"} />
          <Key letter={"y"} />
          <Key letter={"u"} />
          <Key letter={"i"} />
          <Key letter={"o"} />
          <Key letter={"p"} />
        </div>
        <div class="flex flex-1 justify-center gap-2">
          <Key letter={"a"} />
          <Key letter={"s"} />
          <Key letter={"d"} />
          <Key letter={"f"} />
          <Key letter={"g"} />
          <Key letter={"h"} />
          <Key letter={"j"} />
          <Key letter={"k"} />
          <Key letter={"l"} />
        </div>
        <div class="flex flex-1 justify-center gap-2">
          <Key letter={"z"} />
          <Key letter={"x"} />
          <Key letter={"c"} />
          <Key letter={"v"} />
          <Key letter={"b"} />
          <Key letter={"n"} />
          <Key letter={"m"} />
          <Key letter={"."} />
        </div>
      </div>
      <div class="text-md flex h-[100px] w-full justify-center gap-2 p-2 md:text-2xl">
        <button class="rounded-md border-2 border-b-0 border-r-0 border-gray-600 bg-gray-700 px-4 active:border-blue-300 active:bg-blue-500">
          Shift
        </button>
        <button
          onClick={() => {
            // If the last item in the sentence is a string
            if (typeof Sentence()[Sentence().length - 1] === "string") {
              setSentence([...Sentence(), ""]);
              return;
            }
          }}
          class="flex-1 rounded-md border-2 border-b-0 border-r-0 border-gray-600 bg-gray-700 active:border-blue-300 active:bg-blue-500"
        ></button>
        <button class="rounded-md border-2 border-b-0 border-r-0 border-gray-600 bg-gray-700 px-4 active:border-blue-300 active:bg-blue-500">
          123
        </button>
        <button class="rounded-md border-2 border-b-0 border-r-0 border-gray-600 bg-gray-700 px-4 active:border-blue-300 active:bg-blue-500">
          .?!
        </button>
      </div>
    </main>
  );
};

export default Keyboard;
