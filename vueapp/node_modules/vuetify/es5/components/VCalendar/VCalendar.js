"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _calendarWithEvents = _interopRequireDefault(require("./mixins/calendar-with-events"));

var _props = _interopRequireDefault(require("./util/props"));

var _timestamp = require("./util/timestamp");

var _VCalendarMonthly = _interopRequireDefault(require("./VCalendarMonthly"));

var _VCalendarDaily = _interopRequireDefault(require("./VCalendarDaily"));

var _VCalendarWeekly = _interopRequireDefault(require("./VCalendarWeekly"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = _calendarWithEvents.default.extend({
  name: 'v-calendar',
  props: _objectSpread({}, _props.default.calendar, {}, _props.default.weeks, {}, _props.default.intervals),
  data: function data() {
    return {
      lastStart: null,
      lastEnd: null
    };
  },
  computed: {
    parsedValue: function parsedValue() {
      return (0, _timestamp.validateTimestamp)(this.value) ? (0, _timestamp.parseTimestamp)(this.value, true) : this.parsedStart || this.times.today;
    },
    renderProps: function renderProps() {
      var around = this.parsedValue;
      var component = null;
      var maxDays = this.maxDays;
      var start = around;
      var end = around;

      switch (this.type) {
        case 'month':
          component = _VCalendarMonthly.default;
          start = (0, _timestamp.getStartOfMonth)(around);
          end = (0, _timestamp.getEndOfMonth)(around);
          break;

        case 'week':
          component = _VCalendarDaily.default;
          start = this.getStartOfWeek(around);
          end = this.getEndOfWeek(around);
          maxDays = 7;
          break;

        case 'day':
          component = _VCalendarDaily.default;
          maxDays = 1;
          break;

        case '4day':
          component = _VCalendarDaily.default;
          end = (0, _timestamp.relativeDays)((0, _timestamp.copyTimestamp)(end), _timestamp.nextDay, 4);
          (0, _timestamp.updateFormatted)(end);
          maxDays = 4;
          break;

        case 'custom-weekly':
          component = _VCalendarWeekly.default;
          start = this.parsedStart || around;
          end = this.parsedEnd;
          break;

        case 'custom-daily':
          component = _VCalendarDaily.default;
          start = this.parsedStart || around;
          end = this.parsedEnd;
          break;

        default:
          throw new Error(this.type + ' is not a valid Calendar type');
      }

      return {
        component: component,
        start: start,
        end: end,
        maxDays: maxDays
      };
    }
  },
  watch: {
    renderProps: 'checkChange'
  },
  mounted: function mounted() {
    this.updateEventVisibility();
    this.checkChange();
  },
  updated: function updated() {
    window.requestAnimationFrame(this.updateEventVisibility);
  },
  methods: {
    checkChange: function checkChange() {
      var lastStart = this.lastStart,
          lastEnd = this.lastEnd;
      var _this$renderProps = this.renderProps,
          start = _this$renderProps.start,
          end = _this$renderProps.end;

      if (!lastStart || !lastEnd || start.date !== lastStart.date || end.date !== lastEnd.date) {
        this.lastStart = start;
        this.lastEnd = end;
        this.$emit('change', {
          start: start,
          end: end
        });
      }
    },
    move: function move() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var moved = (0, _timestamp.copyTimestamp)(this.parsedValue);
      var forward = amount > 0;
      var mover = forward ? _timestamp.nextDay : _timestamp.prevDay;
      var limit = forward ? _timestamp.DAYS_IN_MONTH_MAX : _timestamp.DAY_MIN;
      var times = forward ? amount : -amount;

      while (--times >= 0) {
        switch (this.type) {
          case 'month':
            moved.day = limit;
            mover(moved);
            break;

          case 'week':
            (0, _timestamp.relativeDays)(moved, mover, _timestamp.DAYS_IN_WEEK);
            break;

          case 'day':
            var index = moved.weekday;
            var days = forward ? this.weekdaySkips[index] : this.weekdaySkipsReverse[index];
            (0, _timestamp.relativeDays)(moved, mover, days);
            break;

          case '4day':
            (0, _timestamp.relativeDays)(moved, mover, 4);
            break;
        }
      }

      (0, _timestamp.updateWeekday)(moved);
      (0, _timestamp.updateFormatted)(moved);
      (0, _timestamp.updateRelative)(moved, this.times.now);
      this.$emit('input', moved.date);
      this.$emit('moved', moved);
    },
    next: function next() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.move(amount);
    },
    prev: function prev() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.move(-amount);
    },
    timeToY: function timeToY(time) {
      var clamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var c = this.$children[0];

      if (c && c.timeToY) {
        return c.timeToY(time, clamp);
      } else {
        return false;
      }
    },
    minutesToPixels: function minutesToPixels(minutes) {
      var c = this.$children[0];

      if (c && c.minutesToPixels) {
        return c.minutesToPixels(minutes);
      } else {
        return -1;
      }
    },
    scrollToTime: function scrollToTime(time) {
      var c = this.$children[0];

      if (c && c.scrollToTime) {
        return c.scrollToTime(time);
      } else {
        return false;
      }
    }
  },
  render: function render(h) {
    var _this = this;

    var _this$renderProps2 = this.renderProps,
        start = _this$renderProps2.start,
        end = _this$renderProps2.end,
        maxDays = _this$renderProps2.maxDays,
        component = _this$renderProps2.component;
    return h(component, {
      staticClass: 'v-calendar',
      class: {
        'v-calendar-events': !this.noEvents
      },
      props: _objectSpread({}, this.$props, {
        start: start.date,
        end: end.date,
        maxDays: maxDays
      }),
      directives: [{
        modifiers: {
          quiet: true
        },
        name: 'resize',
        value: this.updateEventVisibility
      }],
      on: _objectSpread({}, this.$listeners, {
        'click:date': function clickDate(day) {
          if (_this.$listeners['input']) {
            _this.$emit('input', day.date);
          }

          if (_this.$listeners['click:date']) {
            _this.$emit('click:date', day);
          }
        }
      }),
      scopedSlots: this.getScopedSlots()
    });
  }
});

exports.default = _default;
//# sourceMappingURL=VCalendar.js.map