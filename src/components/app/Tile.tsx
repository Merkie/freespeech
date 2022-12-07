const Tile = (props: { text: string; image: string }) => {
  // function that converts text length into font size
  const getFontSize = (text: string) => {
    if (text.length <= 4) {
      return "text-2xl";
    } else if (text.length <= 8) {
      return "text-xl";
    } else {
      return "text-sm";
    }
  };

  return (
    <div class="flex flex-col rounded-md border-2 border-gray-900 bg-gray-50 p-2 pt-0 shadow-sm">
      <div class="font-bold first-letter:text-center">
        <h1 class={`whitespace-nowrap text-center ${getFontSize(props.text)}`}>
          {props.text}
        </h1>
      </div>
      <div class="relative grid min-h-[20px] flex-1 place-content-center">
        <img
          src={props.image}
          style="height: 100%;"
          class="absolute left-1/2 -translate-x-1/2 object-contain"
        />
      </div>
    </div>
  );
};

export default Tile;
