import RelationManyToOneOrMany from "svelte-material-icons/RelationManyToOneOrMany.svelte";
import { Sentence, setSentence } from "../../../lib/client/signals";

const Key = ({ letter }: { letter: string }) => {
  return (
    <button
      onClick={() => {
        // If the sentence is empty
        if (Sentence().length === 0) {
          setSentence([letter]);
          return;
        }

        // If the last item in the sentence is a string
        if (typeof Sentence()[Sentence().length - 1] === "string") {
          setSentence([
            ...Sentence().slice(0, -1),
            Sentence()[Sentence().length - 1] + letter,
          ]);
          return;
        }

        // If the last item in the sentence is a tile
        setSentence([...Sentence(), letter]);
      }}
      class="grid w-[50px] place-items-center rounded-md border-2 border-b-0 border-r-0 border-gray-600 bg-gray-700 text-lg text-gray-50 shadow-md active:scale-95 active:border-blue-300 active:bg-blue-500 md:w-[85px] md:text-3xl"
    >
      <p>{letter}</p>
    </button>
  );
};

export default Key;
