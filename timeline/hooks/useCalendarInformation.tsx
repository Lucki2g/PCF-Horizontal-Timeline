import { TFunction } from 'i18next';
import * as React from 'react';
import { getIconClassName } from "@fluentui/style-utilities";
import { useTranslation } from 'react-i18next';
import { useGlobalGlobalContext } from '../contexts/global-context';

export function useCalendarInformation() {

  const { t } = useTranslation();
  const { locale } = useGlobalGlobalContext();

  return React.useMemo(() => {
    // Create formatters
    const formatterMonthLong = new Intl.DateTimeFormat(locale, { month: 'long' });
    const formatterMonthShort = new Intl.DateTimeFormat(locale, { month: 'short' });
    const formatterDayLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    const formatterDayShort = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });

    // January 4, 1970 is a Sunday.
    const days = [...Array(7).keys()].map((d) =>
      formatterDayLong.format(new Date(1970, 0, d + 4))
    );
    const shortDays = [...Array(7).keys()].map((d) =>
      formatterDayShort.format(new Date(1970, 0, d + 4))
    );

    return {
      calendarDayProps: {
        strings: {
          goToToday: t("datepicker_gototoday"),
          months: [...Array(12).keys()].map((m) =>
            formatterMonthLong.format(new Date(1970, m, 1))
          ),
          shortMonths: [...Array(12).keys()].map((m) =>
            formatterMonthShort.format(new Date(1970, m, 1))
          ),
          days,
          shortDays,
        },
        navigationIcons: {
          upNavigation: (
            <i className={`${getIconClassName("Up")} text-[11px]`} />
          ),
          downNavigation: (
            <i className={`${getIconClassName("Down")} text-[11px]`} />
          ),
          dismiss: (
            <i className={`${getIconClassName("ChromeClose")} text-[11px]`} />
          ),
        },
      },
      calendarMonthProps: {
        navigationIcons: {
          upNavigation: (
            <i className={`${getIconClassName("Up")} text-[11px]`} />
          ),
          downNavigation: (
            <i className={`${getIconClassName("Down")} text-[11px]`} />
          ),
          dismiss: (
            <i className={`${getIconClassName("ChromeClose")} text-[11px]`} />
          ),
        },
      },
    };
  }, [locale, t]);
}