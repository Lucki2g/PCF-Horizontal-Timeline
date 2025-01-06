import * as React from "react";
import { VariableSizeList, FixedSizeList } from 'react-window';
import { fontSize, getAvailableTimeUnits, TimeUnit, timeUnitInformation, TimeUnits, ySize } from "../timeUtil";
import { useTranslation } from "react-i18next";
import { useFilter } from "../../contexts/filter-context";
import { IInputs } from "../../generated/ManifestTypes";

export type RoundingType = "year" | "quarter" | "month" | "day" | "none";

export interface TimeOptions {
  years: "full" | "short";
  quarterPrefix: string;
  months: "numeric" | "2-digit" | "long" | "short" | "narrow";
  weeksPrefix: string;
  days: "numeric" | "2-digit" | "long" | "short" | "narrow";
  hourCycle: "h11" | "h12" | "h23" | "h24";
  hours: "numeric" | "2-digit";
  minutes: "numeric" | "2-digit";
  seconds: "numeric" | "2-digit";
}

export interface ITimelineDataProps {
    context: ComponentFramework.Context<IInputs>;
    locale: string,
    options: TimeOptions,
    rounding: RoundingType,
    units: TimeUnit[],
    left: number,
}

const ROW_HEIGHT = ySize;

export const TimelineData = ({ left, context, locale, options, rounding, units }: ITimelineDataProps) => {
    const { t } = useTranslation();
    const { filter } = useFilter();
    const xSize = context.parameters.xsize.raw ?? 32;

    context.mode.allocatedHeight = 720;
    context.mode.allocatedWidth = 720;

    const timeUnits = React.useMemo<TimeUnits>(() => {
        return getAvailableTimeUnits(filter.startDate, filter.endDate, units, options, locale, rounding);
    }, [filter.startDate, filter.endDate, units, options, locale, rounding]);

    if (!timeUnits.days || timeUnits.days.length === 0) return <></>;

    // Calculate dynamic row heights based on time unit size
    const getRowHeight = (index: number) => {
        const unit = units[index];
        const info = timeUnitInformation(unit);
        const rowHeight = timeUnits[info.timeUnits]?.length ? ROW_HEIGHT : 0;
        return rowHeight;
    };

    // Row Renderer
    const Row = ({ index, style }: { index: number, style: any }) => {
        const unit = units[index];
        const info = timeUnitInformation(unit);
        const rowItems = timeUnits[info.timeUnits] ?? [];

        const listRef = React.useRef<VariableSizeList | null>(null);

        React.useEffect(() => {
          if (!listRef.current) return;
          console.log("left: " + left);
          listRef.current.scrollTo(left);
        }, [left])

        return (
            <div style={style} className="flex w-fit">
                <VariableSizeList
                    ref={listRef}
                    direction="ltr"
                    height={ROW_HEIGHT}
                    width={context.mode.allocatedWidth}
                    itemCount={rowItems.length}
                    itemSize={(i) => rowItems[i].hours * xSize}
                    layout="horizontal"
                    style={{ overflow: "hidden" }}
                >
                    {({ index: columnIndex, style: columnStyle }: { index: number, style: any }) => (
                        <div
                            key={rowItems[columnIndex].key}
                            className="flex abs relative items-center border-t border-l border-r border-x-gray-300 border-y-gray-500 bg-white"
                            style={{
                                ...columnStyle,
                                width: rowItems[columnIndex].hours * xSize,
                                minWidth: rowItems[columnIndex].hours * xSize,
                                height: ROW_HEIGHT,
                                fontSize: fontSize,
                            }}
                        >
                            <div className="px-2 sticky left-0 text-ellipsis overflow-hidden pt-2">
                                {rowItems[columnIndex].name}
                            </div>
                        </div>
                    )}
                </VariableSizeList>
            </div>
        );
    };

    return (
        <div className="flex w-fit">
            {/* Labels */}
            <div className="flex flex-col absolute">
                {units.map((unit: TimeUnit, idx: number) => {
                    const info = timeUnitInformation(unit);
                    return (
                        <p
                            key={"label-" + info.timeUnits}
                            className="pl-2 self-start text-neutral-400 z-10"
                            style={{ fontSize: fontSize - 1, marginTop: -1, height: ySize + 1 }}
                        >
                            {t(info.i18ntranslation)}
                        </p>
                    );
                })}
            </div>

            {/* Virtualized Rows */}
            <VariableSizeList
                height={ROW_HEIGHT * units.length}
                width={context.mode.allocatedWidth}
                itemCount={units.length}
                itemSize={getRowHeight}
            >
                {Row}
            </VariableSizeList>
        </div>
    );
};
