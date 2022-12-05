<script>
  import { AppMode, Sentence } from "../../lib/client/stores";
  import Backspace from "svelte-material-icons/Backspace.svelte";
  import colors from "tailwindcss/colors";

  let loading = false;
  let playing = false;
  let lastSpoken = {
    text: "",
    audio: "",
  };

  const speak = async () => {
    if (playing) return;
    if (
      lastSpoken.text ===
      $Sentence.map((tile) => tile.speakText || tile.text).join(" ")
    ) {
      const audio = new Audio(lastSpoken.audio);
      audio.play();
      playing = true;
      audio.onended = () => {
        playing = false;
      };
      return;
    }
    loading = true;
    const response = await fetch("https://www.tts.gay/api/v1/synthesize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: $Sentence.map((tile) => tile.speakText || tile.text).join(" "),
        id: 205,
        variant: "chat",
      }),
    });
    loading = false;
    const data = await response.json();
    if (data.audio) {
      lastSpoken = {
        text: $Sentence.map((tile) => tile.speakText || tile.text).join(" "),
        audio: data.audio,
      };
      const audio = new Audio(data.audio);
      audio.play();
      playing = true;
      audio.onended = () => {
        playing = false;
      };
    }
  };
</script>

{#if $AppMode !== "edit"}
  <div
    class="relative flex h-[100px] w-full items-center bg-gray-100 text-gray-900"
  >
    {#if loading}
      <div
        style="background: rgba(0, 0, 0, 0.25); pointer-events: all;"
        class="absolute z-10 h-full w-full"
      >
        <div
          class="lds-spinner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    {/if}
    <div
      on:keypress={() => null}
      on:click={speak}
      class="sb flex h-full flex-1 cursor-pointer items-center"
    >
      <p class="pl-4 text-xl">
        {$Sentence.map((tile) => tile.text).join(" ")}
      </p>
    </div>
    <button class="grid h-full place-items-center p-4">
      <Backspace color={colors.gray[900]} size={"40px"} />
    </button>
  </div>
{/if}

<style>
  .sb:active {
    transform: scaleY(0.75);
  }
  .lds-spinner {
    color: official;
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-spinner div {
    transform-origin: 40px 40px;
    animation: lds-spinner 1.2s linear infinite;
  }
  .lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 3px;
    left: 37px;
    width: 6px;
    height: 18px;
    border-radius: 20%;
    background: #fff;
  }
  .lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  .lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  .lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  .lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  .lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  .lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  .lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  .lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  .lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  .lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  .lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  .lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
