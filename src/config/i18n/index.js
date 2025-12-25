import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import vi from './locales/vi.json';

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'en', // Default locale
  fallbackLocale: 'en', // Fallback locale
  messages: {
    en,
    vi,
  },
  missing: (locale, key, vm, values) => {
    // Return the key itself when translation is not found
    return key;
  },
  silentTranslationWarn: true, // Suppress warnings for missing translations
  silentFallbackWarn: true, // Suppress warnings for fallback translations
});

export default i18n;

