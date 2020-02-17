"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _header = _interopRequireDefault(require("./mixins/header"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _default = (0, _mixins.default)(_header.default).extend({
  name: 'v-data-table-header-desktop',
  methods: {
    genGroupByToggle: function genGroupByToggle(header) {
      var _this = this;

      return this.$createElement('span', {
        on: {
          click: function click() {
            return _this.$emit('group', header.value);
          }
        }
      }, ['group']);
    },
    // eslint-disable-next-line max-statements
    genHeader: function genHeader(header) {
      var _this2 = this;

      var listeners = {};
      var children = [];
      var attrs = {
        role: 'columnheader',
        scope: 'col',
        'aria-label': header.text || '',
        'aria-sort': 'none'
      };
      var styles = {
        width: (0, _helpers.convertToUnit)(header.width),
        minWidth: (0, _helpers.convertToUnit)(header.width)
      };
      var classes = ["text-".concat(header.align || 'start')].concat(_toConsumableArray((0, _helpers.wrapInArray)(header.class)), [header.divider && 'v-data-table__divider']);

      if (header.value === 'data-table-select' && !this.singleSelect) {
        children.push(this.genSelectAll());
      } else {
        children.push(this.$scopedSlots[header.value] ? this.$scopedSlots[header.value]({
          header: header
        }) : this.$createElement('span', [header.text]));

        if (!this.disableSort && (header.sortable || !header.hasOwnProperty('sortable'))) {
          listeners['click'] = function () {
            return _this2.$emit('sort', header.value);
          };

          var sortIndex = this.options.sortBy.findIndex(function (k) {
            return k === header.value;
          });
          var beingSorted = sortIndex >= 0;
          var isDesc = this.options.sortDesc[sortIndex];
          classes.push('sortable');

          if (beingSorted) {
            classes.push('active');
            classes.push(isDesc ? 'desc' : 'asc');
            attrs['aria-sort'] = isDesc ? 'descending' : 'ascending';
            attrs['aria-label'] += isDesc ? this.$vuetify.lang.t('$vuetify.dataTable.ariaLabel.sortDescending') : this.$vuetify.lang.t('$vuetify.dataTable.ariaLabel.sortAscending');
          } else {
            attrs['aria-label'] += this.$vuetify.lang.t('$vuetify.dataTable.ariaLabel.sortNone');
          }

          if (header.align === 'end') children.unshift(this.genSortIcon());else children.push(this.genSortIcon());

          if (this.options.multiSort && beingSorted) {
            children.push(this.$createElement('span', {
              class: 'v-data-table-header__sort-badge'
            }, [String(sortIndex + 1)]));
          }
        }

        if (this.showGroupBy) {
          children.push(this.genGroupByToggle(header));
        }
      }

      return this.$createElement('th', {
        attrs: attrs,
        class: classes,
        style: styles,
        on: listeners
      }, children);
    }
  },
  render: function render() {
    var _this3 = this;

    return this.$createElement('thead', {
      staticClass: 'v-data-table-header'
    }, [this.$createElement('tr', this.headers.map(function (header) {
      return _this3.genHeader(header);
    }))]);
  }
});

exports.default = _default;
//# sourceMappingURL=VDataTableHeaderDesktop.js.map