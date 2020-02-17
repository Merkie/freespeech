"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromHSVA = fromHSVA;
exports.fromHSLA = fromHSLA;
exports.fromRGBA = fromRGBA;
exports.fromHexa = fromHexa;
exports.fromHex = fromHex;
exports.parseColor = parseColor;
exports.extractColor = extractColor;
exports.hasAlpha = hasAlpha;

var _colorUtils = require("../../../util/colorUtils");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function fromHSVA(hsva) {
  hsva = _objectSpread({}, hsva);
  var hexa = (0, _colorUtils.HSVAtoHex)(hsva);
  var hsla = (0, _colorUtils.HSVAtoHSLA)(hsva);
  var rgba = (0, _colorUtils.HSVAtoRGBA)(hsva);
  return {
    alpha: hsva.a,
    hex: hexa.substr(0, 7),
    hexa: hexa,
    hsla: hsla,
    hsva: hsva,
    hue: hsva.h,
    rgba: rgba
  };
}

function fromHSLA(hsla) {
  var hsva = (0, _colorUtils.HSLAtoHSVA)(hsla);
  var hexa = (0, _colorUtils.HSVAtoHex)(hsva);
  var rgba = (0, _colorUtils.HSVAtoRGBA)(hsva);
  return {
    alpha: hsva.a,
    hex: hexa.substr(0, 7),
    hexa: hexa,
    hsla: hsla,
    hsva: hsva,
    hue: hsva.h,
    rgba: rgba
  };
}

function fromRGBA(rgba) {
  var hsva = (0, _colorUtils.RGBAtoHSVA)(rgba);
  var hexa = (0, _colorUtils.RGBAtoHex)(rgba);
  var hsla = (0, _colorUtils.HSVAtoHSLA)(hsva);
  return {
    alpha: hsva.a,
    hex: hexa.substr(0, 7),
    hexa: hexa,
    hsla: hsla,
    hsva: hsva,
    hue: hsva.h,
    rgba: rgba
  };
}

function fromHexa(hexa) {
  var hsva = (0, _colorUtils.HexToHSVA)(hexa);
  var hsla = (0, _colorUtils.HSVAtoHSLA)(hsva);
  var rgba = (0, _colorUtils.HSVAtoRGBA)(hsva);
  return {
    alpha: hsva.a,
    hex: hexa.substr(0, 7),
    hexa: hexa,
    hsla: hsla,
    hsva: hsva,
    hue: hsva.h,
    rgba: rgba
  };
}

function fromHex(hex) {
  return fromHexa((0, _colorUtils.parseHex)(hex));
}

function has(obj, key) {
  return key.every(function (k) {
    return obj.hasOwnProperty(k);
  });
}

function parseColor(color, oldColor) {
  if (!color) return fromRGBA({
    r: 255,
    g: 0,
    b: 0,
    a: 1
  });

  if (typeof color === 'string') {
    if (color === 'transparent') return fromHexa('#00000000');
    var hex = (0, _colorUtils.parseHex)(color);
    if (oldColor && hex === oldColor.hexa) return oldColor;else return fromHexa(hex);
  }

  if (_typeof(color) === 'object') {
    if (color.hasOwnProperty('alpha')) return color;
    var a = color.hasOwnProperty('a') ? parseFloat(color.a) : 1;

    if (has(color, ['r', 'g', 'b'])) {
      if (oldColor && color === oldColor.rgba) return oldColor;else return fromRGBA(_objectSpread({}, color, {
        a: a
      }));
    } else if (has(color, ['h', 's', 'l'])) {
      if (oldColor && color === oldColor.hsla) return oldColor;else return fromHSLA(_objectSpread({}, color, {
        a: a
      }));
    } else if (has(color, ['h', 's', 'v'])) {
      if (oldColor && color === oldColor.hsva) return oldColor;else return fromHSVA(_objectSpread({}, color, {
        a: a
      }));
    }
  }

  return fromRGBA({
    r: 255,
    g: 0,
    b: 0,
    a: 1
  });
}

function extractColor(color, input) {
  if (input == null) return color;

  if (typeof input === 'string') {
    return input.length === 7 ? color.hex : color.hexa;
  }

  if (_typeof(input) === 'object') {
    if (has(input, ['r', 'g', 'b'])) return color.rgba;else if (has(input, ['h', 's', 'l'])) return color.hsla;else if (has(input, ['h', 's', 'v'])) return color.hsva;
  }

  return color;
}

function hasAlpha(color) {
  if (!color) return false;

  if (typeof color === 'string') {
    return color.length > 7;
  }

  if (_typeof(color) === 'object') {
    return has(color, ['a']);
  }

  return false;
}
//# sourceMappingURL=index.js.map