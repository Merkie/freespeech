const Key = ({ letter }: { letter: string }) => {
  return (
    <button class="grid w-[85px] place-items-center rounded-md border-2 border-gray-400 bg-gray-100 text-2xl font-bold text-gray-900 shadow-md active:scale-95">
      <p>{letter}</p>
    </button>
  );
};

export default Key;
