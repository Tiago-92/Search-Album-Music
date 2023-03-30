import i18n, { use } from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector'

import { messages } from './languages';

i18n
  .use(LanguageDetector)
  .init({
    debug: false,
    defaultNS: ['translations'],
    fallbackLng: 'pt',
    ns: ['translations'],
    resources: messages
  })

  export { i18n }