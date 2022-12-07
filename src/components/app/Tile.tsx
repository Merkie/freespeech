const Tile = (props: { text: string; image: string }) => {
  // function that converts text length into font size
  const getFontSize = (text: string) => {
    if (text.length <= 4) {
      return "text-2xl";
    } else if (text.length <= 8) {
      return "text-xl";
    } else {
      return "text-md";
    }
  };

  return (
    <div class="relative">
      {/* folder piece */}
      <div
        style="border-radius: 5px 10px 0 0"
        class="absolute top-[-3px] z-10 h-[8px] w-1/2 border-2 border-b-0 border-gray-900 bg-gray-50"
      />
      {/* Main tile content */}
      <div class="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-md border-2 border-gray-900 bg-gray-50 p-2 pt-0 shadow-sm active:scale-95">
        <div class="absolute right-[-33px] top-[-33px] h-[50px] w-[50px] rotate-45 bg-red-500" />
        <div class="font-bold first-letter:text-center">
          <h1 class={`text-center ${getFontSize(props.text)}`}>{props.text}</h1>
        </div>
        <div class="relative grid min-h-[20px] flex-1 place-content-center">
          <img
            src={props.image}
            style="height: 100%;"
            class="absolute left-1/2 -translate-x-1/2 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Tile;
