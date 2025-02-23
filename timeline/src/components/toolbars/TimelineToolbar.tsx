import { Button, Toolbar, ToolbarDivider, Tooltip } from '@fluentui/react-components'
import React from 'react'
import { FilterState, useFilter } from '../../../contexts/filter-context';
import { useGlobalLoaderContext } from '../../../contexts/loader-context';
import { useTranslation } from 'react-i18next';
import { TimelineItem } from '../TimelineItem';
import { getLeft } from '../../timeUtil';
import { useGlobalGlobalContext } from '../../../contexts/global-context';
import { FilterDialog } from '../dialogs/FilterDialog';
import { getIconClassName } from '@fluentui/style-utilities';

interface ITimelineToolbar {
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

export default function TimelineToolbar({
    animate,
    timelineRef,
    items,
    isPaneOpen,
    onSave,
    paneChange,
}: ITimelineToolbar) {
    const { resetFilters, filterItems, filter } = useFilter();
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
        <div className={`absolute left-2 top-2 z-20 flex`}>
            <div className="mr-1 flex items-center justify-center rounded-[4px] bg-white shadow-dynamics">
                <Toolbar size='small'>
                    {/* Refresh timeline */}
                    <Tooltip content={t("action_refresh")} withArrow relationship={'label'}>
                        <Button
                            appearance='subtle'
                            size='small' 
                            onClick={() => {
                                resetFilters();
                                setState(true);
                            }} 
                            icon={<i className={`${getIconClassName("Refresh")} text-[12px]`} />}
                        />
                    </Tooltip>
                    
                    <ToolbarDivider />

                    {/* Previous */}
                    <Tooltip content={t("action_previous")} withArrow relationship={'label'}>
                        <Button
                            appearance='subtle'
                            size='small' 
                            onClick={animatePrevious} 
                            icon={<i className={`${getIconClassName("Previous")} text-[12px]`} />}
                        />
                    </Tooltip>
                    {/* Next */}
                    <Tooltip content={t("action_next")} withArrow relationship={'label'}>
                        <Button
                            appearance='subtle'
                            size='small' 
                            onClick={animateNext} 
                            icon={<i className={`${getIconClassName("Next")} text-[12px]`} />}
                        />
                    </Tooltip>
                    
                    <ToolbarDivider />

                    {/* Filter */}
                    <Tooltip content={t("action_filter")} withArrow relationship={'label'}>
                        <FilterDialog onSave={onSave} items={items} childElement={
                            <Button
                                appearance='subtle'
                            size='small' icon={<i className={`${getIconClassName("Filter")} text-[12px]`} />}/>
                        }/>
                    </Tooltip>
                    
                    <ToolbarDivider />

                    {/* Next */}
                    <Tooltip content={t("action_timeless")} withArrow relationship={'label'}>
                        <Button
                            appearance='subtle'
                            size='small' 
                            onClick={paneChange} 
                            icon={<i className={`${getIconClassName(isPaneOpen ? "OpenPane" : "ClosePane")} text-[12px]`} />}
                        />
                    </Tooltip>
                </Toolbar>
            </div>
        </div>
    )
}