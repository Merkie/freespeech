import { type Accessor, createRenderEffect } from "solid-js";

export default function bind(element: Element, accessor: Accessor<any>) {
  const [field, setField] = accessor();
  createRenderEffect(() => ((element as unknown as any).value = field()));
  element.addEventListener("input", (e) =>
    setField((e.target as unknown as any).value)
  );
}
