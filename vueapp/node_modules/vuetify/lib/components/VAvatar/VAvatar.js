import "../../../src/components/VAvatar/VAvatar.sass"; // Mixins

import Colorable from '../../mixins/colorable';
import Measurable from '../../mixins/measurable';
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
export default mixins(Colorable, Measurable
/* @vue/component */
).extend({
  name: 'v-avatar',
  props: {
    left: Boolean,
    right: Boolean,
    size: {
      type: [Number, String],
      default: 48
    },
    tile: Boolean
  },
  computed: {
    classes() {
      return {
        'v-avatar--left': this.left,
        'v-avatar--right': this.right,
        'v-avatar--tile': this.tile
      };
    },

    styles() {
      return {
        height: convertToUnit(this.size),
        minWidth: convertToUnit(this.size),
        width: convertToUnit(this.size),
        ...this.measurableStyles
      };
    }

  },

  render(h) {
    const data = {
      staticClass: 'v-avatar',
      class: this.classes,
      style: this.styles,
      on: this.$listeners
    };
    return h('div', this.setBackgroundColor(this.color, data), this.$slots.default);
  }

});
//# sourceMappingURL=VAvatar.js.map