import * as React from 'react'
import { fontSize, getLeft, ITEM_PADDING, ySize } from '../timeUtil';
import Icon, { ActivityType, getActivityInformation } from '../icons/Icon';
import { IInputs } from '../../generated/ManifestTypes';
import { DEBUG } from '../Timeline';
import { TimelineItem } from './TimelineItem';
import { useGlobalDialogContext } from '../../contexts/dialog-context';

export interface TimelessTimelineItemBlock {
    id: string;
    name: string;
    date: Date | null;
    type: ActivityType;
}

interface ITimelessTimelineItemProps {
    item: TimelineItem;
    context: ComponentFramework.Context<IInputs>;
}

export default function TimelessTimelineItemBlock({ context, item }: ITimelessTimelineItemProps) {

    const styleInformation = getActivityInformation(item.type);

    const { showDialog, hideDialog } = useGlobalDialogContext();

    const openActivity = (): void => {
        showDialog(<div className='flex flex-col items-center'>
            <p className='font-semibold text-md pb-4'>Loading activity...</p>
            <span className="loader"></span>
        </div>);

        if (DEBUG) {
            setTimeout(() => { hideDialog() }, 3000)
        } else {
            const page = {
                pageType: "entityrecord",
                entityName: item.type,
                entityId: item.id
            };

            const options = {
                target: 2, // dialog
                position: 1, // center
                width: { value: 80, unit: "%" },
                height: { value: 80, unit: "%" },
                title: item.name
            };

            (context.navigation as any).navigateTo(page, options)
            .then((result: any) => hideDialog())
            .catch((error: any) => {
                hideDialog()
                console.error("Navigation error:", error)
            });
        }
    }

    return (
        <button onClick={() => openActivity()} className={`group relative pointer-events-auto hover:cursor-pointer my-1 bg-white flex items-center shadow-dynamics border border-solid border-gray-300 overflow-hidden bottom-full justify-center rounded-[4px] px-1 py-[2px] origin-center`}>
            <span className='absolute left-0 w-1 h-full group-hover:w-full duration-300 transition-all' style={{ backgroundColor: styleInformation.color }}></span>
            <p className='whitespace-nowrap z-10 mx-1 text-xs group-hover:text-white transition-colors duration-300'>{item.name}</p>
            { item.type ? <Icon name={item.type} /> : <></> }
        </button>
    )
}
