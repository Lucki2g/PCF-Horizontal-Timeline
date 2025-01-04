import * as React from 'react'
import { fontSize, getLeft, ITEM_PADDING, TimeUnit, ySize } from '../timeUtil';
import Icon, { ActivityType, getActivityInformation } from '../icons/Icon';
import { IInputs } from '../../generated/ManifestTypes';
import { DEBUG } from '../Timeline';
import { useGlobalDialogContext } from '../../contexts/dialog-context';
import { useSettings } from '../../hooks/SettingsState';
import { useFilter } from '../../contexts/filter-context';

export interface TimelineItem {
    id: string;
    name: string;
    date: Date | null;
    type: ActivityType;
    show: boolean;
}

interface ITimelineItemProps {
    item: TimelineItem;
    rowIdx: number;
    rowCount: number;
    mouseDown: boolean;
    timeunits: TimeUnit[],
    context: ComponentFramework.Context<IInputs>;
    parentRef: React.RefObject<HTMLDivElement>
}

export default function TimelineItemBlock({ parentRef, context, item, rowIdx, rowCount, mouseDown, timeunits }: ITimelineItemProps) {

    // canvas app bug mitigation
    if (!item?.type) return <></>;

    const { settings } = useSettings();
    const { filter } = useFilter();

    const itemRef = React.useRef<any>(null);
    const [leftAlignment, setLeftAlignment] = React.useState(0);
    
    const styleInformation = getActivityInformation(item.type);

    const { showDialog, hideDialog } = useGlobalDialogContext();

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
    }

    const openActivity = (): void => {
        showDialog(<div className='flex flex-col items-center justify-center'>
            <p className='font-semibold text-md pb-4'>Loading activity...</p>
            <span className="loader"></span>
        </div>);

        if (DEBUG) {
            setTimeout(() => { hideDialog() }, 3000)
        } else {
            // TODO - canvas app compatible
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

    React.useEffect(() => {
        const alignment = getLeftAlignment();
        setLeftAlignment(alignment);
    }, [itemRef, parentRef, filter.startDate, filter.endDate]);

    return (
        <div className='absolute flex border-l border-dotted border-gray-500' style={{ left: item.date ? getLeft(item.date, filter.startDate, context.parameters.xsize.raw ?? 32) : 0, height: ITEM_PADDING + 2 + ((rowCount - rowIdx) * ySize), top: ITEM_PADDING + 10 }}>
            <span className='absolute w-[5px] h-[5px] rounded-full border border-solid border-dynamics-text bottom-[-2px]' style={{ left: -3, backgroundColor: styleInformation.color }}></span>
            {settings.showlines ? <span className='absolute border-l border-dotted -left-px' style={{ borderColor: styleInformation.color, height: ySize * timeunits.length, top: ITEM_PADDING + 2 + ((rowCount - rowIdx) * ySize) }}></span> : <></> }
            {
                item.type === "milestone" 
                ? 
                <div ref={itemRef} className={`group pointer-events-none absolute z-10 bg-slate-800 text-white flex items-center shadow-dynamics bottom-full justify-center px-1 py-[2px] origin-center`} style={{ left: -leftAlignment }}>
                    <span className="absolute flex h-2 w-2 -right-1 -top-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: styleInformation.color }}></span>
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: styleInformation.color }}></span>
                    </span>
                    <p className='whitespace-nowrap mx-1 text-xs'>{item.name}</p>
                </div>
                :
                <button onClick={() => openActivity()} ref={itemRef} className={`group pointer-events-auto hover:cursor-pointer absolute z-10 bg-white flex items-center shadow-dynamics border border-solid border-gray-300 overflow-hidden bottom-full justify-center rounded-[4px] px-1 py-[2px] origin-center`} style={{ left: -leftAlignment }}>
                    <span className='absolute -z-10 left-0 w-1 h-full group-hover:w-full duration-300 transition-all' style={{ backgroundColor: styleInformation.color }}></span>
                    <p className='whitespace-nowrap mx-1 text-xs group-hover:text-white transition-colors duration-300'>{item.name}</p>
                    { item.type ? <Icon name={item.type} /> : <></> }
                </button>
            }
        </div>
    )
}
