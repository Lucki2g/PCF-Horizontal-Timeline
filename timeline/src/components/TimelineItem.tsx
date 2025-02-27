import * as React from "react";
import { getLeft, ITEM_PADDING, TimeUnit, ySize } from "../timeUtil";
import { useSettings } from "../../hooks/SettingsState";
import { useFilter } from "../../contexts/filter-context";
import { getHref } from "../util";
import { useGlobalGlobalContext } from "../../contexts/global-context";
import { getIcon, getIconClassName } from "@fluentui/style-utilities";
import ItemDialog from "./dialogs/ItemDialog";
import { Avatar, Button, Dialog, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components";

export interface IEntityReference {
  id: string;
  name: string;
  entitytype: string;
}

export interface TimelineItem {
  id: string;
  name: string;
  date: Date | null;
  type: string;
  owned?: IEntityReference;
}

interface ITimelineItemProps {
  item: TimelineItem;
  rowIdx: number;
  rowCount: number;
  timeunits: TimeUnit[];
  parentRef: React.RefObject<HTMLDivElement>;
}

export default function TimelineItemBlock({
  parentRef,
  item,
  rowIdx,
  rowCount,
  timeunits,
}: ITimelineItemProps) {
  // canvas app bug mitigation
  if (!item?.type) return <></>;

  const { settings } = useSettings();
  const { filter } = useFilter();

  const itemRef = React.useRef<any>(null);
  const [leftAlignment, setLeftAlignment] = React.useState(0);

  const { activityInfo, clientUrl, xSize, itemEditType } = useGlobalGlobalContext();

  console.log(itemEditType, itemEditType === "modal")

  const getLeftAlignment = () => {
    if (!itemRef.current || !parentRef.current) return 0;

    const itemBox = itemRef.current.getBoundingClientRect();
    const parentBox = parentRef.current.getBoundingClientRect();

    const itemLeftSide = itemBox.left - itemBox.width / 2;
    const itemRightSide = itemBox.right - itemBox.width / 2;
    const middle = itemBox.width / 2;

    // is item within parent if centered?
    if (itemLeftSide > parentBox.left && itemRightSide < parentBox.right) {
      return middle;
    }

    // is item overflowing on the left of the parent?
    if (itemLeftSide < parentBox.left) {
      const diff = parentBox.left - itemLeftSide;
      return middle - diff + leftAlignment;
    }

    // is item overflowing on the right of the parent?
    if (itemRightSide > parentBox.right) {
      const diff = itemRightSide - parentBox.right;
      return middle + diff - leftAlignment;
    }

    // error
    return 0;
  };

  React.useEffect(() => {
    const alignment = getLeftAlignment();
    setLeftAlignment(alignment);
  }, [itemRef, parentRef, filter.startDate, filter.endDate]);

  return (
    <div
      className="absolute flex border-l border-dotted border-gray-500"
      style={{
        left: item.date ? getLeft(item.date, filter.startDate, xSize) : 0,
        height: ITEM_PADDING + 2 + (rowCount - rowIdx) * ySize,
        top: ITEM_PADDING + 10,
      }}
    >
      <span
        className="absolute bottom-[-2px] h-[5px] w-[5px] rounded-full border border-solid border-dynamics-text"
        style={{ left: -3, backgroundColor: activityInfo[item.type].color }}
      ></span>
      {settings.showlines ? (
        <span
          className="absolute -left-px border-l border-dotted"
          style={{
            borderColor: activityInfo[item.type].color,
            height: ySize * timeunits.length,
            top: ITEM_PADDING + 2 + (rowCount - rowIdx) * ySize,
          }}
        ></span>
      ) : (
        <></>
      )}
      {item.type === "milestone" ? (
        <div
          ref={itemRef}
          className={`group pointer-events-none absolute bottom-full z-10 flex origin-center items-center justify-center bg-slate-800 px-1 py-[2px] text-white shadow-dynamics`}
          style={{ left: -leftAlignment }}
        >
          <span className="absolute -right-1 -top-1 flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: activityInfo[item.type].color }}
            ></span>
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: activityInfo[item.type].color }}
            ></span>
          </span>
          <p className="mx-1 whitespace-nowrap text-xs">{item.name}</p>
        </div>
      ) : itemEditType === "modal" ? (
        <>
        <ItemDialog 
          item={item}
          info={activityInfo[item.type]}
          url={getHref(clientUrl, item.type, item.id)}
          triggerElement={
            <button
              ref={itemRef}
              className={`group pointer-events-auto absolute bottom-full z-10 flex origin-center items-center justify-center overflow-hidden rounded-[4px] border border-solid border-gray-300 bg-white px-1 py-[2px] shadow-dynamics hover:cursor-pointer`}
              style={{ left: -leftAlignment }}
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
        </>
      ) : <></>}
    </div>
  );
}
