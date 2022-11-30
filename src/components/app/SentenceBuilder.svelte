<script>
  import { Sentence } from "../../lib/client/stores";
  import Backspace from "svelte-material-icons/Backspace.svelte";
  import colors from "tailwindcss/colors";

  const speakSentence = () => {};
</script>

<div class="flex h-[100px] w-full items-center bg-gray-100 text-gray-900">
  <div
    on:keypress={() => null}
    on:click={speakSentence}
    class="sb text-x flex-1 pl-4"
  >
    <p>{$Sentence.map((tile) => tile.text).join(" ")}</p>
  </div>
  <button
    on:click={() => {
      $Sentence.pop(); // remove last item from sentence
      $Sentence = $Sentence;
    }}
    on:dblclick={() => {
      $Sentence = []; // clear sentence
    }}
    class="grid h-full place-items-center p-4"
  >
    <Backspace color={colors.gray[900]} size={"40px"} />
  </button>
</div>

<style>
  .sb:active {
    transform: scaleY(0.75);
    cursor: pointer;
  }
</style>
