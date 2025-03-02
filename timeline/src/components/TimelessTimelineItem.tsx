import * as React from "react";
import { TimelineItem } from "./TimelineItem";
import { getHref } from "../util";
import { useGlobalGlobalContext } from "../../contexts/global-context";
import { getIconClassName } from "@fluentui/style-utilities";
import ItemDialog from "./dialogs/ItemDialog";
import { FluentProvider, webLightTheme, Button } from "@fluentui/react-components";
import { ItemDropdown } from "./dialogs/ItemDropdown";

interface ITimelessTimelineItemProps {
  item: TimelineItem;
}

export default function TimelessTimelineItemBlock({
  item,
}: ITimelessTimelineItemProps) {
  const { clientUrl, activityInfo, itemEditType } = useGlobalGlobalContext();

  return (
    <FluentProvider theme={webLightTheme} className="w-full">
      { 
          itemEditType === "modal" ? (
              <ItemDialog item={item}>
                  <Button
                  size="small"
                  className={`w-full group pointer-events-auto relative bottom-full flex origin-center items-center justify-center overflow-hidden rounded-[4px] border border-solid border-gray-300 bg-white px-1 py-[2px] shadow-dynamics hover:cursor-pointer`}>
                      <span
                          className="absolute left-0 z-10 h-full w-1 transition-all duration-300 group-hover:w-full"
                          style={{ backgroundColor: activityInfo[item.activitytypecode].color }}
                      ></span>
                      <p className="mx-1 whitespace-nowrap z-20 text-xs transition-colors duration-300 group-hover:text-white">
                          {item.subject}
                      </p>
                      {activityInfo[item.activitytypecode]?.icon ? (
                          <i className={`${getIconClassName(activityInfo[item.activitytypecode].icon)} z-20 flex h-4 w-4 items-center justify-center text-[12px] transition-colors duration-300 group-hover:text-white`} />
                      ) : (
                          <></>
                      )}
                  </Button>
              </ItemDialog>
          ) : itemEditType === "dropdown" ? (
              <ItemDropdown item={item}>
                  <Button
                      size="small"
                      className={`w-full group pointer-events-auto relative bottom-full flex origin-center items-center justify-center overflow-hidden rounded-[4px] border border-solid border-gray-300 bg-white px-1 py-[2px] shadow-dynamics hover:cursor-pointer`}>
                      <span
                          className="absolute left-0 z-10 h-full w-1 transition-all duration-300 group-hover:w-full"
                          style={{ backgroundColor: activityInfo[item.activitytypecode].color }}
                      ></span>
                      <p className="mx-1 whitespace-nowrap z-20 text-xs transition-colors duration-300 group-hover:text-white">
                          {item.subject}
                      </p>
                      {activityInfo[item.activitytypecode]?.icon ? (
                          <i className={`${getIconClassName(activityInfo[item.activitytypecode].icon)} z-20 flex h-4 w-4 items-center justify-center text-[12px] transition-colors duration-300 group-hover:text-white`} />
                      ) : (
                          <></>
                      )}
                  </Button>
              </ItemDropdown>
          ) : <></>
          }
      </FluentProvider>
  )
}
