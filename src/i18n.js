import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            [process.env.REACT_APP_LANG]: {
                translation: require(`./translations/${process.env.REACT_APP_LANG}.json`)
            },
        },
        lng: process.env.REACT_APP_LANG,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
