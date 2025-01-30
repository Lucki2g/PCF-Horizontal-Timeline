// Kaare Børsting - Software Ape - Lucki2g
export interface DateInfo {
    year: number | undefined; // just used for weeks
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
    Hour = 5
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
            return { i18ntranslation: "year", timeUnits: "years" }
        case TimeUnit.Quarter:
            return { i18ntranslation: "quarter", timeUnits: "quarters" }
        case TimeUnit.Month:
            return { i18ntranslation: "month", timeUnits: "months" }
        case TimeUnit.Week:
            return { i18ntranslation: "week", timeUnits: "weeks" }
        case TimeUnit.Day:
            return { i18ntranslation: "day", timeUnits: "days" }
        case TimeUnit.Hour:
            return { i18ntranslation: "hour", timeUnits: "hours" }
    }
}
  
export interface TimeUnits { [idx: string]: DateInfo[] }

const MILIS_IN_HOUR = 1000 * 60 * 60;
export const ITEM_PADDING: number = 12;
export const fontSize: number = 10;
export const ySize: number = 24;
export const defaultOptions: any = {
    years: "full",
    quarterPrefix: "",
    months: "short",
    weeksPrefix: "",
    days: "short",
    hours: "24h",
    minutes: "2-digit",
    seconds: "2-digit",
};

export const addDayToDateAndRound = (date: Date, timezone: string) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    // Ensure we preserve the correct timezone when resetting the time
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    });

    const formattedDate = formatter.format(newDate);
    return new Date(formattedDate);
}

export const removeDayFromDateAndRound = (date: Date, timezone: string) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);

    // Ensure we preserve the correct timezone when resetting the time
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    });

    const formattedDate = formatter.format(newDate);
    return new Date(formattedDate);
}

/**
 * 
 * @param startDate 
 * @param endDate 
 * @param locale 
 * @param options 
 * @param rounding 
 * @returns an object containing strings for a timeline
 */
