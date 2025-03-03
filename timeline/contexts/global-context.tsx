import { createContext, useContext, useState, ReactNode } from "react";
import * as React from "react";
import { ActivityInformation } from "../src/icons/Icon";
import { useTranslation } from "react-i18next";
import { LoaderProvider } from "./loader-context";
import { FilterProvider } from "./filter-context";
import { ItemEditType } from "../src/util";
import { TimelineItem } from "../src/components/TimelineItem";
import { TimeOptions } from "../src/timeUtil";
import { OptionState } from "@fluentui/react-components";

// the idea is to make this changeable at runtime by the user, with personilized settings

type GlobalContextProps = {
  locale: string;
  setLocale: (locale: string) => void;

  timezone: string;
  setTimeZone: (locale: string) => void;

  activityInfo: { [schemaname: string]: ActivityInformation };
  setActivityInfo: (info: {
    [schemaname: string]: ActivityInformation;
  }) => void;

  xSize: number;
  setXSize: (size: number) => void;

  clientUrl: string;
  setClientUrl: (url: string) => void;

  itemEditType: ItemEditType;
  setItemEditType: (type: ItemEditType) => void;

  items: TimelineItem[],
  itemDispatch: (action: IItemAction) => void;

  options: TimeOptions;
  setOptions: (options: TimeOptions) => void;
};

const initialState: GlobalContextProps = {
  locale: "",
  setLocale: () => {},
  timezone: "",
  setTimeZone: () => {},
  activityInfo: {},
  setActivityInfo: () => {},
  xSize: 0,
  setXSize: () => {},
  clientUrl: "",
  setClientUrl: () => {},
  itemEditType: "dropdown",
  setItemEditType: () => {},
  items: [],
  itemDispatch: () => {},
  options: {} as TimeOptions,
  setOptions: () => {},
};

type ItemReducerActions = "update" | "reset";
interface IItemAction {
  type: ItemReducerActions;
  payload: any;
}
const initialItems: TimelineItem[] = [];
const itemReducer = (items: TimelineItem[], action: IItemAction) => {
  switch (action.type) {
    case "update":
      return items.map(item =>
        item.id === action.payload.id
          ? { ...item, ...action.payload } 
          : item
      );
    case "reset":
    return action.payload;
  }
}

const GlobalContext = createContext<GlobalContextProps>(initialState);

export const useGlobalGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  // activity items shown on the timeline
  const [items, itemDispatch] = React.useReducer(itemReducer, initialItems);

  // others settings and data
  const [locale, setLocale] = React.useState<string>(initialState.locale);
  const [timezone, setTimeZone] = React.useState<string>(initialState.timezone);
  const [options, setOptions] = React.useState<TimeOptions>({ } as TimeOptions);
  const [itemEditType, setItemEditType] = React.useState<ItemEditType>("dropdown");
  const [activityInfo, setActivityInfo] = React.useState<{
    [schemaname: string]: ActivityInformation;
  }>(initialState.activityInfo);
  const [xSize, setXSize] = React.useState<number>(initialState.xSize);
  const [clientUrl, setClientUrl] = React.useState<string>(
    initialState.clientUrl,
  );

  // context
  const { i18n } = useTranslation();

  // effects
  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <GlobalContext.Provider
      value={{
        locale,
        setLocale,
        timezone,
        setTimeZone,
        activityInfo,
        setActivityInfo,
        xSize,
        setXSize,
        clientUrl,
        setClientUrl,
        itemEditType,
        setItemEditType,
        options,
        setOptions,
        // items
        items,
        itemDispatch,
      }}
    >
      <LoaderProvider>
        <FilterProvider>
          {children}
        </FilterProvider>
      </LoaderProvider>
    </GlobalContext.Provider>
  );
};
