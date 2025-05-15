import { Button } from "@fluentui/react-button";
import { Toolbar, ToolbarDivider } from "@fluentui/react-toolbar";
import { Tooltip } from "@fluentui/react-tooltip";
import { FilterState, useFilter } from "../../../contexts/filter-context";
import { useGlobalLoaderContext } from "../../../contexts/loader-context";
import { useTranslation } from "react-i18next";
import { getLeft } from "../../timeUtil";
import { useGlobalGlobalContext } from "../../../contexts/global-context";
import * as React from "react";
import { getIconClassName } from "@fluentui/style-utilities";
import { Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider, Field, FluentProvider, Title3, webLightTheme, Text } from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { useCalendarInformation } from "../../../hooks/useCalendarInformation";
import Chips from "../controls/Chips";
import Lookup from "../controls/Lookup";
import Search from "../controls/Search";
import { IEntityReference } from "../TimelineItem";

interface ITimelineToolbar {
  isPaneOpen: boolean;
  onSave: (filter: FilterState) => void;
  paneChange: () => void;
  animate: (
    start: number,
    end: number,
    element: HTMLElement,
    duration: number,
  ) => void;
  timelineRef: React.RefObject<HTMLDivElement>;
  fluentProviderMount: HTMLElement | null;
}

export default function TimelineToolbar({
  animate,
  timelineRef,
  isPaneOpen,
  onSave,
  paneChange,
  fluentProviderMount,
}: ITimelineToolbar) {
  const { resetFilters, filterItems, filter, initialState} = useFilter();
  const { setState } = useGlobalLoaderContext();
  const { xSize, items, locale } = useGlobalGlobalContext();
  const { t } = useTranslation();
  const dateCalendarInformation = useCalendarInformation();

  const [gotoDate, setGotoDate] = React.useState<Date | null>();

  const [currentFilter, setCurrentFilter] = React.useState<FilterState>(filter);
  const [filteredActivities, setFilteredActivities] = React.useState<number>();

  React.useEffect(() => {
    setFilteredActivities(filterItems(currentFilter, items).length);
  }, [currentFilter]);


  const animateNext = () => {
    if (!timelineRef.current) return;
    const centerOfCanvas = Math.round(
      timelineRef.current.scrollLeft + timelineRef.current.clientWidth / 2,
    );
    const activityLocations = filterItems(filter, items)
      .filter((item) => item.scheduledend !== null)
      .map((item) => {
        return {
          item: item,
          left: Math.floor(getLeft(item.scheduledend!, filter.startDate, xSize)),
        };
      });

    const nextActivityLocation = activityLocations
      .sort((a, b) => a.left - b.left)
      .find((item) => item.left > centerOfCanvas);
    if (!nextActivityLocation) return;
    const flooredActivityLocation = Math.floor(
      nextActivityLocation.left - timelineRef.current.clientWidth / 2,
    );
    animate(
      timelineRef.current.scrollLeft,
      flooredActivityLocation,
      timelineRef.current,
      1000,
    );
  };

  const animatePrevious = () => {
    if (!timelineRef.current) return;
    const centerOfCanvas = Math.round(
      timelineRef.current.scrollLeft + timelineRef.current.clientWidth / 2,
    );
    const activityLocations = filterItems(filter, items)
      .filter((item) => item.scheduledend !== null)
      .map((item) => {
        return {
          item: item,
          left: Math.ceil(getLeft(item.scheduledend!, filter.startDate, xSize)),
        };
      });

    const nextActivityLocation = activityLocations
      .sort((a, b) => a.left - b.left)
      .reverse()
      .find((item) => item.left < centerOfCanvas);
    if (!nextActivityLocation) return;
    animate(
      timelineRef.current.scrollLeft,
      nextActivityLocation.left - timelineRef.current.clientWidth / 2,
      timelineRef.current,
      1000,
    );
  };

  const animateGoto = () => {
    if (!gotoDate) return;
    if (!timelineRef.current) return;
    animate(
      timelineRef.current.scrollLeft,
      getLeft(gotoDate, filter.startDate, xSize) - timelineRef.current.clientWidth / 2,
      timelineRef.current,
      1000,
    );
  };

  return (
    <div className={`absolute left-2 top-2 z-20 flex`}>
      <div className="mr-1 flex items-center justify-center rounded-[4px] bg-white shadow-dynamics">
        <Toolbar size="small">
          {/* Refresh timeline */}
          <Tooltip
            mountNode={timelineRef.current}
            content={t("action_refresh")}
            withArrow
            relationship={"label"}
          >
            <Button
              appearance="subtle"
              size="small"
              onClick={() => {
                resetFilters();
                setState(true);
              }}
              icon={
                <i className={`${getIconClassName("Refresh")} text-[12px]`} />
              }
            />
          </Tooltip>

          <ToolbarDivider />

          {/* Previous */}
          <Tooltip
            mountNode={timelineRef.current}
            content={t("action_previous")}
            withArrow
            relationship={"label"}
          >
            <Button
              appearance="subtle"
              size="small"
              onClick={animatePrevious}
              icon={
                <i className={`${getIconClassName("Previous")} text-[12px]`} />
              }
            />
          </Tooltip>
          {/* Next */}
          <Tooltip 
            mountNode={timelineRef.current}
            content={t("action_next")} 
            withArrow 
            relationship={"label"}>
            <Button
              appearance="subtle"
              size="small"
              onClick={animateNext}
              icon={
                <i className={`${getIconClassName("Next")} text-[12px]`} />
              }
            />
          </Tooltip>
          {/* Goto */}
          <FluentProvider theme={webLightTheme}>
            <Tooltip 
            mountNode={timelineRef.current} 
            content={t("action_goto")} 
            withArrow 
            relationship={"label"}>
              <Dialog>
                <DialogTrigger disableButtonEnhancement>
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={
                      <i className={`${getIconClassName("GotoToday")} text-[12px]`} />
                    }
                  />
                </DialogTrigger>
                <DialogSurface>
                  <DialogBody>
                    <DialogContent>
                    <Field label={t("goto_label")} orientation="horizontal">
                      <DatePicker
                        className="my-2"
                        appearance="filled-darker"
                        highlightSelectedMonth
                        showGoToToday
                        showCloseButton
                        value={gotoDate}
                        contentAfter={<i className={`${getIconClassName("Calendar")} text-[11px]`} />}
                        calendar={dateCalendarInformation}
                        formatDate={(date) => date instanceof Date && date ? date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : ""}
                        onSelectDate={(date) => setGotoDate(date ?? null)}
                        minDate={filter.startDate}
                        maxDate={filter.endDate}
                      />
                    </Field>
                  </DialogContent>
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <Button appearance='primary' onClick={animateGoto}>
                          {t("goto_goto")}
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger disableButtonEnhancement>
                      <Button>
                          {t("filter_close")}
                      </Button>
                    </DialogTrigger>
                  </DialogActions>
                  </DialogBody>
                  
                </DialogSurface>
              </Dialog>
            </Tooltip>
          </FluentProvider>

          <ToolbarDivider />

          {/* Filter */}
          <FluentProvider theme={webLightTheme}>
            <Tooltip
              mountNode={timelineRef.current}
              content={t("action_filter")}
              withArrow
              relationship={"label"}
            > 
              <Dialog>
                <DialogTrigger disableButtonEnhancement>
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={
                      <i className={`${getIconClassName("Filter")} text-[12px]`} />
                    }
                  />
                </DialogTrigger>
                <DialogSurface>
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
                              .replace("{1}", "" + items.filter(i => i.scheduledend !== null).length)}
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
                          value={currentFilter.startDate}
                          appearance="filled-darker"
                          highlightSelectedMonth
                          showGoToToday
                          showCloseButton
                          contentAfter={<i className={`${getIconClassName("Calendar")} text-[11px]`} />}
                          calendar={dateCalendarInformation}
                          formatDate={(date) => date instanceof Date && date ? date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : ""}
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
                          appearance="filled-darker"
                          highlightSelectedMonth
                          showGoToToday
                          showCloseButton
                          contentAfter={<i className={`${getIconClassName("Calendar")} text-[11px]`} />}
                          calendar={dateCalendarInformation}
                          formatDate={(date) => date instanceof Date && date ? date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : ""}
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
                </DialogSurface>
              </Dialog>
            </Tooltip>
          </FluentProvider>

          <ToolbarDivider />

          {/* Next */}
          <Tooltip
            mountNode={timelineRef.current}
            content={t("action_timeless")}
            withArrow
            relationship={"label"}
          >
            <Button
              appearance="subtle"
              size="small"
              onClick={paneChange}
              icon={
                <i className={`${getIconClassName(isPaneOpen ? "OpenPane" : "ClosePane")} text-[12px]`}/>
              }
            />
          </Tooltip>
        </Toolbar>
      </div>
    </div>
  );
}
