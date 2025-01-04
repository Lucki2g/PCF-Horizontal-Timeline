import * as React from "react";
import { start } from "repl";
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
    units: TimeUnit[]
}

export const TimelineData = ({ context, locale, options, rounding, units }: ITimelineDataProps) => {
    
  const { t } = useTranslation();
  const { filter } = useFilter();

  const xSize = context.parameters.xsize.raw ?? 32;

  const timeUnits = React.useMemo<TimeUnits>(() => {
    const unitData = getAvailableTimeUnits(filter.startDate, filter.endDate, units, options, locale, rounding);
    return unitData;
  }, [filter.startDate, filter.endDate]);

  if (!timeUnits.days || timeUnits.days.length === 0) return <></>;

  return (
    <div className="flex w-fit">

      {/* LABELS */}
      <div className="flex flex-col absolute abs">
        {
          units.map((unit: TimeUnit, idx: number) => {
            const info = timeUnitInformation(unit);
            return <p key={"label-" + info.timeUnits} className="pl-2 self-start text-neutral-400 z-10" style={{ fontSize: fontSize - 1, marginTop: -1, height: ySize + 1 }}>
              {t(info.i18ntranslation)}
            </p>
          })
        }
      </div>

      {/* UNITS */}
      <div className="flex flex-col w-fit">
        {
          units.map((unit: TimeUnit) => {
            const info = timeUnitInformation(unit);
            return <div key={"row-" + info.timeUnits} className="flex w-fit">
            {
              timeUnits[info.timeUnits].map(
                timeunit => (
                  <div key={timeunit.key} className="flex relative items-center border-t border-l border-r border-x-gray-300 border-y-gray-500 bg-white" 
                    style={{ borderTopStyle: "solid", borderRightStyle: "dotted", borderLeftStyle: "dotted", width: (timeunit.hours * xSize), minWidth: (timeunit.hours * xSize), height: ySize, fontSize: fontSize }}>
                    <div className="px-2 sticky left-0 text-ellipsis overflow-hidden pt-2">{timeunit.name}</div>
                  </div>
                )
              )
            }
          </div>
          })
        }
      </div>
    </div>
  );
}