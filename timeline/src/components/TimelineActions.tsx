import * as React from "react";
import { useGlobalDialogContext } from "../../contexts/dialog-context";
import FilterDialog from "./FilterDialog";
import { TimelineItem } from "./TimelineItem";
import { FilterState, useFilter } from "../../contexts/filter-context";
import { useGlobalLoaderContext } from "../../contexts/loader-context";
import { getLeft } from "../timeUtil";
import { useGlobalGlobalContext } from "../../contexts/global-context";
import ActionButton from "./controls/ActionButton";
import {
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Filter,
  PanelRightClose,
  PanelRightOpen,
  RefreshCcw,
} from "lucide-react";

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
            tooltip="Refresh data"
            onClick={() => {
              resetFilters();
              setState(true);
            }}
          >
            <RefreshCcw size={48} strokeWidth={2} absoluteStrokeWidth />
          </ActionButton>
          {/* Previous activity */}
          <ActionButton tooltip="Go to previous item" onClick={animatePrevious}>
            <ArrowBigLeftDash size={48} strokeWidth={1.5} absoluteStrokeWidth />
          </ActionButton>
          {/* Next activity */}
          <ActionButton tooltip="Go to next item" onClick={animateNext}>
            <ArrowBigRightDash
              size={48}
              strokeWidth={1.5}
              absoluteStrokeWidth
            />
          </ActionButton>
          <div className="mx-0.5 h-full w-px bg-gray-300" />
          {/* Filter */}
          <ActionButton
            tooltip="Filter items"
            onClick={() =>
              showDialog(
                <FilterDialog items={items} onSave={onSave} />,
                "w-[540px]",
              )
            }
          >
            <Filter size={48} strokeWidth={1.5} absoluteStrokeWidth />
          </ActionButton>
          {/* Timeless items */}
          <ActionButton tooltip="Show timeless items" onClick={paneChange}>
            {isPaneOpen ? (
              <PanelRightOpen size={48} strokeWidth={1.5} absoluteStrokeWidth />
            ) : (
              <PanelRightClose
                size={48}
                strokeWidth={1.5}
                absoluteStrokeWidth
              />
            )}
          </ActionButton>
        </div>
      </div>
    </>
  );
}
