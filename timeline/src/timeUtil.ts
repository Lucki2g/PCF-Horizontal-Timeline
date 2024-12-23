import { RoundingType } from "./components/TimelineData";

// Kaare Børsting - Software Ape - Lucki2g
export interface DateInfo {
    year: number | undefined; // just used for weeks
    name: string;
    days: number;
    key: string;
}

export enum TimeUnit {
    Year = 0,
    Quarter = 1,
    Month = 2,
    Week = 3,
    Day = 4
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
    }
}
  
export interface TimeUnits { [idx: string]: DateInfo[] }

const MILIS_IN_DAY = 1000 * 60 * 60 * 24;
export const ITEM_PADDING: number = 12;
export const fontSize: number = 10;
export const xSize: number = 32;
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

export const addDayToDate = (date: Date) => {
    const newTime = date.getTime() + MILIS_IN_DAY;
    return new Date(newTime);
}

export const removeDayFromDate = (date: Date) => {
    const newTime = date.getTime() - MILIS_IN_DAY;
    return new Date(newTime);
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
    options?: {
        years: "full" | "short";
        quarterPrefix: string;
        months: "numeric" | "2-digit" | "long" | "short" | "narrow";
        weeksPrefix: string;
        days: "numeric" | "long" | "short" | "narrow";
        hours: "24h" | "12h";
        minutes: "numeric" | "2-digit";
        seconds: "numeric" | "2-digit";
    },
    locale: string = "en-US",
    rounding: RoundingType = "none"
): TimeUnits {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startQuarter = Math.floor(startDate.getMonth() / 3) + 1;
    const endQuarter = Math.floor(endDate.getMonth() / 3) + 1;
    // do rounding before starting to add strings

    const doRounding = (rounding: RoundingType, start: Date, end: Date): { start: Date, end: Date } => {

        const roundedStart = new Date(start);
        const roundedEnd = new Date(end);

        switch (rounding) {
            case "year":
            roundedStart.setMonth(0);
            roundedStart.setDate(1);
            roundedStart.setHours(0, 0, 0, 0);
            roundedEnd.setMonth(11);
            roundedEnd.setDate(new Date(end.getFullYear(), end.getMonth(), 0).getDate());
            roundedEnd.setHours(0, 0, 0, 0);
            break;
            case "quarter":
            // figure out the start & end quarter
            roundedStart.setMonth(startQuarter * 3);
            roundedStart.setDate(1);
            roundedStart.setHours(0, 0, 0, 0);
            roundedEnd.setMonth(endQuarter * 3);
            roundedEnd.setDate(new Date(end.getFullYear(), end.getMonth(), 0).getDate());
            roundedEnd.setHours(0, 0, 0, 0);
            break;
            case "month":
            roundedStart.setDate(1);
            roundedStart.setHours(0, 0, 0, 0);
            roundedEnd.setDate(new Date(end.getFullYear(), end.getMonth(), 0).getDate());
            roundedEnd.setHours(0, 0, 0, 0);
            break;
            case "day":
            roundedStart.setHours(0, 0, 0, 0);
            roundedEnd.setHours(0, 0, 0, 0);
            break;
        }

        return { start: roundedStart, end: roundedEnd };
    }

    const { start: roundedStart, end: roundedEnd } = doRounding(rounding, startDate, endDate);

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

    function getListOfYears(startDate: Date, endDate: Date): DateInfo[] {
        const years: DateInfo[] = [];
        let currentYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();

        while (currentYear <= endYear) {
            let yearStartDate = new Date(currentYear, 0, 1); // First day of the year
            let yearEndDate = new Date(currentYear, 11, 31); // Last day of the year

            if (yearStartDate < startDate) yearStartDate = new Date(startDate);
            if (yearEndDate > endDate) yearEndDate = new Date(endDate);

            const daysInYear = Math.round((yearEndDate.getTime() - yearStartDate.getTime()) / MILIS_IN_DAY + 1);
            const key = options?.years === "full" ? currentYear.toString() : currentYear.toString().slice(-2);

            years.push({
                key: `${key}`,
                year: currentYear,
                name: key,
                days: daysInYear
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

        // add one day due to 30-17 = 13 but has day 13 as well
        const daysInQuarter = Math.round((quarterEndDate.getTime() - quarterStartDate.getTime()) / MILIS_IN_DAY + 1);

        const key = `${options?.quarterPrefix}${quarter}`;
        quarters.push({
            key: `${year}-q${key}`,
            year: year,
            name: key,
            days: daysInQuarter // Round down to avoid partial days
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

        const { start, end } = doRounding(rounding, currentDate, endDate);

        while (currentDate <= end) {
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            const monthEnd = new Date(nextMonth.getTime() - 1);
            monthEnd.setHours(0, 0, 0, 0);

            let daysInMonth = 0;
            if (start > monthStart && end < nextMonth) {
                // If both start and end dates are within the same month
                daysInMonth = (end.getTime() - start.getTime()) / MILIS_IN_DAY + 1;
            } else if (currentDate.getMonth() === start.getMonth() && currentDate.getFullYear() === start.getFullYear()) {
                // If the month is the start month
                daysInMonth = (monthEnd.getTime() - start.getTime()) / MILIS_IN_DAY + 1;
            } else if (currentDate.getMonth() === end.getMonth() && currentDate.getFullYear() === end.getFullYear()) {
                // If the month is the end month
                daysInMonth = (end.getTime() - monthStart.getTime()) / MILIS_IN_DAY + 1;
            } else {
                // Full month
                daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            }

            const year = currentDate.getFullYear();
            const key = monthFormatter.format(currentDate);
            months.push({
                key: `${year}-m${key}`,
                year: year,
                name: key,
                days: Math.round(daysInMonth)
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
            date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
            const week1 = new Date(date.getFullYear(), 0, 4);
            const weekNumber = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);

            // Calculate start date of the week
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Adjust for ISO week starting on Monday

            return { weekNumber, weekStart };
        }

        const currentDate = new Date(start);

        while (currentDate <= end) {
            const { weekNumber, weekStart } = getISOWeekNumber(currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6); // End of the week

            // Calculate days in week within the range
            let daysInWeek = 7;
            if (weekStart < start) {
                daysInWeek -= (start.getTime() - weekStart.getTime()) / MILIS_IN_DAY;
            }
            if (weekEnd > end) {
                daysInWeek -= (weekEnd.getTime() - end.getTime()) / MILIS_IN_DAY;
            }

            const year = currentDate.getFullYear();
            const key = `${options?.weeksPrefix}${weekNumber}`;
            weeks.push({ 
                key: `${year}-m${currentDate.getMonth()}-w${key}`,
                year: year, 
                name: key, 
                days: Math.round(daysInWeek) 
            });

            currentDate.setDate(currentDate.getDate() + daysInWeek);
        }

        const uniqueWeeks = weeks.filter((value, index, self) =>
            index === self.findIndex((t) => t.name === value.name && t.year === value.year && t.days === value.days)
        );

        return uniqueWeeks;
    }

    //////////////////////////////////////////////////
    //                                              //
    //                   DAYS                       //
    //                                              //
    //////////////////////////////////////////////////
    function getListOfDays(startDate: Date, endDate: Date): DateInfo[] {
        const daysFormatter = new Intl.DateTimeFormat(locale, { day: "numeric" });
        const days: DateInfo[] = [];

        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            days.push({ 
                key: `${year}-m${currentDate.getMonth()}-d${currentDate.getDate()}`, 
                year: currentDate.getFullYear(), 
                name: daysFormatter.format(currentDate), 
                days: 1
            } as DateInfo)
            currentDate.setDate(currentDate.getDate() + 1)
        }

        return days;
    }

    return {
        years: years,
        quarters: quarters,
        months: months,
        weeks: weeks,
        days: days
    } as TimeUnits;
}

export const getLeft = (date: Date, start: Date) => {
    const diff = date.getTime() - start.getTime();
    const pxPerMs = xSize / MILIS_IN_DAY;
    return pxPerMs * diff;
}
