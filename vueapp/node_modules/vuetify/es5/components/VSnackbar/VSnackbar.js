"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VSnackbar/VSnackbar.sass");

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _toggleable = _interopRequireDefault(require("../../mixins/toggleable"));

var _positionable = require("../../mixins/positionable");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _console = require("../../util/console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Styles
// Mixins
// Types
var _default = (0, _mixins.default)(_colorable.default, _toggleable.default, (0, _positionable.factory)(['absolute', 'top', 'bottom', 'left', 'right'])
/* @vue/component */
).extend({
  name: 'v-snackbar',
  props: {
    multiLine: Boolean,
    // TODO: change this to closeDelay to match other API in delayable.js
    timeout: {
      type: Number,
      default: 6000
    },
    vertical: Boolean
  },
  data: function data() {
    return {
      activeTimeout: -1
    };
  },
  computed: {
    classes: function classes() {
      return {
        'v-snack--active': this.isActive,
        'v-snack--absolute': this.absolute,
        'v-snack--bottom': this.bottom || !this.top,
        'v-snack--left': this.left,
        'v-snack--multi-line': this.multiLine && !this.vertical,
        'v-snack--right': this.right,
        'v-snack--top': this.top,
        'v-snack--vertical': this.vertical
      };
    }
  },
  watch: {
    isActive: function isActive() {
      this.setTimeout();
    }
  },
  created: function created() {
    if (this.$attrs.hasOwnProperty('auto-height')) {
      (0, _console.removed)('auto-height', this);
    }
  },
  mounted: function mounted() {
    this.setTimeout();
  },
  methods: {
    setTimeout: function setTimeout() {
      var _this = this;

      window.clearTimeout(this.activeTimeout);

      if (this.isActive && this.timeout) {
        this.activeTimeout = window.setTimeout(function () {
          _this.isActive = false;
        }, this.timeout);
      }
    }
  },
  render: function render(h) {
    return h('transition', {
      attrs: {
        name: 'v-snack-transition'
      }
    }, [this.isActive && h('div', {
      staticClass: 'v-snack',
      class: this.classes,
      on: this.$listeners
    }, [h('div', this.setBackgroundColor(this.color, {
      staticClass: 'v-snack__wrapper',
      attrs: {
        role: 'alert'
      }
    }), [h('div', {
      staticClass: 'v-snack__content'
    }, this.$slots.default)])])]);
  }
});

exports.default = _default;
//# sourceMappingURL=VSnackbar.js.map