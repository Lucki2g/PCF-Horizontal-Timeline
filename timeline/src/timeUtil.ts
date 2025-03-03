// Kaare Børsting - Software Ape - Lucki2g
// Optimized implementation of my version using Intl to using date-fns & date-fns-tz by ChatGPT-o3

import { addDays, addHours, startOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

//
// Type Definitions & Constants
//

export interface DateInfo {
  year: number | undefined; // used for weeks etc.
  name: string;
  hours: number;
  key: string;
}

export enum TimeUnit {
  Year = 0,
  Quarter = 1,
  Month = 2,
  Week = 3,
  Day = 4,
  Hour = 5,
}

export type RoundingType = "year" | "quarter" | "month" | "day" | "none";

export interface TimeOptions {
  years: "full" | "short";
  quarterPrefix: string;
  months: "numeric" | "2-digit" | "long" | "short" | "narrow";
  weeksPrefix: string;
  days: "numeric" | "2-digit" | "long" | "short" | "narrow";
  hourCycle: "h11" | "h12" | "h23" | "h24";
  hours: "numeric" | "2-digit";
  minutes: "numeric" | "2-digit";
  seconds: "numeric" | "2-digit";
}

export const timeUnitInformation = (unit: TimeUnit) => {
  switch (unit) {
    case TimeUnit.Year:
      return { i18ntranslation: "year", timeUnits: "years" };
    case TimeUnit.Quarter:
      return { i18ntranslation: "quarter", timeUnits: "quarters" };
    case TimeUnit.Month:
      return { i18ntranslation: "month", timeUnits: "months" };
    case TimeUnit.Week:
      return { i18ntranslation: "week", timeUnits: "weeks" };
    case TimeUnit.Day:
      return { i18ntranslation: "day", timeUnits: "days" };
    case TimeUnit.Hour:
      return { i18ntranslation: "hour", timeUnits: "hours" };
  }
};

export interface TimeUnits {
  [idx: string]: DateInfo[];
}

export const MILIS_IN_HOUR = 1000 * 60 * 60;
export const MILIS_IN_DAY = MILIS_IN_HOUR * 24;
export const ITEM_PADDING: number = 12;
export const fontSize: number = 10;
export const ySize: number = 24;
export const defaultOptions: TimeOptions = {
  years: "full",
  quarterPrefix: "",
  months: "short",
  weeksPrefix: "",
  days: "short",
  hourCycle: "h23",
  hours: "2-digit",
  minutes: "2-digit",
  seconds: "2-digit",
};

//
// Optimized Date Functions using date-fns & date-fns-tz
//

// Adds one day to the given date and rounds it to the start of that day in the given timezone.
export const addDayToDateAndRound = (date: Date, timezone: string): Date => {
  const newDate = addDays(date, 1);
  const zonedDate = toZonedTime(newDate, timezone);
  const roundedZonedDate = startOfDay(zonedDate);
  return fromZonedTime(roundedZonedDate, timezone);
};

// Removes one day from the given date and rounds it to the start of that day in the given timezone.
export const removeDayFromDateAndRound = (date: Date, timezone: string): Date => {
  const newDate = addDays(date, -1);
  const zonedDate = toZonedTime(newDate, timezone);
  const roundedZonedDate = startOfDay(zonedDate);
  return fromZonedTime(roundedZonedDate, timezone);
};

// Computes the left offset (in pixels) for a date relative to a start date.
export const getLeft = (date: Date, start: Date, xSize: number): number => {
  const diff = date.getTime() - start.getTime();
  const pxPerMs = xSize / MILIS_IN_HOUR;
  return pxPerMs * diff;
};

//
// Optimized getAvailableTimeUnitsV2 Implementation
//

export function getAvailableTimeUnitsV2(
  startDate: Date,
  endDate: Date,
  units: TimeUnit[],
  options: TimeOptions,
  locale: string,
  timezone: string,
  rounding: RoundingType = "none"
): TimeUnits {
  const years: DateInfo[] = [];
  const quarters: DateInfo[] = [];
  const months: DateInfo[] = [];
  const weeks: DateInfo[] = [];
  const days: DateInfo[] = [];
  const hours: DateInfo[] = [];

  // Helper to calculate ISO week number.
  function getISOWeekNumber(d: Date): number {
    const date = new Date(d.getTime());
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  }

  // Convert a UTC date to zoned time.
  const toZoned = (date: Date) => toZonedTime(date, timezone);

  let currentDateUTC = startDate; // Iteration in UTC.
  let hoursInDay = 0,
      hoursInWeek = 0,
      hoursInMonth = 0,
      hoursInQuarter = 0,
      hoursInYear = 0;

  let weekNumber = getISOWeekNumber(toZoned(currentDateUTC));

  while (currentDateUTC <= endDate) {
    const zonedCurrent = toZoned(currentDateUTC);
    const year = zonedCurrent.getFullYear();
    const month = zonedCurrent.getMonth();
    const day = zonedCurrent.getDate();
    const hour = zonedCurrent.getHours();

    // Format the hour using Intl (or you can use date-fns format if you prefer)
    const hourFormatter = new Intl.DateTimeFormat(locale, {
      hour: options.hours,
      hourCycle: options.hourCycle,
      timeZone: timezone,
    });
    const hourName = hourFormatter.format(zonedCurrent);

    hours.push({
      key: `${year}-m${month}-d${day}-h${hour}`,
      year,
      name: hourName,
      hours: 1,
    });

    hoursInDay++;
    hoursInWeek++;
    hoursInMonth++;
    hoursInQuarter++;
    hoursInYear++;

    // Move to the next hour.
    const nextDateUTC = addHours(currentDateUTC, 1);
    const zonedNext = toZoned(nextDateUTC);

    // Check for day boundary.
    if (zonedCurrent.getDate() !== zonedNext.getDate()) {
      const dayFormatter = new Intl.DateTimeFormat(locale, 
        options.days === "numeric" || options.days === "2-digit"
          ? { day: options.days, timeZone: timezone }
          : { weekday: options.days, timeZone: timezone });
      days.push({
        key: `${year}-m${month}-d${day}`,
        year,
        name: dayFormatter.format(zonedCurrent),
        hours: hoursInDay,
      });
      hoursInDay = 0;

      // Week boundary check.
      const currentWeekNumber = getISOWeekNumber(zonedCurrent);
      const nextWeekNumber = getISOWeekNumber(zonedNext);
      if (currentWeekNumber !== nextWeekNumber) {
        weeks.push({
          key: `${year}-w${currentWeekNumber}`,
          year,
          name: `${options.weeksPrefix}${currentWeekNumber}`,
          hours: hoursInWeek,
        });
        hoursInWeek = 0;
      }

      // Month boundary check.
      const monthFormatter = new Intl.DateTimeFormat(locale, { month: options.months, timeZone: timezone });
      if (zonedCurrent.getMonth() !== zonedNext.getMonth()) {
        const monthName = monthFormatter.format(zonedCurrent);
        months.push({
          key: `${year}-m${monthName}`,
          year,
          name: monthName,
          hours: hoursInMonth,
        });

        // Quarter boundary check.
        const quarterCurrent = Math.floor(zonedCurrent.getMonth() / 3) + 1;
        const quarterNext = Math.floor(zonedNext.getMonth() / 3) + 1;
        if (quarterCurrent !== quarterNext) {
          const quarterName = `${options.quarterPrefix}${quarterCurrent}`;
          quarters.push({
            key: `${year}-q${quarterName}`,
            year,
            name: quarterName,
            hours: hoursInQuarter,
          });
          hoursInQuarter = 0;
        }
        hoursInMonth = 0;
      }

      // Year boundary check.
      if (zonedCurrent.getFullYear() !== zonedNext.getFullYear()) {
        const key = options.years === "full" ? year.toString() : year.toString().slice(-2);
        years.push({
          key,
          year,
          name: key,
          hours: hoursInYear,
        });
        hoursInYear = 0;
      }
    }

    currentDateUTC = nextDateUTC;
  }

  // Process any leftovers at the end.
  const finalZoned = toZoned(currentDateUTC);
  const finalYear = finalZoned.getFullYear();
  const finalMonth = finalZoned.getMonth();
  const finalDay = finalZoned.getDate();
  if (hoursInDay > 0) {
    const dayFormatter = new Intl.DateTimeFormat(locale, 
      options.days === "numeric" || options.days === "2-digit"
        ? { day: options.days, timeZone: timezone }
        : { weekday: options.days, timeZone: timezone });
    days.push({
      key: `${finalYear}-m${finalMonth}-d${finalDay}`,
      year: finalYear,
      name: dayFormatter.format(finalZoned),
      hours: hoursInDay,
    });
  }
  if (hoursInWeek > 0) {
    const currentWeekNumber = getISOWeekNumber(finalZoned);
    weeks.push({
      key: `${finalYear}-w${currentWeekNumber}`,
      year: finalYear,
      name: `${options.weeksPrefix}${currentWeekNumber}`,
      hours: hoursInWeek,
    });
  }
  if (hoursInMonth > 0) {
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: options.months, timeZone: timezone });
    const monthName = monthFormatter.format(finalZoned);
    months.push({
      key: `${finalYear}-m${monthName}`,
      year: finalYear,
      name: monthName,
      hours: hoursInMonth,
    });
  }
  if (hoursInQuarter > 0) {
    const quarterCurrent = Math.floor(finalZoned.getMonth() / 3) + 1;
    const quarterName = `${options.quarterPrefix}${quarterCurrent}`;
    quarters.push({
      key: `${finalYear}-q${quarterName}`,
      year: finalYear,
      name: quarterName,
      hours: hoursInQuarter,
    });
  }
  if (hoursInYear > 0) {
    const key = options.years === "full" ? finalYear.toString() : finalYear.toString().slice(-2);
    years.push({
      key,
      year: finalYear,
      name: key,
      hours: hoursInYear,
    });
  }

  return {
    years,
    quarters,
    months,
    weeks,
    days,
    hours,
  } as TimeUnits;
}
