"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Scroll = void 0;

function inserted(el, binding) {
  var callback = binding.value;
  var options = binding.options || {
    passive: true
  };
  var target = binding.arg ? document.querySelector(binding.arg) : window;
  if (!target) return;
  target.addEventListener('scroll', callback, options);
  el._onScroll = {
    callback: callback,
    options: options,
    target: target
  };
}

function unbind(el) {
  if (!el._onScroll) return;
  var _el$_onScroll = el._onScroll,
      callback = _el$_onScroll.callback,
      options = _el$_onScroll.options,
      target = _el$_onScroll.target;
  target.removeEventListener('scroll', callback, options);
  delete el._onScroll;
}

var Scroll = {
  inserted: inserted,
  unbind: unbind
};
exports.Scroll = Scroll;
var _default = Scroll;
exports.default = _default;
//# sourceMappingURL=index.js.map