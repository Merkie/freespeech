// Styles
// import '../../stylus/components/_calendar-daily.styl'
// Mixins
import CalendarWithEvents from './mixins/calendar-with-events'; // Util

import props from './util/props';
import { DAYS_IN_MONTH_MAX, DAY_MIN, DAYS_IN_WEEK, parseTimestamp, validateTimestamp, relativeDays, nextDay, prevDay, copyTimestamp, updateFormatted, updateWeekday, updateRelative, getStartOfMonth, getEndOfMonth } from './util/timestamp'; // Calendars

import VCalendarMonthly from './VCalendarMonthly';
import VCalendarDaily from './VCalendarDaily';
import VCalendarWeekly from './VCalendarWeekly';
/* @vue/component */

export default CalendarWithEvents.extend({
  name: 'v-calendar',
  props: { ...props.calendar,
    ...props.weeks,
    ...props.intervals
  },
  data: () => ({
    lastStart: null,
    lastEnd: null
  }),
  computed: {
    parsedValue() {
      return validateTimestamp(this.value) ? parseTimestamp(this.value, true) : this.parsedStart || this.times.today;
    },

    renderProps() {
      const around = this.parsedValue;
      let component = null;
      let maxDays = this.maxDays;
      let start = around;
      let end = around;

      switch (this.type) {
        case 'month':
          component = VCalendarMonthly;
          start = getStartOfMonth(around);
          end = getEndOfMonth(around);
          break;

        case 'week':
          component = VCalendarDaily;
          start = this.getStartOfWeek(around);
          end = this.getEndOfWeek(around);
          maxDays = 7;
          break;

        case 'day':
          component = VCalendarDaily;
          maxDays = 1;
          break;

        case '4day':
          component = VCalendarDaily;
          end = relativeDays(copyTimestamp(end), nextDay, 4);
          updateFormatted(end);
          maxDays = 4;
          break;

        case 'custom-weekly':
          component = VCalendarWeekly;
          start = this.parsedStart || around;
          end = this.parsedEnd;
          break;

        case 'custom-daily':
          component = VCalendarDaily;
          start = this.parsedStart || around;
          end = this.parsedEnd;
          break;

        default:
          throw new Error(this.type + ' is not a valid Calendar type');
      }

      return {
        component,
        start,
        end,
        maxDays
      };
    }

  },
  watch: {
    renderProps: 'checkChange'
  },

  mounted() {
    this.updateEventVisibility();
    this.checkChange();
  },

  updated() {
    window.requestAnimationFrame(this.updateEventVisibility);
  },

  methods: {
    checkChange() {
      const {
        lastStart,
        lastEnd
      } = this;
      const {
        start,
        end
      } = this.renderProps;

      if (!lastStart || !lastEnd || start.date !== lastStart.date || end.date !== lastEnd.date) {
        this.lastStart = start;
        this.lastEnd = end;
        this.$emit('change', {
          start,
          end
        });
      }
    },

    move(amount = 1) {
      const moved = copyTimestamp(this.parsedValue);
      const forward = amount > 0;
      const mover = forward ? nextDay : prevDay;
      const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN;
      let times = forward ? amount : -amount;

      while (--times >= 0) {
        switch (this.type) {
          case 'month':
            moved.day = limit;
            mover(moved);
            break;

          case 'week':
            relativeDays(moved, mover, DAYS_IN_WEEK);
            break;

          case 'day':
            const index = moved.weekday;
            const days = forward ? this.weekdaySkips[index] : this.weekdaySkipsReverse[index];
            relativeDays(moved, mover, days);
            break;

          case '4day':
            relativeDays(moved, mover, 4);
            break;
        }
      }

      updateWeekday(moved);
      updateFormatted(moved);
      updateRelative(moved, this.times.now);
      this.$emit('input', moved.date);
      this.$emit('moved', moved);
    },

    next(amount = 1) {
      this.move(amount);
    },

    prev(amount = 1) {
      this.move(-amount);
    },

    timeToY(time, clamp = true) {
      const c = this.$children[0];

      if (c && c.timeToY) {
        return c.timeToY(time, clamp);
      } else {
        return false;
      }
    },

    minutesToPixels(minutes) {
      const c = this.$children[0];

      if (c && c.minutesToPixels) {
        return c.minutesToPixels(minutes);
      } else {
        return -1;
      }
    },

    scrollToTime(time) {
      const c = this.$children[0];

      if (c && c.scrollToTime) {
        return c.scrollToTime(time);
      } else {
        return false;
      }
    }

  },

  render(h) {
    const {
      start,
      end,
      maxDays,
      component
    } = this.renderProps;
    return h(component, {
      staticClass: 'v-calendar',
      class: {
        'v-calendar-events': !this.noEvents
      },
      props: { ...this.$props,
        start: start.date,
        end: end.date,
        maxDays
      },
      directives: [{
        modifiers: {
          quiet: true
        },
        name: 'resize',
        value: this.updateEventVisibility
      }],
      on: { ...this.$listeners,
        'click:date': day => {
          if (this.$listeners['input']) {
            this.$emit('input', day.date);
          }

          if (this.$listeners['click:date']) {
            this.$emit('click:date', day);
          }
        }
      },
      scopedSlots: this.getScopedSlots()
    });
  }

});
//# sourceMappingURL=VCalendar.js.map