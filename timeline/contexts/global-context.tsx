import { createContext, useContext, useState, ReactNode } from "react";
import * as React from "react";
import { ActivityInformation } from "../src/icons/Icon";
import { useTranslation } from "react-i18next";
import { LoaderProvider } from "./loader-context";
import { FilterProvider } from "./filter-context";
import { DialogProvider } from "./dialog-context";

type GlobalContextProps = {
  locale: string;
  setLocale: (locale: string) => void;

  activityInfo: { [schemaname: string]: ActivityInformation };
  setActivityInfo: (info: { [schemaname: string]: ActivityInformation }) => void;

  xSize: number;
  setXSize: (size: number) => void;

  clientUrl: string;
  setClientUrl: (url: string) => void;
};

const initialState: GlobalContextProps = {
  locale: "",
  setLocale: () => {},
  activityInfo: {},
  setActivityInfo: () => {},
  xSize: 0,
  setXSize: () => {},
  clientUrl: "",
  setClientUrl: () => {}
};

const GlobalContext = createContext<GlobalContextProps>(initialState);

export const useGlobalGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = React.useState<string>(initialState.locale);
  const [activityInfo, setActivityInfo] = React.useState<{ [schemaname: string]: ActivityInformation }>(initialState.activityInfo);
  const [xSize, setXSize] = React.useState<number>(initialState.xSize);
  const [clientUrl, setClientUrl] = React.useState<string>(initialState.clientUrl);

  const { i18n } = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale])

  return (
    <GlobalContext.Provider value={{ locale, setLocale, activityInfo, setActivityInfo, xSize, setXSize, clientUrl, setClientUrl }}> 
      <LoaderProvider>
        <FilterProvider>
          <DialogProvider>
            {children}
          </DialogProvider>
        </FilterProvider>
      </LoaderProvider>
    </GlobalContext.Provider>
  );
};