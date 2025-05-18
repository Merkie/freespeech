import { createSignal } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <p>count: {count()}</p>
      <button
        class="text-white bg-sky-600 rounded-md px-2 p-1"
        onClick={() => setCount((prev) => prev + 1)}
      >
        Increment
      </button>
    </>
  );
}

export default App;
