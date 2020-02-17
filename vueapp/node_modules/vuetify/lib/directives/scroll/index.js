function inserted(el, binding) {
  const callback = binding.value;
  const options = binding.options || {
    passive: true
  };
  const target = binding.arg ? document.querySelector(binding.arg) : window;
  if (!target) return;
  target.addEventListener('scroll', callback, options);
  el._onScroll = {
    callback,
    options,
    target
  };
}

function unbind(el) {
  if (!el._onScroll) return;
  const {
    callback,
    options,
    target
  } = el._onScroll;
  target.removeEventListener('scroll', callback, options);
  delete el._onScroll;
}

export const Scroll = {
  inserted,
  unbind
};
export default Scroll;
//# sourceMappingURL=index.js.map