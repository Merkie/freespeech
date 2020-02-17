"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../../src/components/VCalendar/mixins/calendar-with-events.sass");

var _ripple = _interopRequireDefault(require("../../../directives/ripple"));

var _calendarBase = _interopRequireDefault(require("./calendar-base"));

var _helpers = require("../../../util/helpers");

var _props = _interopRequireDefault(require("../util/props"));

var _modes = require("../modes");

var _timestamp = require("../util/timestamp");

var _events = require("../util/events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WIDTH_FULL = 100;
var WIDTH_START = 95;
var MINUTES_IN_DAY = 1440;
/* @vue/component */

var _default = _calendarBase.default.extend({
  name: 'calendar-with-events',
  directives: {
    ripple: _ripple.default
  },
  props: _props.default.events,
  computed: {
    noEvents: function noEvents() {
      return this.events.length === 0;
    },
    parsedEvents: function parsedEvents() {
      var _this = this;

      return this.events.map(function (input, index) {
        return (0, _events.parseEvent)(input, index, _this.eventStart, _this.eventEnd);
      });
    },
    parsedEventOverlapThreshold: function parsedEventOverlapThreshold() {
      return parseInt(this.eventOverlapThreshold);
    },
    eventColorFunction: function eventColorFunction() {
      var _this2 = this;

      return typeof this.eventColor === 'function' ? this.eventColor : function () {
        return _this2.eventColor;
      };
    },
    eventTextColorFunction: function eventTextColorFunction() {
      var _this3 = this;

      return typeof this.eventTextColor === 'function' ? this.eventTextColor : function () {
        return _this3.eventTextColor;
      };
    },
    eventNameFunction: function eventNameFunction() {
      var _this4 = this;

      return typeof this.eventName === 'function' ? this.eventName : function (event, timedEvent) {
        var name = (0, _helpers.escapeHTML)(event.input[_this4.eventName]);

        if (event.start.hasTime) {
          if (timedEvent) {
            var showStart = event.start.hour < 12 && event.end.hour >= 12;

            var start = _this4.formatTime(event.start, showStart);

            var end = _this4.formatTime(event.end, true);

            var singline = (0, _timestamp.diffMinutes)(event.start, event.end) <= _this4.parsedEventOverlapThreshold;

            var separator = singline ? ', ' : '<br>';
            return "<strong>".concat(name, "</strong>").concat(separator).concat(start, " - ").concat(end);
          } else {
            var time = _this4.formatTime(event.start, true);

            return "<strong>".concat(time, "</strong> ").concat(name);
          }
        }

        return name;
      };
    },
    eventModeFunction: function eventModeFunction() {
      return typeof this.eventOverlapMode === 'function' ? this.eventOverlapMode : _modes.CalendarEventOverlapModes[this.eventOverlapMode];
    }
  },
  methods: {
    formatTime: function formatTime(withTime, ampm) {
      var formatter = this.getFormatter({
        timeZone: 'UTC',
        hour: 'numeric',
        minute: withTime.minute > 0 ? 'numeric' : undefined
      });
      return formatter(withTime, true);
    },
    updateEventVisibility: function updateEventVisibility() {
      if (this.noEvents || !this.eventMore) {
        return;
      }

      var eventHeight = this.eventHeight;
      var eventsMap = this.getEventsMap();

      for (var date in eventsMap) {
        var _eventsMap$date = eventsMap[date],
            parent = _eventsMap$date.parent,
            events = _eventsMap$date.events,
            more = _eventsMap$date.more;

        if (!more) {
          break;
        }

        var parentBounds = parent.getBoundingClientRect();
        var last = events.length - 1;
        var hide = false;
        var hidden = 0;

        for (var i = 0; i <= last; i++) {
          if (!hide) {
            var eventBounds = events[i].getBoundingClientRect();
            hide = i === last ? eventBounds.bottom > parentBounds.bottom : eventBounds.bottom + eventHeight > parentBounds.bottom;
          }

          if (hide) {
            events[i].style.display = 'none';
            hidden++;
          }
        }

        if (hide) {
          more.style.display = '';
          more.innerHTML = this.$vuetify.lang.t(this.eventMoreText, hidden);
        } else {
          more.style.display = 'none';
        }
      }
    },
    getEventsMap: function getEventsMap() {
      var eventsMap = {};
      var elements = this.$refs.events;

      if (!elements || !elements.forEach) {
        return eventsMap;
      }

      elements.forEach(function (el) {
        var date = el.getAttribute('data-date');

        if (el.parentElement && date) {
          if (!(date in eventsMap)) {
            eventsMap[date] = {
              parent: el.parentElement,
              more: null,
              events: []
            };
          }

          if (el.getAttribute('data-more')) {
            eventsMap[date].more = el;
          } else {
            eventsMap[date].events.push(el);
            el.style.display = '';
          }
        }
      });
      return eventsMap;
    },
    genDayEvent: function genDayEvent(_ref, day) {
      var event = _ref.event;
      var eventHeight = this.eventHeight;
      var eventMarginBottom = this.eventMarginBottom;
      var dayIdentifier = (0, _timestamp.getDayIdentifier)(day);
      var week = day.week;
      var start = dayIdentifier === event.startIdentifier;
      var end = dayIdentifier === event.endIdentifier;
      var width = WIDTH_START;

      for (var i = day.index + 1; i < week.length; i++) {
        var weekdayIdentifier = (0, _timestamp.getDayIdentifier)(week[i]);

        if (event.endIdentifier >= weekdayIdentifier) {
          width += WIDTH_FULL;

          if (weekdayIdentifier === event.endIdentifier) {
            end = true;
          }
        } else {
          end = true;
          break;
        }
      }

      var scope = {
        event: event.input,
        day: day,
        outside: day.outside,
        start: start,
        end: end,
        timed: false
      };
      return this.genEvent(event, scope, false, {
        staticClass: 'v-event',
        class: {
          'v-event-start': start,
          'v-event-end': end
        },
        style: {
          height: "".concat(eventHeight, "px"),
          width: "".concat(width, "%"),
          'margin-bottom': "".concat(eventMarginBottom, "px")
        },
        attrs: {
          'data-date': day.date
        },
        key: event.index,
        ref: 'events',
        refInFor: true
      });
    },
    genTimedEvent: function genTimedEvent(_ref2, day) {
      var event = _ref2.event,
          left = _ref2.left,
          width = _ref2.width;
      var dayIdentifier = (0, _timestamp.getDayIdentifier)(day);
      var start = event.startIdentifier >= dayIdentifier;
      var end = event.endIdentifier > dayIdentifier;
      var top = start ? day.timeToY(event.start) : 0;
      var bottom = end ? day.timeToY(MINUTES_IN_DAY) : day.timeToY(event.end);
      var height = Math.max(this.eventHeight, bottom - top);
      var scope = {
        event: event.input,
        day: day,
        outside: day.outside,
        start: start,
        end: end,
        timed: true
      };
      return this.genEvent(event, scope, true, {
        staticClass: 'v-event-timed',
        style: {
          top: "".concat(top, "px"),
          height: "".concat(height, "px"),
          left: "".concat(left, "%"),
          width: "".concat(width, "%")
        }
      });
    },
    genEvent: function genEvent(event, scope, timedEvent, data) {
      var slot = this.$scopedSlots.event;
      var text = this.eventTextColorFunction(event.input);
      var background = this.eventColorFunction(event.input);
      return this.$createElement('div', this.setTextColor(text, this.setBackgroundColor(background, _objectSpread({
        on: this.getDefaultMouseEventHandlers(':event', function (nativeEvent) {
          return _objectSpread({}, scope, {
            nativeEvent: nativeEvent
          });
        }),
        directives: [{
          name: 'ripple',
          value: this.eventRipple != null ? this.eventRipple : true
        }]
      }, data))), slot ? slot(scope) : [this.genName(event, timedEvent)]);
    },
    genName: function genName(event, timedEvent) {
      return this.$createElement('div', {
        staticClass: 'pl-1',
        domProps: {
          innerHTML: this.eventNameFunction(event, timedEvent)
        }
      });
    },
    genPlaceholder: function genPlaceholder(day) {
      var height = this.eventHeight + this.eventMarginBottom;
      return this.$createElement('div', {
        style: {
          height: "".concat(height, "px")
        },
        attrs: {
          'data-date': day.date
        },
        ref: 'events',
        refInFor: true
      });
    },
    genMore: function genMore(day) {
      var _this5 = this;

      var eventHeight = this.eventHeight;
      var eventMarginBottom = this.eventMarginBottom;
      return this.$createElement('div', {
        staticClass: 'v-event-more pl-1',
        class: {
          'v-outside': day.outside
        },
        attrs: {
          'data-date': day.date,
          'data-more': 1
        },
        directives: [{
          name: 'ripple',
          value: this.eventRipple != null ? this.eventRipple : true
        }],
        on: {
          click: function click() {
            return _this5.$emit('click:more', day);
          }
        },
        style: {
          display: 'none',
          height: "".concat(eventHeight, "px"),
          'margin-bottom': "".concat(eventMarginBottom, "px")
        },
        ref: 'events',
        refInFor: true
      });
    },
    getVisibleEvents: function getVisibleEvents() {
      var start = (0, _timestamp.getDayIdentifier)(this.days[0]);
      var end = (0, _timestamp.getDayIdentifier)(this.days[this.days.length - 1]);
      return this.parsedEvents.filter(function (event) {
        return (0, _events.isEventOverlapping)(event, start, end);
      });
    },
    getEventsForDay: function getEventsForDay(day) {
      var identifier = (0, _timestamp.getDayIdentifier)(day);
      var firstWeekday = this.parsedWeekdays[0];
      return this.parsedEvents.filter(function (event) {
        return (0, _events.isEventStart)(event, day, identifier, firstWeekday);
      });
    },
    getEventsForDayAll: function getEventsForDayAll(day) {
      var identifier = (0, _timestamp.getDayIdentifier)(day);
      var firstWeekday = this.parsedWeekdays[0];
      return this.parsedEvents.filter(function (event) {
        return event.allDay && (0, _events.isEventStart)(event, day, identifier, firstWeekday);
      });
    },
    getEventsForDayTimed: function getEventsForDayTimed(day) {
      var identifier = (0, _timestamp.getDayIdentifier)(day);
      return this.parsedEvents.filter(function (event) {
        return !event.allDay && (0, _events.isEventOn)(event, identifier);
      });
    },
    getScopedSlots: function getScopedSlots() {
      var _this6 = this;

      if (this.noEvents) {
        return this.$scopedSlots;
      }

      var mode = this.eventModeFunction(this.parsedEvents, this.parsedWeekdays[0], this.parsedEventOverlapThreshold);

      var getSlotChildren = function getSlotChildren(day, getter, mapper, timed) {
        var events = getter(day);

        if (events.length === 0) {
          return;
        }

        var visuals = mode(day, events, timed);

        if (timed) {
          return visuals.map(function (visual) {
            return mapper(visual, day);
          });
        }

        var children = [];
        visuals.forEach(function (visual, index) {
          while (children.length < visual.column) {
            children.push(_this6.genPlaceholder(day));
          }

          children.push(mapper(visual, day));
        });
        return children;
      };

      var slots = this.$scopedSlots;
      var slotDay = slots.day;
      var slotDayHeader = slots['day-header'];
      var slotDayBody = slots['day-body'];
      return _objectSpread({}, slots, {
        day: function day(_day) {
          var children = getSlotChildren(_day, _this6.getEventsForDay, _this6.genDayEvent, false);

          if (children && children.length > 0 && _this6.eventMore) {
            children.push(_this6.genMore(_day));
          }

          if (slotDay) {
            var slot = slotDay(_day);

            if (slot) {
              children = children ? children.concat(slot) : slot;
            }
          }

          return children;
        },
        'day-header': function dayHeader(day) {
          var children = getSlotChildren(day, _this6.getEventsForDayAll, _this6.genDayEvent, false);

          if (slotDayHeader) {
            var slot = slotDayHeader(day);

            if (slot) {
              children = children ? children.concat(slot) : slot;
            }
          }

          return children;
        },
        'day-body': function dayBody(day) {
          var events = getSlotChildren(day, _this6.getEventsForDayTimed, _this6.genTimedEvent, true);
          var children = [_this6.$createElement('div', {
            staticClass: 'v-event-timed-container'
          }, events)];

          if (slotDayBody) {
            var slot = slotDayBody(day);

            if (slot) {
              children = children.concat(slot);
            }
          }

          return children;
        }
      });
    }
  }
});

exports.default = _default;
//# sourceMappingURL=calendar-with-events.js.map