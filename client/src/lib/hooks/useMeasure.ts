import { createSignal, onCleanup, onMount } from 'solid-js';

export default function useMeasure(elAccessor: () => HTMLElement | undefined) {
  const [size, setSize] = createSignal({ width: 0, height: 0 });

  let observer: ResizeObserver | null = null;

  onMount(() => {
    const el = elAccessor();
    if (!el) return;

    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(el);
  });

  onCleanup(() => {
    const el = elAccessor();
    if (observer && el) {
      observer.unobserve(el);
    }
    observer?.disconnect();
  });

  return size;
}
