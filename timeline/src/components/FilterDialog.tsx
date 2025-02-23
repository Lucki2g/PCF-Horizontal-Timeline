import * as React from "react";
import { useGlobalDialogContext } from "../../contexts/dialog-context";
import { useTranslation } from "react-i18next";
import { IEntityReference, TimelineItem } from "./TimelineItem";
import { FilterState, useFilter } from "../../contexts/filter-context";
import { DatePicker } from "@mantine/dates";
import { DatePicker as FluentDatePicker } from "@fluentui/react-datepicker-compat";
import Lookup from "./controls/Lookup";
import Search from "./controls/Search";
import Chips from "./controls/Chips";
import { useGlobalGlobalContext } from "../../contexts/global-context";
import { Calendar } from "@fluentui/react-calendar-compat";
import { Button, Field, Input, Label, makeStyles, Switch, Toolbar, ToolbarButton } from "@fluentui/react-components";
import { Calendar24Regular, DismissSquareRegular } from '@fluentui/react-icons';
import { MILIS_IN_DAY } from "../timeUtil";
import { FontIcon } from "@fluentui/react/lib/Icon";

interface IFilterDialogProps {
  items: TimelineItem[];
  onSave: (filter: FilterState) => void;
}

export default function FilterDialog({ items, onSave }: IFilterDialogProps) {
  const { hideDialog } = useGlobalDialogContext();
  const { initialState, filter, filterItems } = useFilter();
  const { t } = useTranslation();
  const { locale, activityInfo, useFluent } = useGlobalGlobalContext();

  const rootElement = React.useRef(null);

  const [currentFilter, setCurrentFilter] = React.useState<FilterState>(filter);
  const [filteredActivities, setFilteredActivities] = React.useState<number>();

  React.useEffect(() => {
    setFilteredActivities(filterItems(currentFilter, items).length);
  }, [currentFilter]);

  return (
    <div ref={rootElement} className="m-2 flex w-full flex-col items-start justify-start">
      {/* HEADER */}
      <div className="mb-8 flex w-full items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-semibold">{t("filter_title")}</h1>
          <p className="text-sm">
            {t("filter_count")
              .replace("{0}", "" + filteredActivities)
              .replace("{1}", "" + items.length)}
          </p>
        </div>
        <button
          className="mr-2 rounded-full bg-sky-50 transition-colors duration-300 hover:bg-sky-200 aspect-square flex justify-center items-center w-12 h-12"
          onClick={() => setCurrentFilter(initialState)}
        >
          <span className="material-symbols-rounded p-0 m-0 w-6 h-6" style={{ fontSize: "24px" }}>filter_list_off</span>
        </button>
      </div>

      <div className="my-1 h-px w-full bg-gray-800 bg-opacity-10" />

      {/* SEARCH */}
      <Search
        label={t("filter_search")}
        value={currentFilter.search}
        onChange={(value) =>
          setCurrentFilter({ ...currentFilter, search: value })
        }
      />

      <div className="my-1 h-px w-full bg-gray-800 bg-opacity-10" />

      {/* TYPE TOGGLES */}
      <Chips
        label={t("filter_activitytypes")}
        states={currentFilter.itemTypes}
        onChange={(type: string, state: boolean) => {
          console.log(type, "changed to", state)
          setCurrentFilter({
            ...currentFilter,
            itemTypes: { ...currentFilter.itemTypes, [type]: state },
          })
        }
      }
      />

      <div className="my-1 h-px w-full bg-gray-800 bg-opacity-10" />

      {/* DATE INTERVAL */}
      {/* https://mantine.dev/dates/date-picker/ */}
      {
        useFluent ?
        <>
          <Field label={t("filter_startdate")} orientation="horizontal" className="w-full my-1">
            <FluentDatePicker 
              mountNode={rootElement.current}
              value={currentFilter.startDate} 
              appearance="filled-darker"
              highlightSelectedMonth 
              showGoToToday 
              showCloseButton
              onSelectDate={(date) => setCurrentFilter({...currentFilter, startDate: (date && date !== null) ? date : initialState.startDate})}
              minDate={initialState.startDate}
              maxDate={initialState.endDate}
              // calendar={
              //   highlightSelectedMonth: true
              //   dateTimeFormatter: 
              // }
              // strings={

              // }
            />
          </Field>
          <Field label={t("filter_enddate")}orientation="horizontal" className="w-full my-1">
            <FluentDatePicker value={currentFilter.endDate} 
              mountNode={rootElement.current}
              appearance="filled-darker"
              highlightSelectedMonth 
              showGoToToday 
              showCloseButton
              onSelectDate={(date) => setCurrentFilter({...currentFilter, endDate: (date && date !== null) ? date : initialState.endDate})}
              minDate={initialState.startDate}
              maxDate={initialState.endDate}
              // strings={

              // }
              // calendar={
              //   dateTimeFormatter: 
              // }
            />
          </Field>
        </> :
        <div className="relative my-2 w-full flex-col rounded-[4px] bg-neutral-100 p-2 pt-5">
        <p className="absolute left-2 top-0.5 text-start text-xs font-semibold tracking-wide text-gray-500">
          {t("filter_dates")}
        </p>
        <div className="flex flex-wrap items-center justify-center">
          <div className="mx-1 flex flex-col">
            <div className="my-1 flex w-full">
              <p className="pr-1 text-start text-xs tracking-wide text-gray-500">
                {t("filter_startdate")}:
              </p>
              <p className="text-xs font-semibold">
                {currentFilter.startDate.toLocaleString(locale, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            </div>
            <DatePicker
              className="rounded-[4px] bg-white p-2"
              locale={locale}
              minDate={initialState.startDate}
              maxDate={initialState.endDate}
              size="xs"
              defaultLevel="decade"
              onChange={(val) =>
                setCurrentFilter({
                  ...currentFilter,
                  startDate: val ?? initialState.startDate,
                })
              }
              value={currentFilter.startDate}
            />
          </div>

          <div className="mx-1 flex flex-col">
            <div className="my-1 flex w-full">
              <p className="pr-1 text-start text-xs tracking-wide text-gray-500">
                {t("filter_enddate")}:
              </p>
              <p className="text-xs font-semibold">
                {currentFilter.endDate.toLocaleString(locale, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            </div>
            <DatePicker
              className="rounded-[4px] bg-white p-2"
              locale={locale}
              minDate={initialState.startDate}
              maxDate={initialState.endDate}
              size="xs"
              defaultLevel="decade"
              onChange={(val) =>
                setCurrentFilter({
                  ...currentFilter,
                  endDate: val ?? initialState.endDate,
                })
              }
              value={currentFilter.endDate}
            />
          </div>
        </div>
      </div>
      }
      

      <div className="my-1 h-px w-full bg-gray-800 bg-opacity-10" />

      {/* OWNER */}
      <Lookup
        label={t("filter_owner")}
        handleChange={(newValue: IEntityReference | null) =>
          setCurrentFilter({ ...currentFilter, owner: newValue })
        }
        currentValue={currentFilter.owner}
        options={items
          .filter((i) => i.owned && i.owned !== null)
          .map((i) => i.owned!)}
      />

      <div className="my-1 h-px w-full bg-gray-800 bg-opacity-10" />

      {/* BUTTONS */}
      <div className="mt-8 flex w-full justify-center text-sm">
        {/* SAVE */}
        <button
          onClick={() => {
            hideDialog();
            onSave(currentFilter);
          }}
          className="group mx-1 flex items-center rounded-[4px] bg-sky-200 px-4 py-2 font-semibold text-sky-600 transition-colors duration-200 hover:bg-sky-300 hover:text-white"
        >
          <span className="material-symbols-rounded w-4 h-4" style={{ fontSize: "16px" }}>save</span>
          {t("filter_save")}
        </button>

        {/* CLOSE */}
        <button
          onClick={() => {
            hideDialog();
          }}
          className="mx-1 flex items-center rounded-[4px] bg-gray-200 px-4 py-2 font-semibold text-gray-600 transition-colors duration-200 hover:bg-gray-300 hover:text-white"
        >
          {t("filter_close")}
        </button>
      </div>
    </div>
  );
}
