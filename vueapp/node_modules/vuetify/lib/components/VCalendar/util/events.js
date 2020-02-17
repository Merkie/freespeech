import { parseTimestamp, getDayIdentifier, getTimestampIdentifier } from './timestamp';
export function parseEvent(input, index, startProperty, endProperty) {
  const start = parseTimestamp(input[startProperty], true);
  const end = input[endProperty] ? parseTimestamp(input[endProperty], true) : start;
  const startIdentifier = getDayIdentifier(start);
  const startTimestampIdentifier = getTimestampIdentifier(start);
  const endIdentifier = getDayIdentifier(end);
  const endOffset = start.hasTime ? 0 : 2359;
  const endTimestampIdentifier = getTimestampIdentifier(end) + endOffset;
  const allDay = !start.hasTime;
  return {
    input,
    start,
    startIdentifier,
    startTimestampIdentifier,
    end,
    endIdentifier,
    endTimestampIdentifier,
    allDay,
    index
  };
}
export function isEventOn(event, dayIdentifier) {
  return dayIdentifier >= event.startIdentifier && dayIdentifier <= event.endIdentifier;
}
export function isEventStart(event, day, dayIdentifier, firstWeekday) {
  return dayIdentifier === event.startIdentifier || firstWeekday === day.weekday && isEventOn(event, dayIdentifier);
}
export function isEventOverlapping(event, startIdentifier, endIdentifier) {
  return startIdentifier <= event.endIdentifier && endIdentifier >= event.startIdentifier;
}
//# sourceMappingURL=events.js.map