import * as React from "react";
import { useGlobalDialogContext } from "../../contexts/dialog-context";
import { TimelineItem } from "./TimelineItem";
import { FilterState, useFilter } from "../../contexts/filter-context";
import { useGlobalLoaderContext } from "../../contexts/loader-context";
import { getLeft } from "../timeUtil";
import { useGlobalGlobalContext } from "../../contexts/global-context";
import ActionButton from "./controls/ActionButton";
import { useTranslation } from "react-i18next";
import { FilterDialog } from "./dialogs/FilterDialog";

interface ITimelineActionsProps {
  items: TimelineItem[];
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

export default function TimelineActions({
  animate,
  timelineRef,
  items,
  isPaneOpen,
  onSave,
  paneChange,
}: ITimelineActionsProps) {
  const { resetFilters, filterItems, filter } = useFilter();
  const { showDialog } = useGlobalDialogContext();
  const { setState } = useGlobalLoaderContext();
  const { xSize } = useGlobalGlobalContext();
  const { t } = useTranslation();

  const animateNext = () => {
    if (!timelineRef.current) return;
    const centerOfCanvas = Math.round(
      timelineRef.current.scrollLeft + timelineRef.current.clientWidth / 2,
    );
    const activityLocations = filterItems(filter, items)
      .filter((item) => item.date !== null)
      .map((item) => {
        return {
          item: item,
          left: Math.floor(getLeft(item.date!, filter.startDate, xSize)),
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
      .filter((item) => item.date !== null)
      .map((item) => {
        return {
          item: item,
          left: Math.ceil(getLeft(item.date!, filter.startDate, xSize)),
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

  return (
    <>
      <div className={`absolute left-2 top-2 z-20 flex`}>
        <div className="mr-1 flex items-center justify-center rounded-[4px] bg-white shadow-dynamics">
          {/* Refresh timeline */}
          <ActionButton
            tooltip={t("action_refresh")}
            onClick={() => {
              resetFilters();
              setState(true);
            }}
          >
            <span className="material-symbols-rounded">refresh</span>
          </ActionButton>
          {/* Previous activity */}
          <ActionButton tooltip={t("action_previous")} onClick={animatePrevious}>
          <span className="material-symbols-rounded">first_page</span>
          </ActionButton>
          {/* Next activity */}
          <ActionButton tooltip={t("action_next")} onClick={animateNext}>
          <span className="material-symbols-rounded">last_page</span>
          </ActionButton>
          <div className="mx-0.5 h-full w-px bg-gray-300" />
          {/* Filter */}
          <FilterDialog onSave={onSave} items={items} childElement={
            <ActionButton
              tooltip={t("action_filter")}
              onClick={() => {}}>
                <p>a</p>
              </ActionButton>}
            />
          {/* Timeless items */}
          <ActionButton tooltip={t("action_timeless")} onClick={paneChange}>
            {isPaneOpen ? (
              <span className="material-symbols-rounded">right_panel_open</span>
            ) : (
              <span className="material-symbols-rounded">right_panel_close</span>
            )}
          </ActionButton>
        </div>
      </div>
    </>
  );
}