export function getAvailableTimeUnits(
    startDate: Date,
    endDate: Date,
    units: TimeUnit[],
    options: TimeOptions,
    locale: string = "en-US",
    timezone: string = "UTC",
    rounding: RoundingType = "none"
): TimeUnits {

    if (!startDate || !endDate) return { };

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startQuarter = Math.floor(startDate.getMonth() / 3) + 1;
    const endQuarter = Math.floor(endDate.getMonth() / 3) + 1;
    // do rounding before starting to add strings

    // const doRounding = (rounding: RoundingType, start: Date, end: Date): { start: Date, end: Date } => {

    //     const roundedStart = new Date(start);
    //     const roundedEnd = new Date(end);

    //     switch (rounding) {
    //         case "year":
    //         roundedStart.setMonth(0);
    //         roundedStart.setDate(1);
    //         roundedStart.setHours(0, 0, 0, 0);
    //         roundedEnd.setMonth(11);
    //         roundedEnd.setDate(new Date(end.getFullYear(), end.getMonth(), 0).getDate());
    //         roundedEnd.setHours(0, 0, 0, 0);
    //         break;
    //         case "quarter":
    //         // figure out the start & end quarter
    //         roundedStart.setMonth(startQuarter * 3);
    //         roundedStart.setDate(1);
    //         roundedStart.setHours(0, 0, 0, 0);
    //         roundedEnd.setMonth(endQuarter * 3);
    //         roundedEnd.setDate(new Date(end.getFullYear(), end.getMonth(), 0).getDate());
    //         roundedEnd.setHours(0, 0, 0, 0);
    //         break;
    //         case "month":
    //         roundedStart.setDate(1);
    //         roundedStart.setHours(0, 0, 0, 0);
    //         roundedEnd.setDate(new Date(end.getFullYear(), end.getMonth(), 0).getDate());
    //         roundedEnd.setHours(0, 0, 0, 0);
    //         break;
    //         case "day":
    //         roundedStart.setHours(0, 0, 0, 0);
    //         roundedEnd.setHours(0, 0, 0, 0);
    //         break;
    //     }

    //     return { start: roundedStart, end: roundedEnd };
    // }

    // const { start: roundedStart, end: roundedEnd } = doRounding(rounding, startDate, endDate);

    const roundedStart = startDate;
    const roundedEnd = endDate;

    //////////////////////////////////////////////////
    //                                              //
    //                    YEARS                     //
    //                                              //
    //////////////////////////////////////////////////
    // start building the timeUnit object
    // Quarters
    let quarters: DateInfo[] = [];
    if (units.includes(TimeUnit.Quarter)) {
        for (let year = startYear; year <= endYear; year++) {
            const quartersInYear = getListOfQuarters(year, roundedStart, roundedEnd);
            quarters = quarters.concat(quartersInYear)
        }
    }

    // Years
    let years: DateInfo[] = [];
    if (units.includes(TimeUnit.Year)) {
        years = getListOfYears(roundedStart, roundedEnd);
    }

    // Months
    let months: DateInfo[] = [];
    if (units.includes(TimeUnit.Month)) {
        months = getListOfMonths(roundedStart, roundedEnd);
    }

    // Weeks
    let weeks: DateInfo[] = [];
    if (units.includes(TimeUnit.Week)) {
        weeks = getListOfWeeks(roundedStart, roundedEnd);
    }
    
    // Days
    let days: DateInfo[] = [];
    if (units.includes(TimeUnit.Day)) {
        days = getListOfDays(roundedStart, roundedEnd);
    }
    
    // Days
    let hours: DateInfo[] = [];
    if (units.includes(TimeUnit.Hour)) {
        hours = getListOfHours(roundedStart, roundedEnd);
    }

    function getListOfYears(startDate: Date, endDate: Date): DateInfo[] {
        const years: DateInfo[] = [];
        let currentYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();

        while (currentYear <= endYear) {
            let yearStartDate = new Date(currentYear, 0, 1); // First day of the year
            let yearEndDate = new Date(currentYear, 11, 31); // Last day of the year

            if (yearStartDate < startDate) yearStartDate = new Date(startDate);
            if (yearEndDate > endDate) yearEndDate = new Date(endDate);

            const key = options?.years === "full" ? currentYear.toString() : currentYear.toString().slice(-2);

            years.push({
                key: `${key}`,
                year: currentYear,
                name: key,
                hours: getTotalHoursBetweenDates(yearStartDate, yearEndDate)
            });

            currentYear++;
        }

        return years;
    }

    //////////////////////////////////////////////////
    //                                              //
    //                  QUARTERS                    //
    //                                              //
    //////////////////////////////////////////////////
    function getListOfQuarters(year: number, start: Date, end: Date): DateInfo[] {

        const quarters: DateInfo[] = [];
        const firstQuarter = year === startYear ? startQuarter : 1;
        const lastQuarter = year === endYear ? endQuarter : 4;
        
        for (let quarter = firstQuarter; quarter <= lastQuarter; quarter++) {
        const quarterStartMonth = (quarter - 1) * 3;
        const quarterEndMonth = quarter * 3;
        let quarterStartDate = new Date(year, quarterStartMonth, 1);
        let quarterEndDate = new Date(year, quarterEndMonth, 0); // Last day of the quarter

        // Adjust start and end dates of the quarter to match the overall start and end dates if necessary
        if (quarterStartDate < start) quarterStartDate = new Date(start);
        if (quarterEndDate > end) quarterEndDate = new Date(end);

        const key = `${options?.quarterPrefix}${quarter}`;
        quarters.push({
            key: `${year}-q${key}`,
            year: year,
            name: key,
            hours: getTotalHoursBetweenDates(quarterStartDate, quarterEndDate)
        });
    }

        return quarters;
    }

    //////////////////////////////////////////////////
    //                                              //
    //                   MONTHS                     //
    //                                              //
    //////////////////////////////////////////////////
    function getListOfMonths(startDate: Date, endDate: Date): DateInfo[] {

        const monthFormatter = new Intl.DateTimeFormat(locale, { month: options?.months });
        const months: DateInfo[] = [];
        let currentDate = new Date(startDate);

        const start = currentDate;
        const end = endDate;
        // const { start, end } = doRounding(rounding, currentDate, endDate);

        while (currentDate <= end) {
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            const monthEnd = new Date(nextMonth.getTime() - 1);
            monthEnd.setHours(0, 0, 0, 0);

            const year = currentDate.getFullYear();
            const key = monthFormatter.format(currentDate);
            months.push({
                key: `${year}-m${key}`,
                year: year,
                name: key,
                hours: getTotalHoursBetweenDates(monthStart, monthEnd)
            });

            currentDate = nextMonth;
        }

        return months;
    }

    //////////////////////////////////////////////////
    //                                              //
    //                   WEEKS                      //
    //                                              //
    //////////////////////////////////////////////////
    function getListOfWeeks(start: Date, end: Date): DateInfo[] {
        const weeks: DateInfo[] = [];

        function getISOWeekNumber(d: Date): { weekNumber: number, weekStart: Date } {
            const date = new Date(d.getTime());
        
            // Adjust for ISO week starting on Monday
            date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
            const week1 = new Date(date.getFullYear(), 0, 4);
            const weekNumber = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);

            // Calculate start date of the week
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - ((date.getDay() === 0 ? 7 : date.getDay()) - 1));

            return { weekNumber, weekStart };
        }

        const currentDate = new Date(start);

        while (currentDate <= end) {
            const { weekNumber, weekStart } = getISOWeekNumber(currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6); // End of the week

            // Adjust week boundaries within the date range
            if (weekStart < start) {
                weekStart.setTime(start.getTime());
            }
            if (weekEnd > end) {
                weekEnd.setTime(end.getTime());
            }
            const totalHours = getTotalHoursBetweenDates(weekStart, weekEnd);

            const year = currentDate.getFullYear();
            const key = `${options?.weeksPrefix}${weekNumber}`;
            weeks.push({ 
                key: `${year}-m${currentDate.getMonth()}-w${key}`,
                year: year, 
                name: key, 
                hours: totalHours
            });

            currentDate.setDate(weekEnd.getTime() + MILIS_IN_HOUR);
        }

        const uniqueWeeks = weeks.filter((value, index, self) =>
            index === self.findIndex((t) => t.name === value.name && t.year === value.year && t.hours === value.hours)
        );

        return uniqueWeeks;
    }

    //////////////////////////////////////////////////
    //                                              //
    //                   DAYS                       //
    //                                              //
    //////////////////////////////////////////////////
    function getListOfDays(startDate: Date, endDate: Date): DateInfo[] {
        const daysFormatter = new Intl.DateTimeFormat(
            locale, 
            (options.days === "numeric" || options.days === "2-digit") ? 
            { day: options.days, timeZone: timezone } : 
            { weekday: options.days, timeZone: timezone });
        const days: DateInfo[] = [];
        let currentDate = new Date(startDate);

        endDate.setHours(0, 0, 0, 0);

        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const day = currentDate.getDate();

            const nextDay = new Date(currentDate);
            nextDay.setDate(day + 1); // TODO maybe here?
            nextDay.setHours(0, 0, 0, 0);

            const startOfDay = new Date(currentDate);
            if (currentDate.getTime() !== startDate.getTime()) {
                startOfDay.setHours(0, 0, 0, 0);
            }

            const endOfDay = nextDay > endDate ? endDate : nextDay;
            const dayName = daysFormatter.format(currentDate);
            const hours = getTotalHoursBetweenDates(startOfDay, endOfDay);

            console.log(day, timezone, dayName, hours)

            days.push({ 
                key: `${year}-m${month}-d${day}`,
                year, 
                name: dayName, 
                hours: hours
            } as DateInfo)
            currentDate = new Date(nextDay);
        }

        return days;
    }

    //////////////////////////////////////////////////
    //                                              //
    //                  HOURS                       //
    //                                              //
    //////////////////////////////////////////////////
    function getListOfHours(startDate: Date, endDate: Date): DateInfo[] {
        const hourFormatter = new Intl.DateTimeFormat(locale, { hourCycle: options.hourCycle, hour: options.hours, timeZone: timezone });
        const hours: DateInfo[] = [];

        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const date = new Date(currentDate);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const hour = date.getHours();
            hours.push({ 
                key: `${year}-m${month}-d${day}-h${hour}`,
                year: year,
                name: hourFormatter.format(date),
                hours: 1
            } as DateInfo);
    
            // Use getTime + 1 hour in ms to prevent timezone/DST shifts (sommertid)
            currentDate = new Date(currentDate.getTime() + MILIS_IN_HOUR);
        }

        return hours;
    }

    return {
        years: years,
        quarters: quarters,
        months: months,
        weeks: weeks,
        days: days,
        hours: hours
    } as TimeUnits;
}

