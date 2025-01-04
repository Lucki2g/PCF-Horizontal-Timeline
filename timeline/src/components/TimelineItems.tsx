import * as React from 'react'
import TimelineItemBlock, { TimelineItem } from './TimelineItem';
import { getLeft, ITEM_PADDING, TimeUnit, ySize } from '../timeUtil';
import { IInputs } from '../../generated/ManifestTypes';
import { useFilter } from '../../contexts/filter-context';

interface ITimelineItemProps {
    items: TimelineItem[];
    mouseDown: boolean;
    context: ComponentFramework.Context<IInputs>;
    timeunits: TimeUnit[];
}

export default function TimelineItems({ context, items, mouseDown, timeunits }: ITimelineItemProps) {

    const [rows, setRows] = React.useState<TimelineItem[][]>([]);
    const { filter } = useFilter();
    const containerRef = React.useRef<HTMLDivElement>(null);

    const areItemsOverlapping = (item1: TimelineItem, item2: TimelineItem): boolean => {
        const left1 = getLeft(item1.date!, filter.startDate, context.parameters.xsize.raw ?? 32);
        const left2 = getLeft(item2.date!, filter.startDate, context.parameters.xsize.raw ?? 32);
        const width1 = 5 * item1.name.length + 32; 
        const width2 = 5 * item2.name.length + 32;
        return !(left1 + width1 < left2 || left2 + width2 < left1);
    };

    const arrangeItemsInRows = () => {
        const newRows: TimelineItem[][] = [];

        items.filter(i => i.show ?? false).forEach(item => {
            let placed = false;

            for (const row of newRows) {
                const overlap = row.some(existingItem => areItemsOverlapping(existingItem, item));
                if (!overlap) {
                    row.push(item);
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                newRows.push([item]);
            }
        });

        setRows(newRows.reverse());
    };

    React.useEffect(() => {
        arrangeItemsInRows();
    }, [items, filter.startDate]);

    return (
        <div ref={containerRef} className="w-full flex flex-col" style={{ paddingTop: ITEM_PADDING, paddingBottom: ITEM_PADDING }}>
            {
            rows.map((rowItems, rowIndex) => (
                <div key={"row-" + rowIndex} className="flex relative w-full" style={{ height: ySize }}>
                    {rowItems.map(item => (
                        <TimelineItemBlock 
                            key={"item-" + item.id}
                            context={context}
                            item={item}
                            parentRef={containerRef}
                            rowIdx={rowIndex}
                            rowCount={rows.length - 1}
                            mouseDown={mouseDown}
                            timeunits={timeunits}
                        />
                    ))}
                </div>
            ))
            }
        </div>
    )
}
