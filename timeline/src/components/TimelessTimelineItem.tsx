import * as React from "react";
import { TimelineItem } from "./TimelineItem";
import { useGlobalDialogContext } from "../../contexts/dialog-context";
import { getHref } from "../util";
import { useGlobalGlobalContext } from "../../contexts/global-context";

export interface TimelessTimelineItemBlock {
  id: string;
  name: string;
  date: Date | null;
  type: string;
}

interface ITimelessTimelineItemProps {
  item: TimelineItem;
}

export default function TimelessTimelineItemBlock({
  item,
}: ITimelessTimelineItemProps) {
  const { showDialog, hideDialog } = useGlobalDialogContext();
  const { clientUrl, activityInfo } = useGlobalGlobalContext();

  const openActivity = (): void => {
    const url = getHref(clientUrl, item.type, item.id);

    showDialog(
      <div className="flex flex-col">
        <div className="m-1 flex justify-between rounded-[4px] p-2 shadow-dynamics">
          <div className="flex"></div>
          <div className="flex">
            <button
              onClick={hideDialog}
              className="rounded-md bg-white p-1 transition-colors duration-150 hover:bg-slate-100"
            >
            <span className="material-symbols-rounded w-4 h-4" style={{ fontSize: "16px" }}>close</span>
            </button>
          </div>
        </div>
        <iframe src={url} className="min-h-[540px] w-full flex-grow" />
      </div>,
      "w-11/12",
    );
  };

  return (
    <button
      onClick={openActivity}
      className={`group pointer-events-auto relative bottom-full my-1 flex origin-center items-center justify-center overflow-hidden rounded-[4px] border border-solid border-gray-300 bg-white px-1 py-[2px] shadow-dynamics hover:cursor-pointer`}
    >
      <span
        className="absolute left-0 h-full w-1 transition-all duration-300 group-hover:w-full"
        style={{ backgroundColor: activityInfo[item.type].color }}
      ></span>
      <p className="z-10 mx-1 whitespace-nowrap text-xs transition-colors duration-300 group-hover:text-white">
        {item.name}
      </p>
      {activityInfo[item.type]?.icon ? (
        <span className="material-symbols-rounded transition-colors duration-300 group-hover:text-white w-4 h-4" style={{ fontSize: "16px" }}>{activityInfo[item.type].icon}</span>
      ) : (
        <></>
      )}
    </button>
  );
}
