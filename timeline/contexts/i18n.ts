import { initReactI18next } from "react-i18next";
import i18n from "i18next";

i18n.use(initReactI18next).init({
    resources: {
        "en-US": {
            translation: {
                day: "day",
                quarter: "quarter",
                month: "month",
                week: "week",
                year: "year",
                filter_title: "Filter your timeline",
                filter_count: "Showing {0} out of {1} total activities",
                filter_search: "Search",
                filter_activitytypes: "Activity types",
                filter_save: "Save",
                filter_close: "Close",
                filter_dates: "Date interval"
            },
        },
        "da-DK": {
            translation: {
                day: "dag",
                quarter: "kvartal",
                month: "måned",
                week: "uge",
                year: "år",
            },
        },
        "fr-FR": {
            translation: {
                day: "jour",
                quarter: "trimestre",
                month: "mois",
                week: "semaine",
                year: "année",
            },
        },
        "es-ES": {
            translation: {
                day: "día",
                quarter: "trimestre",
                month: "mes",
                week: "semana",
                year: "año",
            },
        },
        "de-DE": {
            translation: {
                day: "Tag",
                quarter: "Quartal",
                month: "Monat",
                week: "Woche",
                year: "Jahr",
            },
        },
        "zh-CN": {
            translation: {
                day: "天",
                quarter: "季度",
                month: "月",
                week: "周",
                year: "年",
            },
        },
        "ja-JP": {
            translation: {
                day: "日",
                quarter: "四半期",
                month: "月",
                week: "週",
                year: "年",
            },
        },
        "ko-KR": {
            translation: {
                day: "일",
                quarter: "분기",
                month: "월",
                week: "주",
                year: "년",
            },
        },
        "ru-RU": {
            translation: {
                day: "день",
                quarter: "квартал",
                month: "месяц",
                week: "неделя",
                year: "год",
            },
        },
        "pt-BR": {
            translation: {
                day: "dia",
                quarter: "trimestre",
                month: "mês",
                week: "semana",
                year: "ano",
            },
        },
        "it-IT": {
            translation: {
                day: "giorno",
                quarter: "trimestre",
                month: "mese",
                week: "settimana",
                year: "anno",
            },
        },
        "ar-SA": {
            translation: {
                day: "يوم",
                quarter: "ربع",
                month: "شهر",
                week: "أسبوع",
                year: "سنة",
            },
        },
        "hi-IN": {
            translation: {
                day: "दिन",
                quarter: "तिमाही",
                month: "महीना",
                week: "सप्ताह",
                year: "साल",
            },
        },
        "nl-NL": {
            translation: {
                day: "dag",
                quarter: "kwartaal",
                month: "maand",
                week: "week",
                year: "jaar",
            },
        },
        "sv-SE": {
            translation: {
                day: "dag",
                quarter: "kvartal",
                month: "månad",
                week: "vecka",
                year: "år",
            },
        },
        "fi-FI": {
            translation: {
                day: "päivä",
                quarter: "kvartaali",
                month: "kuukausi",
                week: "viikko",
                year: "vuosi",
            },
        }        
    },
    fallbackLng: "en-US", 
    lng: "en-US", 
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;