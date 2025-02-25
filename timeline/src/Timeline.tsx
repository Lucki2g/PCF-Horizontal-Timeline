import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import {
  addDayToDateAndRound,
  getLeft,
  removeDayFromDateAndRound,
  TimeOptions,
  TimeUnit,
  ySize,
} from "./timeUtil";
import { IEntityReference, TimelineItem } from "./components/TimelineItem";
import { FilterState, useFilter } from "../contexts/filter-context";
import TimelessTimelineItemBlock from "./components/TimelessTimelineItem";
import { useTranslation } from "react-i18next";
import { useGlobalLoaderContext } from "../contexts/loader-context";
import {
  TimelineDataCanvas,
  TimelineDataCanvasHandle,
} from "./components/TimelineDataCanvas";
import {
  castToGridStyle,
  castToLocaleSource,
  castToTimeZoneSource,
  getBackground,
  lcidToBCP47Table,
  uuidv4,
} from "./util";
import { ActivityInformation } from "./icons/Icon";
import { useGlobalGlobalContext } from "../contexts/global-context";
import { loadData } from "./services/dataLoader";
import TimelineToolbar from "./components/toolbars/TimelineToolbar";

interface ITimelineProps {
  context: ComponentFramework.Context<IInputs>;
}

export const DEBUG = true;

