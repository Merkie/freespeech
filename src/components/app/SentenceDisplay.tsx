//@ts-ignore
import SentenceDeleteButton from "./SentenceDeleteButton";
import { createSignal } from "solid-js";

const [Sentence, setSentence] = createSignal(
  "The quick brown fox jumps over the lazy dog."
);

function SentenceDisplay() {
  const clearSentence = () => {
    alert("sentence cleared");
  };

  const removeLastTile = () => {
    setSentence((prev) => prev.slice(0, -1));
  };

  return (
    <section class="p-4 flex items-center">
      <p>{Sentence()}</p>
      <div class="flex-1" />
      <SentenceDeleteButton />
    </section>
  );
}

export default SentenceDisplay;
