"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEvent = parseEvent;
exports.isEventOn = isEventOn;
exports.isEventStart = isEventStart;
exports.isEventOverlapping = isEventOverlapping;

var _timestamp = require("./timestamp");

function parseEvent(input, index, startProperty, endProperty) {
  var start = (0, _timestamp.parseTimestamp)(input[startProperty], true);
  var end = input[endProperty] ? (0, _timestamp.parseTimestamp)(input[endProperty], true) : start;
  var startIdentifier = (0, _timestamp.getDayIdentifier)(start);
  var startTimestampIdentifier = (0, _timestamp.getTimestampIdentifier)(start);
  var endIdentifier = (0, _timestamp.getDayIdentifier)(end);
  var endOffset = start.hasTime ? 0 : 2359;
  var endTimestampIdentifier = (0, _timestamp.getTimestampIdentifier)(end) + endOffset;
  var allDay = !start.hasTime;
  return {
    input: input,
    start: start,
    startIdentifier: startIdentifier,
    startTimestampIdentifier: startTimestampIdentifier,
    end: end,
    endIdentifier: endIdentifier,
    endTimestampIdentifier: endTimestampIdentifier,
    allDay: allDay,
    index: index
  };
}

function isEventOn(event, dayIdentifier) {
  return dayIdentifier >= event.startIdentifier && dayIdentifier <= event.endIdentifier;
}

function isEventStart(event, day, dayIdentifier, firstWeekday) {
  return dayIdentifier === event.startIdentifier || firstWeekday === day.weekday && isEventOn(event, dayIdentifier);
}

function isEventOverlapping(event, startIdentifier, endIdentifier) {
  return startIdentifier <= event.endIdentifier && endIdentifier >= event.startIdentifier;
}
//# sourceMappingURL=events.js.map