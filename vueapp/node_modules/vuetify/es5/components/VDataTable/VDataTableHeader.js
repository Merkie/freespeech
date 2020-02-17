"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VDataTable/VDataTableHeader.sass");

var _vue = _interopRequireDefault(require("vue"));

var _dedupeModelListeners = _interopRequireDefault(require("../../util/dedupeModelListeners"));

var _rebuildFunctionalSlots = _interopRequireDefault(require("../../util/rebuildFunctionalSlots"));

var _VDataTableHeaderMobile = _interopRequireDefault(require("./VDataTableHeaderMobile"));

var _VDataTableHeaderDesktop = _interopRequireDefault(require("./VDataTableHeaderDesktop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _vue.default.extend({
  name: 'v-data-table-header',
  functional: true,
  props: {
    mobile: Boolean
  },
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        slots = _ref.slots;
    (0, _dedupeModelListeners.default)(data);
    var children = (0, _rebuildFunctionalSlots.default)(slots(), h);

    if (props.mobile) {
      return h(_VDataTableHeaderMobile.default, data, children);
    } else {
      return h(_VDataTableHeaderDesktop.default, data, children);
    }
  }
});

exports.default = _default;
//# sourceMappingURL=VDataTableHeader.js.map