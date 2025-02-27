import * as React from "react";
import { TimelineItem } from "./TimelineItem";
import { getHref } from "../util";
import { useGlobalGlobalContext } from "../../contexts/global-context";
import { getIconClassName } from "@fluentui/style-utilities";
import ItemDialog from "./dialogs/ItemDialog";

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
  const { clientUrl, activityInfo, itemEditType } = useGlobalGlobalContext();

  if (itemEditType === "modal") {
    return (
      <ItemDialog 
        item={item}
        info={activityInfo[item.type]}
        url={getHref(clientUrl, item.type, item.id)}
        triggerElement={
          <button
            className={`group pointer-events-auto absolute bottom-full z-10 flex origin-center items-center justify-center overflow-hidden rounded-[4px] border border-solid border-gray-300 bg-white px-1 py-[2px] shadow-dynamics hover:cursor-pointer`}
          >
            <span
              className="absolute left-0 -z-10 h-full w-1 transition-all duration-300 group-hover:w-full"
              style={{ backgroundColor: activityInfo[item.type].color }}
            ></span>
            <p className="mx-1 whitespace-nowrap text-xs transition-colors duration-300 group-hover:text-white">
              {item.name}
            </p>
            {activityInfo[item.type]?.icon ? (
              <i className={`${getIconClassName(activityInfo[item.type].icon)} flex h-4 w-4 items-center justify-center text-[12px] transition-colors duration-300 group-hover:text-white`} />
            ) : (
              <></>
            )}
          </button>
        }
      />
    )
  }

  return <></>
}