export default function Timeline({ context }: ITimelineProps) {
  const size = context.mode.allocatedWidth;
  if (size <= 0) return <></>;

  // Global context
  const {
    setLocale,
    setTimeZone,
    setActivityInfo,
    setXSize,
    setClientUrl,
    timezone,
    clientUrl,
    activityInfo,
  } = useGlobalGlobalContext();

  const randomID = React.useMemo(() => {
    return uuidv4();
  }, []);

  // Settings
  const OPTIONS: TimeOptions = {
    years: context.parameters.yearsformat.raw ?? "full",
    quarterPrefix: context.parameters.quartersformat.raw ?? "",
    months: context.parameters.monthsformat.raw ?? "long",
    weeksPrefix: context.parameters.weeksformat.raw ?? "",
    days: context.parameters.daysformat.raw ?? "numeric",
    hours: context.parameters.hoursformat.raw ?? "numeric",
    hourCycle: context.parameters.hourscycle.raw ?? "23h",
    minutes: "2-digit",
    seconds: "2-digit",
  } as TimeOptions;
  const ROUNDING = (context.parameters.rounding.raw ?? "day") as any;
  const TIMEUNITSUNSORTED: { value: TimeUnit; sort: number }[] = [];
  if (context.parameters.yearsenabled.raw)
    TIMEUNITSUNSORTED.push({
      value: TimeUnit.Year,
      sort: context.parameters.yearspos.raw ?? 3,
    });
  if (context.parameters.quartersenabled.raw)
    TIMEUNITSUNSORTED.push({
      value: TimeUnit.Quarter,
      sort: context.parameters.quarterpos.raw ?? 5,
    });
  if (context.parameters.monthsformat.raw)
    TIMEUNITSUNSORTED.push({
      value: TimeUnit.Month,
      sort: context.parameters.monthspos.raw ?? 2,
    });
  if (context.parameters.weeksenabled.raw)
    TIMEUNITSUNSORTED.push({
      value: TimeUnit.Week,
      sort: context.parameters.weekspos.raw ?? 4,
    });
  if (context.parameters.daysenabled.raw)
    TIMEUNITSUNSORTED.push({
      value: TimeUnit.Day,
      sort: context.parameters.dayspos.raw ?? 1,
    });
  if (context.parameters.hoursenabled.raw)
    TIMEUNITSUNSORTED.push({
      value: TimeUnit.Hour,
      sort: context.parameters.hourspos.raw ?? 0,
    });
  const TIMEUNITS = TIMEUNITSUNSORTED.sort(
    (prev, curr) => prev.sort - curr.sort,
  ).map((i) => i.value);
  const ACTIVITYINFO = JSON.parse(
    context.parameters.activitydata.raw ??
      `{
        "task": {
            "color": "#eab308",
            "icon": "AccountActivity"
        },
        "appointment": {
            "color": "#7e22ce",
            "icon": "Calendar"
        },
        "milestone": {
            "color": "#e11d48",
            "icon": "Flag"
        },
        "email": {
            "color": "#16a34a",
            "icon": "Mail"
        },
        "phonecall": {
            "color": "#fb7185",
            "icon": "Phone"
        }
    }`,
  ) as { [schemaname: string]: ActivityInformation };
  const GRIDSTYLE = castToGridStyle(
    context.parameters.bgstyle.raw ?? "",
    "grid",
  );
  const BACKGROUND: string = getBackground(context, GRIDSTYLE); // does this open for XSS? - TODO come back and check

  // States
  const [isMouseDown, setMouseDown] = React.useState<boolean>(false);
  const [isPaneOpen, setPaneOpen] = React.useState<boolean>(false);
  const [startX, setStartX] = React.useState<number>(0.0);
  const [left, setLeft] = React.useState<number>(0.0);
  const [items, setItems] = React.useState<TimelineItem[]>([]);
  const [height, setHeight] = React.useState<number>(0);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  // Refs
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<TimelineDataCanvasHandle>(null);

  // Context
  const { filter, initialize: initializeFilter, setFilter } = useFilter();
  const { t } = useTranslation();
  const { loadingstate, setState } = useGlobalLoaderContext();

  // Effects
  React.useEffect(() => {
    const initialize = async () => {
      const localeSource = castToLocaleSource(
        context.parameters.localesource.raw ?? "",
        "systemuser",
      );
      let locale: string = "";
      switch (localeSource) {
        case "override":
          locale = lcidToBCP47Table[context.parameters.locale.raw ?? 1033];
          break;
        case "systemuser":
          locale = lcidToBCP47Table[context.userSettings.languageId ?? 1033];
          break;
        case "browser":
          locale = navigator.language;
          break;
      }
      setLocale(locale);

      const timezoneSource = castToTimeZoneSource(
        context.parameters.timezonesource.raw ?? "",
        "browser",
      );
      let timezone: string = "";
      switch (timezoneSource) {
        case "override":
          timezone = context.parameters.timezone.raw ?? "UTC";
          break;
        case "browser":
          timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          break;
      }
      setTimeZone(timezone);

      setActivityInfo(ACTIVITYINFO);
      setXSize(context.parameters.xsize.raw ?? 32);
      setClientUrl(DEBUG ? "" : (context as any).page.getClientUrl());

      // initial data load
      await dataRefresh(timezone);
    };

    initialize();
  }, []);

  React.useEffect(() => {
    const refresh = async () => {
      if (loadingstate) {
        if (timezone && timezone !== null) await dataRefresh(timezone);
        return;
      }
      if (!timelineRef.current) return;

      animateLeft(
        0,
        getLeft(
          new Date(),
          filter.startDate,
          context.parameters.xsize.raw ?? 32,
        ) -
          timelineRef.current.clientWidth / 2,
        timelineRef.current,
        1000,
      );
    };
    refresh();
  }, [loadingstate]);

  // Events
  function mouseDown(e: any, mobile: boolean = false) {
    setMouseDown(true);
    if (!mobile) {
      setStartX(e.pageX);
    } else {
      const touch = e.touches[0];
      setStartX(touch.pageX);
    }
    setLeft(e.target.scrollLeft);
  }

  function mouseOut() {
    setMouseDown(false);
  }

  function mouseMove(e: any, mobile = false) {
    if (!isMouseDown || isAnimating) return;

    let x = 0;
    if (!mobile) {
      e.preventDefault();
      x = e.pageX;
    } else {
      const touch = e.touches[0];
      x = touch.pageX;
    }

    const walk = (x - startX) * 3;
    const newLeftRounded = Math.max(0, left - walk);

    updateLeft(newLeftRounded, timelineRef, canvasRef);
  }

  const updateLeft = (
    location: number,
    ref: React.RefObject<HTMLElement>,
    canvasRef: React.RefObject<TimelineDataCanvasHandle>,
  ) => {
    const canvas = document.getElementById(
      `canvas-${randomID}`,
    ) as HTMLCanvasElement;
    if (ref && ref.current && canvas && canvasRef.current) {
      const maxScrollLeft = canvasRef.current.getMaxSize();
      const newValue = Math.max(0, Math.min(maxScrollLeft, location));

      ref.current.scrollLeft = newValue;
      canvas.style.left = newValue + "px";
      canvasRef.current.draw(canvas, newValue);
    }
  };

  const animateLeft = (
    start: number,
    end: number,
    element: HTMLElement,
    duration: number,
  ) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const startTime = performance.now();
    const distance = end - start;

    const step = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const newLeft = start + distance * progress;

      updateLeft(newLeft, timelineRef, canvasRef);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);

    setTimeout(() => setIsAnimating(false), duration);
  };

  const dataRefresh = async (timezone: string) => {
    let start = new Date("9999-12-31");
    let end = new Date("0000-01-01");
    const items = await loadData(context);
    for (const item of items) {
      if (!item.date) continue;
      if (item.date < start) start = item.date;
      if (item.date > end) end = item.date;
    }

    if (new Date() > end) end = new Date();
    setItems(items);
    initializeFilter({
      search: "",
      itemTypes: Object.keys(ACTIVITYINFO).reduce(
        (acc, item) => ({ ...acc, [item]: true }),
        {},
      ),
      startDate: removeDayFromDateAndRound(start, timezone),
      endDate: addDayToDateAndRound(end, timezone),
      owner: null,
    });
    setState(false);
  };

  return loadingstate ? (
    <></>
  ) : (
    <div className="relative flex h-full w-full select-none items-start justify-center font-dynamics text-dynamics-text">
      {/* Loading */}
      {loadingstate ? <div className="h-1 w-full bg-black"></div> : <></>}

      {/* Actions */}
      <TimelineToolbar
        timelineRef={timelineRef}
        animate={animateLeft}
        isPaneOpen={isPaneOpen}
        paneChange={() => setPaneOpen(!isPaneOpen)}
        items={items}
        onSave={(filter: FilterState) => {
          setFilter(filter);
        }}
      />

      {/* Timeline */}
      <div
        ref={timelineRef}
        className={`${isAnimating ? "cursor-wait" : isMouseDown ? "cursor-grabbing" : "cursor-grab"} relative inset-0 w-full overflow-x-hidden rounded-lg border border-solid border-gray-700 shadow-dynamics`}
        onMouseDown={(e) => mouseDown(e)}
        onMouseUp={mouseOut}
        onMouseLeave={mouseOut}
        onMouseMove={(e) => mouseMove(e)}
        onTouchStart={(e) => mouseDown(e, true)}
        onTouchEnd={mouseOut}
        onTouchMove={(e) => mouseMove(e, true)}
        style={{
          backgroundImage: BACKGROUND,
          backgroundColor: context.parameters.bgcolor.raw ?? "#fff",
          width: context.mode.allocatedWidth
        }}
      >
        <TimelineDataCanvas
          width={context.mode.allocatedWidth}
          uuid={randomID}
          ref={canvasRef}
          setHeight={(height: number) => setHeight(height)}
          items={items.filter((i) => i.date !== null)}
          rounding={ROUNDING}
          options={OPTIONS}
          units={TIMEUNITS}
        />
      </div>

      {/* Pane */}
      <div
        className={`flex-grow ${isPaneOpen ? "ml-2 w-64 border p-2 opacity-100" : "w-0 p-0 opacity-0"} flex flex-col items-start rounded-lg border-solid border-gray-700 bg-white transition-all duration-300`}
        style={{ height: height }}
      >
        <h1 className="text-sm font-semibold">{t("timeless_title")}</h1>
        <p className="mb-2 text-[9px] text-gray-500">
          {t("timeless_description")}
        </p>
        <div className="flex h-full w-full flex-col items-center justify-center overflow-y-scroll">
          {items.filter((i) => i.date === null).length === 0 ? (
            <p className="text-xs">{t("timeless_noitems")}</p>
          ) : (
            items
              .filter((i) => i.date === null)
              .map((i) => {
                return <TimelessTimelineItemBlock key={i.id} item={i} />;
              })
          )}
        </div>
      </div>
    </div>
  );
}