export const getLeft = (date: Date, start: Date, xSize: number) => {
    const diff = date.getTime() - start.getTime();
    const pxPerMs = xSize / MILIS_IN_HOUR;
    return pxPerMs * diff;
}

function getTotalHoursBetweenDates(startDate: Date, endDate: Date): number {
    let totalHours = 0;
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
        const nextHour = new Date(currentDate.getTime() + MILIS_IN_HOUR);
        totalHours++;

        // Move to the next hour
        currentDate = nextHour;
    }

    return totalHours;
}

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

    function getISOWeekNumber(d: Date): number {
        const date = new Date(d.getTime());
    
        // Adjust for ISO week starting on Monday
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        const week1 = new Date(date.getFullYear(), 0, 4);
        const weekNumber = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);

        return weekNumber;
    }

    const hourFormatter = new Intl.DateTimeFormat(
        locale, { 
            hourCycle: options.hourCycle, 
            hour: options.hours, 
            timeZone: timezone,
        }
    );
    const daysFormatter = new Intl.DateTimeFormat(
        locale, 
        (options.days === "numeric" || options.days === "2-digit") ? 
        { day: options.days, timeZone: timezone } : 
        { weekday: options.days, timeZone: timezone }
    );
    const monthFormatter = new Intl.DateTimeFormat(
        locale, { 
            month: options?.months, 
            timeZone: timezone
        }
    );

    let currentDate = new Date(startDate.toISOString());
    let hoursInDay = 0;
    let hoursInWeek = 0;
    let hoursInMonth = 0;
    let hoursInQuarter = 0;
    let hoursInYear = 0;
    let weekNumber = getISOWeekNumber(currentDate);
    while (currentDate <= endDate) {
        hoursInDay++;
        hoursInWeek++;
        hoursInMonth++;
        hoursInQuarter++;
        hoursInYear++;

        const date = new Date(currentDate);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();
        hours.push({ 
            key: `${year}-m${month}-d${day}-h${hour}`,
            year,
            name: hourFormatter.format(currentDate),
            hours: 1
        } as DateInfo);

        // Use getTime + 1 hour in ms to prevent timezone/DST shifts (sommertid)
        const nextHour = new Date(currentDate.getTime() + MILIS_IN_HOUR);
        // DAY
        if (daysFormatter.format(currentDate) !== daysFormatter.format(nextHour)) {
            days.push({ 
                key: `${year}-m${month}-d${day}`,
                year, 
                name: daysFormatter.format(currentDate), 
                hours: hoursInDay
            } as DateInfo);

            // WEEK
            const nextWeekNumber = getISOWeekNumber(currentDate);
            if (weekNumber !== nextWeekNumber) {
                const key = `${options?.weeksPrefix}${weekNumber}`;
                weeks.push({ 
                    key: `${year}-m${month}-w${key}`,
                    year: year, 
                    name: key, 
                    hours: hoursInWeek
                });
                weekNumber = nextWeekNumber;
                hoursInWeek = 0;
            }

            // MONTH
            if (monthFormatter.format(currentDate) !== monthFormatter.format(nextHour)) {
                const key = monthFormatter.format(currentDate);
                months.push({
                    key: `${year}-m${key}`,
                    year: year,
                    name: key,
                    hours: hoursInMonth
                });

                // QUARTER
                if ((month + 1) % 3 === 0) {
                    const key = `${options?.quarterPrefix}${(currentDate.getMonth() + 1) % 3}`;
                    quarters.push({
                        key: `${year}-q${key}`,
                        year: year,
                        name: key,
                        hours: hoursInQuarter
                    });
                    hoursInQuarter = 0;
                }

                hoursInMonth = 0;
            }

            // YEAR
            if (currentDate.getFullYear() !== nextHour.getFullYear()) {
                const currentYear = currentDate.getFullYear();
                const key = options?.years === "full" 
                ? currentYear.toString() 
                : currentYear.toString().slice(-2);
                years.push({
                    key: `${key}`,
                    year: currentYear,
                    name: key,
                    hours: hoursInYear
                });
                hoursInYear = 0;
            }

            hoursInDay = 0;
        }

        currentDate = nextHour;
    }

    const date = new Date(currentDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    if (hoursInDay > 0) {
        days.push({ 
            key: `${year}-m${month}-d${day}`,
            year, 
            name: daysFormatter.format(currentDate), 
            hours: hoursInDay
        } as DateInfo);
    }
    if (hoursInWeek > 0) {
        const key = `${options?.weeksPrefix}${weekNumber}`;
        weeks.push({ 
            key: `${year}-m${month}-w${key}`,
            year: year, 
            name: key, 
            hours: hoursInWeek
        });
    }
    if (hoursInMonth > 0) {
        const key = monthFormatter.format(currentDate);
        months.push({
            key: `${year}-m${key}`,
            year: year,
            name: key,
            hours: hoursInMonth
        });
    }
    if (hoursInQuarter > 0) {
        const key = `${options?.quarterPrefix}${(currentDate.getMonth() + 1) % 3}`;
        quarters.push({
            key: `${year}-q${key}`,
            year: year,
            name: key,
            hours: hoursInQuarter
        });
        hoursInQuarter = 0;
    }
    if (hoursInYear > 0) {
        const currentYear = currentDate.getFullYear();
        const key = options?.years === "full" 
        ? currentYear.toString() 
        : currentYear.toString().slice(-2);
        years.push({
            key: `${key}`,
            year: currentYear,
            name: key,
            hours: hoursInYear
        });
    }


    return {
        years: years,
        quarters: quarters,
        months: months,
        weeks: weeks,
        days: days,
        hours: hours
    } as TimeUnits;
}