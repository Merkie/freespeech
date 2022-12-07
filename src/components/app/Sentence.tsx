import { AppMode } from "../../lib/client/signals";

const Sentence = () => {
  return (
    <section
      class={`h-[100px] bg-gray-50 ${AppMode() !== "edit" ? "" : "hidden"}`}
    ></section>
  );
};

export default Sentence;
