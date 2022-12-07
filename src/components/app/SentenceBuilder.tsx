import { AppMode, Sentence, setSentence } from "../../lib/client/signals";

const SentenceBuilder = () => {
  return (
    <section
      class={`flex h-[100px] items-center bg-gray-50 p-4 ${
        AppMode() !== "edit" ? "" : "hidden"
      }`}
    >
      <div class="flex flex-1 items-center gap-2 text-xl text-gray-900">
        {Sentence().map((item) => {
          if (typeof item === "string") return <p>{item}</p>;
          return <p>{item.text}</p>;
        })}
      </div>
      <button
        onClick={() => {
          // if last item is an empty string
          if (Sentence()[Sentence().length - 1] === "") {
            // remove it
            setSentence([...Sentence().slice(0, -1)]);
            return;
          }

          // if last item is a string
          if (typeof Sentence()[Sentence().length - 1] === "string") {
            // remove last character from last item
            setSentence([
              ...Sentence().slice(0, -1),
              Sentence()[Sentence().length - 1].slice(0, -1),
            ]);
            return;
          }

          // delete last item
          setSentence([...Sentence().slice(0, -1)]);
        }}
        class="z-10 p-2 active:-translate-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="50"
          height="50"
          viewBox="0 0 30 30"
        >
          <path d="M27,6H8.552C7.563,6,6.639,6.486,6.08,7.301l-4.904,7.133c-0.234,0.341-0.234,0.792,0,1.133l4.904,7.133 C6.639,23.514,7.563,24,8.552,24H27c1.103,0,2-0.897,2-2V8C29,6.897,28.103,6,27,6z M21.707,18.293c0.391,0.391,0.391,1.023,0,1.414 C21.512,19.902,21.256,20,21,20s-0.512-0.098-0.707-0.293L17,16.414l-3.293,3.293C13.512,19.902,13.256,20,13,20 s-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414L15.586,15l-3.293-3.293c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0L17,13.586l3.293-3.293c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414L18.414,15L21.707,18.293z"></path>
        </svg>
      </button>
    </section>
  );
};

export default SentenceBuilder;
