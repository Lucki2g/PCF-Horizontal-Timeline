import { Button } from "@fluentui/react-button";
import { Toolbar, ToolbarDivider } from "@fluentui/react-toolbar";
import { Tooltip } from "@fluentui/react-tooltip";
import { FilterState, useFilter } from "../../../contexts/filter-context";
import { useGlobalLoaderContext } from "../../../contexts/loader-context";
import { useTranslation } from "react-i18next";
import { getLeft } from "../../timeUtil";
import { useGlobalGlobalContext } from "../../../contexts/global-context";
import { FilterDialog } from "../dialogs/FilterDialog";
import * as React from "react";
import { getIconClassName } from "@fluentui/style-utilities";
import { Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTrigger, Field, FluentProvider, webLightTheme } from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { useCalendarInformation } from "../../../hooks/useCalendarInformation";

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
}

export default function TimelineToolbar({
  animate,
  timelineRef,
  isPaneOpen,
  onSave,
  paneChange,
}: ITimelineToolbar) {
  const { resetFilters, filterItems, filter } = useFilter();
  const { setState } = useGlobalLoaderContext();
  const { xSize, items, locale } = useGlobalGlobalContext();
  const { t } = useTranslation();
  const dateCalendarInformation = useCalendarInformation();

  const [gotoDate, setGotoDate] = React.useState<Date | null>();

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
                        formatDate={(date) => date !== undefined && date ? date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : ""}
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
                </DialogSurface>
              </Dialog>
            </Tooltip>
          </FluentProvider>

          <ToolbarDivider />

          {/* Filter */}
          <Tooltip
            mountNode={timelineRef.current}
            content={t("action_filter")}
            withArrow
            relationship={"label"}
          > 
            <FilterDialog
              mountNode={timelineRef.current}
              onSave={onSave}
              items={items}
              triggerElement={
                <Button
                  appearance="subtle"
                  size="small"
                  icon={
                    <i className={`${getIconClassName("Filter")} text-[12px]`} />
                  }
                />
              }
            />
          </Tooltip>

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
