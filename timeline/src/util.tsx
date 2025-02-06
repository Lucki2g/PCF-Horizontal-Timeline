import * as React from "react";
import { DEBUG } from "./Timeline";
import { Puzzle, UserRound, UsersRound } from "lucide-react";

export const getHref = (clientUrl: string, locicalname: string, id: string) => {
  if (DEBUG) return "";
  const url = window.location.href;
  const appId = new URL(url).searchParams.get("appid");

  return (
    clientUrl +
    "/main.aspx?" +
    "appid=" +
    appId +
    "&pagetype=entityrecord" +
    `&etn=${locicalname}` +
    `&id=${id}` +
    "&viewtype=1039" +
    "&navbar=off"
  );
};

export const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getIcon = (entitytype: string) => {
  switch (entitytype) {
    case "systemuser":
      return <UserRound size={48} strokeWidth={1.5} absoluteStrokeWidth />;
    case "team":
      return <UsersRound size={48} strokeWidth={1.5} absoluteStrokeWidth />;
    default:
      return <Puzzle size={48} strokeWidth={1.5} absoluteStrokeWidth />;
  }
};

type LocaleSource = "override" | "systemuser" | "browser" | "organisation";
export const castToLocaleSource = (
  value: string | undefined,
  defaultValue: LocaleSource = "override",
): LocaleSource => {
  const validValues: LocaleSource[] = [
    "override",
    "systemuser",
    "browser",
    "organisation",
  ];
  return validValues.includes(value as LocaleSource)
    ? (value as LocaleSource)
    : defaultValue;
};

type TimeZoneSource = "override" | "browser";
export const castToTimeZoneSource = (
  value: string | undefined,
  defaultValue: TimeZoneSource = "override",
): TimeZoneSource => {
  const validValues: TimeZoneSource[] = ["override", "browser"];
  return validValues.includes(value as TimeZoneSource)
    ? (value as TimeZoneSource)
    : defaultValue;
};

type GridStyle =
  | "grid"
  | "none"
  | "override"
  | "dots"
  | "stripes"
  | "topography";
export const castToGridStyle = (
  value: string | undefined,
  defaultValue: GridStyle = "grid",
): GridStyle => {
  const validValues: GridStyle[] = [
    "grid",
    "none",
    "override",
    "dots",
    "stripes",
    "topography",
  ];
  return validValues.includes(value as GridStyle)
    ? (value as GridStyle)
    : defaultValue;
};

// Extend with future languages
export const lcidToBCP47Table: { [key: number]: string } = {
  1025: "ar-SA", // Arabic (Saudi Arabia)
  1030: "da-DK", // Danish (Denmark)
  1031: "de-DE", // German (Germany)
  1033: "en-US", // English (United States)
  1034: "es-ES", // Spanish (Spain)
  1035: "fi-FI", // Finnish (Finland)
  1036: "fr-FR", // French (France)
  1040: "it-IT", // Italian (Italy)
  1041: "ja-JP", // Japanese (Japan)
  1043: "nl-NL", // Dutch (Netherlands)
  1046: "pt-BR", // Portuguese (Brazil)
  1053: "sv-SE", // Swedish (Sweden)
  1081: "hi-IN", // Hindi (India)
  2052: "zh-CN", // Chinese (Simplified, China)
};
