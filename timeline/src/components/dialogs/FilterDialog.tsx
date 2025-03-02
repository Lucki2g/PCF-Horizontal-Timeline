import { Button } from "@fluentui/react-button";
import { Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, DialogTriggerChildProps } from "@fluentui/react-dialog";
import { Divider } from "@fluentui/react-divider";
import { Field } from "@fluentui/react-field";
import { Text, Title3 } from "@fluentui/react-text";
import { Tooltip } from "@fluentui/react-tooltip";

import * as React from "react";
import Search from "../controls/Search";
import { useTranslation } from "react-i18next";
import { FilterState, useFilter } from "../../../contexts/filter-context";
import { IEntityReference, TimelineItem } from "../TimelineItem";
import Chips from "../controls/Chips";
import { CalendarStrings, DatePicker } from "@fluentui/react-datepicker-compat";
import Lookup from "../controls/Lookup";
import { getIconClassName } from "@fluentui/style-utilities";
import { useGlobalGlobalContext } from "../../../contexts/global-context";
import { useCalendarInformation } from "../../../hooks/useCalendarInformation";

interface IFilterDialogProps {
  items: TimelineItem[];
  triggerElement: React.ReactElement<DialogTriggerChildProps>;
  onSave: (filter: FilterState) => void;
}

export const FilterDialog = React.forwardRef(({ items, triggerElement, onSave }: IFilterDialogProps, rootElement: any) => {
  const { t } = useTranslation();
  const { initialState, filter, filterItems } = useFilter();
  const { locale } = useGlobalGlobalContext();

  const [currentFilter, setCurrentFilter] = React.useState<FilterState>(filter);
  const [filteredActivities, setFilteredActivities] = React.useState<number>();

  React.useEffect(() => {
    setFilteredActivities(filterItems(currentFilter, items).length);
  }, [currentFilter]);

  const dateCalendarInformation = useCalendarInformation();

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>{triggerElement}</DialogTrigger>
      <DialogSurface>
        <DialogBody ref={rootElement}>
          {/* HEADER */}
          <DialogTitle role="heading">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col items-start">
                <Title3 role="h2" className="">
                  {t("filter_title")}
                </Title3>
                <Text role="p">
                  {t("filter_count")
                    .replace("{0}", "" + filteredActivities)
                    .replace("{1}", "" + items.length)}
                </Text>
              </div>
              <Tooltip content={t("filter_clear")} relationship="label" withArrow>
                <Button
                  style={{ position: "relative" }}
                  shape="rounded"
                  appearance="subtle"
                  onClick={() => setCurrentFilter(initialState)}
                  icon={
                    <i className={`${getIconClassName("ClearFilter")}`} />
                  }
                />
              </Tooltip>
            </div>
          </DialogTitle>

          {/* BODY */}
          <DialogContent>
            {/* SEARCH */}
            <Divider appearance="strong" />
            <Search
              label={t("filter_search")}
              value={currentFilter.search}
              onChange={(value) =>
                setCurrentFilter({ ...currentFilter, search: value })
              }
            />
            {/* TYPE TOGGLES */}
            <Divider appearance="subtle" />
            <Chips
              label={t("filter_activitytypes")}
              states={currentFilter.itemTypes}
              onChange={(type: string, state: boolean) => {
                setCurrentFilter({
                  ...currentFilter,
                  itemTypes: { ...currentFilter.itemTypes, [type]: state },
                });
              }}
            />
            {/* DATE INTERVAL */}
            <Divider appearance="subtle" />
            <Field
              label={t("filter_startdate")}
              orientation="horizontal"
              className="my-1 w-full"
            >
              <DatePicker
                mountNode={rootElement.current}
                value={currentFilter.startDate}
                appearance="filled-darker"
                highlightSelectedMonth
                showGoToToday
                showCloseButton
                contentAfter={<i className={`${getIconClassName("Calendar")} text-[11px]`} />}
                calendar={dateCalendarInformation}
                formatDate={(date) => date?.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) ?? ""}
                onSelectDate={(date) =>
                  setCurrentFilter({
                    ...currentFilter,
                    startDate:
                      date && date !== null ? date : initialState.startDate,
                  })
                }
                minDate={initialState.startDate}
                maxDate={initialState.endDate}
              />
            </Field>
            <Field
              label={t("filter_enddate")}
              orientation="horizontal"
              className="my-1 w-full"
            >
              <DatePicker
                value={currentFilter.endDate}
                mountNode={rootElement.current}
                appearance="filled-darker"
                highlightSelectedMonth
                showGoToToday
                showCloseButton
                contentAfter={<i className={`${getIconClassName("Calendar")} text-[11px]`} />}
                calendar={dateCalendarInformation}
                formatDate={(date) => date?.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) ?? ""}
                onSelectDate={(date) =>
                  setCurrentFilter({
                    ...currentFilter,
                    endDate:
                      date && date !== null ? date : initialState.endDate,
                  })
                }
                minDate={initialState.startDate}
                maxDate={initialState.endDate}
                // strings={

                // }
                // calendar={
                //   dateTimeFormatter:
                // }
              />
            </Field>
            {/* OWNER */}
            <Divider appearance="subtle" />
            <Lookup
              label={t("filter_owner")}
              handleChange={(newValue: IEntityReference | null) =>
                setCurrentFilter({ ...currentFilter, owner: newValue })
              }
              currentValue={currentFilter.owner}
              options={items
                .filter((i) => i.ownerid && i.ownerid !== null)
                .map((i) => i.ownerid!)}
            />
            {/* BUTTONS */}
            <Divider appearance="strong" />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="primary"
                icon={<i className={`${getIconClassName("Save")} text-[14px]`} />}
                onClick={() => onSave(currentFilter)}
              >
                {t("filter_save")}
              </Button>
            </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button>{t("filter_close")}</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
});
