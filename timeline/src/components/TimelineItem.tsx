import * as React from "react";
import { getLeft, ITEM_PADDING, TimeUnit, ySize } from "../timeUtil";
import { useSettings } from "../../hooks/SettingsState";
import { useFilter } from "../../contexts/filter-context";
import { getHref } from "../util";
import { useGlobalGlobalContext } from "../../contexts/global-context";
import { Popover, PopoverTrigger, Button, PopoverSurface, Field, Input, Badge, FluentProvider, webLightTheme, Tag, Avatar } from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { t } from "i18next";
import { getIconClassName } from "@fluentui/style-utilities";
import { ItemDropdown } from "./dialogs/ItemDropdown";
import ItemDialog from "./dialogs/ItemDialog";

export interface IEntityReference {
    id: string;
    name: string;
    entitytype: string;
  }
  
  export interface TimelineItem {
    id: string;
    subject: string;
    scheduledend: Date | null;
    activitytypecode: string;
    prioritycode: number;
    statecode: number;
    // non-milestone data
    ownerid?: IEntityReference;
    createdon?: Date | null;
  }

interface ITimelineItemProps {
  item: TimelineItem;
  rowIdx: number;
  rowCount: number;
  parentRef: React.RefObject<HTMLDivElement>;
}

export default function TimelineItemBlock({
  parentRef,
  item,
  rowIdx,
  rowCount,
}: ITimelineItemProps) {
  // canvas app bug mitigation
  if (!item?.activitytypecode) return <></>;

  const { filter } = useFilter();

  const itemRef = React.useRef<HTMLButtonElement>(null);

  const { activityInfo, clientUrl, xSize, itemEditType } = useGlobalGlobalContext();
  const [leftAlignment, setLeftAlignment] = React.useState(0);

  React.useEffect(() => {
    setLeftAlignment(() => {
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
        return middle - diff;
        }

        // is item overflowing on the right of the parent?
        if (itemRightSide > parentBox.right) {
        const diff = itemRightSide - parentBox.right;
        return middle + diff;
        }

        // error
        return 0;
    })
  }, [itemRef, parentRef, filter.startDate, filter.endDate])

  return (
    <div className="absolute" style={{
        left: item.scheduledend ? getLeft(item.scheduledend, filter.startDate, xSize) : 0,
        top: ITEM_PADDING + 10,
    }}>
        {
            item.activitytypecode === "milestone" 
            ? (
                <>
                    <span className="border-solid border-gray-500 border-l h-full absolute" style={{
                        height: ITEM_PADDING + 2 + (rowCount - rowIdx) * ySize,
                    }} />
                    <span className="border-solid border-gray-500 border-l h-full absolute" style={{
                        bottom: ySize + 2,
                        height: ITEM_PADDING + 2 + (rowIdx + 1) * ySize,
                    }} />
                    <Tag ref={itemRef}
                        appearance="brand"
                        size="small"
                        shape="circular"
                        media={<Avatar color="brand" icon={<i className={`${getIconClassName("Flag")} text-[11px]`} />} />}
                        className="absolute bottom-full z-10 origin-center shadow-dynamics"
                        style={{ left: -leftAlignment }}>
                        {item.subject}
                    </Tag>
                </>
            ) : (
                <>
                <span className="border-dotted border-gray-500 border-l h-full absolute" style={{
                    height: ITEM_PADDING + 2 + (rowCount - rowIdx) * ySize,
                }} />
                <FluentProvider theme={webLightTheme}>
                    { 
                        itemEditType === "modal" ? (
                            <ItemDialog item={item}>
                                <Button
                                ref={itemRef}
                                size="small"
                                className={`group pointer-events-auto absolute bottom-full z-10 flex origin-center items-center justify-center overflow-hidden rounded-[4px] border border-solid border-gray-300 bg-white px-1 py-[2px] shadow-dynamics hover:cursor-pointer`}
                                style={{ left: -leftAlignment }}>
                                    <span
                                        className="absolute left-0 -z-10 h-full w-1 transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: activityInfo[item.activitytypecode].color }}
                                    ></span>
                                    <p className="mx-1 whitespace-nowrap text-xs transition-colors duration-300 group-hover:text-white">
                                        {item.subject}
                                    </p>
                                    {activityInfo[item.activitytypecode]?.icon ? (
                                        <i className={`${getIconClassName(activityInfo[item.activitytypecode].icon)} flex h-4 w-4 items-center justify-center text-[12px] transition-colors duration-300 group-hover:text-white`} />
                                    ) : (
                                        <></>
                                    )}
                                </Button>
                            </ItemDialog>
                        ) : itemEditType === "dropdown" ? (
                            <ItemDropdown item={item}>
                                <Button
                                    ref={itemRef}
                                    size="small"
                                    className={`group pointer-events-auto absolute bottom-full z-10 flex origin-center items-center justify-center overflow-hidden rounded-[4px] border border-solid border-gray-300 bg-white px-1 py-[2px] shadow-dynamics hover:cursor-pointer`}
                                    style={{ left: -leftAlignment }}>
                                    <span
                                        className="absolute left-0 -z-10 h-full w-1 transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: activityInfo[item.activitytypecode].color }}
                                    ></span>
                                    <p className="mx-1 whitespace-nowrap text-xs transition-colors duration-300 group-hover:text-white">
                                        {item.subject}
                                    </p>
                                    {activityInfo[item.activitytypecode]?.icon ? (
                                        <i className={`${getIconClassName(activityInfo[item.activitytypecode].icon)} flex h-4 w-4 items-center justify-center text-[12px] transition-colors duration-300 group-hover:text-white`} />
                                    ) : (
                                        <></>
                                    )}
                                </Button>
                            </ItemDropdown>
                        ) : <></>
                        }
                    </FluentProvider>
                </>
            )
        }
    </div>
  );
}