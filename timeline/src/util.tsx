import * as React from "react";
import { DEBUG } from "./Timeline";

export const getHref = (clientUrl: string, locicalname: string, id: string) => {
    if (DEBUG) return "";
    const url = window.location.href;
    const appId = new URL(url).searchParams.get("appid");

    return clientUrl + "/main.aspx?"
        + "appid=" + appId
        + "&pagetype=entityrecord"
        + `&etn=${locicalname}`
        + `&id=${id}`
        + "&viewtype=1039"
        + "&navbar=off"
}

export const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r}, ${g}, ${b}`;
};

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const getIcon = (entitytype: string) => {
    switch (entitytype) {
        case "systemuser":
            return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                <path d="M1330 1203q136 47 245 131t186 196 118 243 41 275h-128q0-164-58-304t-162-244-243-161-305-59q-107 0-206 27t-184 76-155 119-119 155-77 185-27 206H128q0-144 42-275t119-242 186-194 245-133q-78-42-140-102T475 969t-67-157-24-172q0-133 50-249t137-204T774 50t250-50q133 0 249 50t204 137 137 203 50 250q0 88-23 171t-67 156-105 133-139 103zM512 640q0 106 40 199t110 162 163 110 199 41q106 0 199-40t162-110 110-163 41-199q0-106-40-199t-110-162-163-110-199-41q-106 0-199 40T663 278 553 441t-41 199z"></path>
            </svg>)
        case "team":
            return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                <path d="M1790 1717q98 48 162 135t81 196h-110q-11-57-41-106t-73-84-97-56-112-20q-59 0-112 20t-97 55-73 85-41 106h-110q16-108 80-195t163-136q-57-45-88-109t-32-136q0-45 12-87t36-79 57-66 74-49q-27-39-62-69t-76-53-86-33-93-12q-80 0-153 31t-127 91q24 65 24 134 0 92-41 173t-115 136q65 33 117 81t90 108 57 128 20 142H896q0-79-30-149t-82-122-123-83-149-30q-80 0-149 30t-122 82-83 123-30 149H0q0-73 20-141t57-128 89-108 118-82q-74-55-115-136t-41-173q0-79 30-149t82-122 122-83 150-30q85 0 161 36t132 100q26-25 56-45t63-38q-74-55-115-136t-41-173q0-79 30-149t82-122 122-83 150-30q79 0 149 30t122 82 83 123 30 149q0 92-41 173t-115 136q70 37 126 90t95 123q64 0 120 24t99 67 66 98 24 121q0 72-31 136t-89 109zM512 1536q53 0 99-20t82-55 55-81 20-100q0-53-20-99t-55-82-81-55-100-20q-53 0-99 20t-82 55-55 81-20 100q0 53 20 99t55 82 81 55 100 20zm384-896q0 53 20 99t55 82 81 55 100 20q53 0 99-20t82-55 55-81 20-100q0-53-20-99t-55-82-81-55-100-20q-53 0-99 20t-82 55-55 81-20 100zm704 630q-42 0-78 16t-64 43-44 64-16 79q0 42 16 78t43 64 64 44 79 16q42 0 78-16t64-43 44-64 16-79q0-42-16-78t-43-64-64-44-79-16z"></path>
            </svg>)
        default:
            return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                <path d="M2048 0v2048H0V0h2048zm-128 128H128v1792h1792V128z"></path>
            </svg>
        )
    }
}

type LocaleSource = "override" | "systemuser" | "browser"; 
export const castToLocaleSource = (value: string | undefined, defaultValue: LocaleSource = "override"): LocaleSource => {
    const validValues: LocaleSource[] = ["override", "systemuser", "browser"];
    return validValues.includes(value as LocaleSource) ? (value as LocaleSource) : defaultValue;
}

// Extend with future languages
export const lcidToBCP47Table: { [key: number]: string } = {
    1033: "en-US",
    1030: "da-DK",
    1036: "fr-FR",
    1034: "es-ES",
    1031: "de-DE",
    2052: "zh-CN",
    1041: "ja-JP",
    1025: "ar-SA",
    1046: "pt-BR",
    1040: "it-IT",
    1081: "hi-IN",
    1043: "nl-NL",
    1053: "sv-SE",
    1035: "fi-FI"
}