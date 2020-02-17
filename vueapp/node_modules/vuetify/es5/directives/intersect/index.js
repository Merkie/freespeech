"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Intersect = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function inserted(el, binding) {
  var modifiers = binding.modifiers ||
  /* istanbul ignore next */
  {};
  var value = binding.value;
  var isObject = _typeof(value) === 'object';
  var callback = isObject ? value.handler : value;
  var observer = new IntersectionObserver(function () {
    var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var observer = arguments.length > 1 ? arguments[1] : undefined;

    /* istanbul ignore if */
    if (!el._observe) return; // Just in case, should never fire
    // If is not quiet or has already been
    // initted, invoke the user callback

    if (callback && (!modifiers.quiet || el._observe.init)) {
      var isIntersecting = Boolean(entries.find(function (entry) {
        return entry.isIntersecting;
      }));
      callback(entries, observer, isIntersecting);
    } // If has already been initted and
    // has the once modifier, unbind


    if (el._observe.init && modifiers.once) unbind(el); // Otherwise, mark the observer as initted
    else el._observe.init = true;
  }, value.options || {});
  el._observe = {
    init: false,
    observer: observer
  };
  observer.observe(el);
}

function unbind(el) {
  /* istanbul ignore if */
  if (!el._observe) return;

  el._observe.observer.unobserve(el);

  delete el._observe;
}

var Intersect = {
  inserted: inserted,
  unbind: unbind
};
exports.Intersect = Intersect;
var _default = Intersect;
exports.default = _default;
//# sourceMappingURL=index.js.map