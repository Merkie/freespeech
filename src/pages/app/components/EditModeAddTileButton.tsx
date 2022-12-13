const AddTileBtn = (props: { x: number; y: number }) => {
  return (
    <button class="grid place-items-center rounded-md border-2 border-dashed border-gray-400 text-gray-400">
      <i class="bx bx-plus"></i>
    </button>
  );
};

export default AddTileBtn;
