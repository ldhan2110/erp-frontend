import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const STORAGE_KEY = 'app-locale';

// Available locales configuration
export const AVAILABLE_LOCALES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
];

// Default locale
const DEFAULT_LOCALE = 'en';

/**
 * Load locale from localStorage
 * @returns {string} The saved locale or default locale
 */
const loadLocale = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && AVAILABLE_LOCALES.some(loc => loc.code === saved)) {
      return saved;
    }
  } catch (error) {
    console.error('Error loading locale:', error);
  }
  return DEFAULT_LOCALE;
};

/**
 * Save locale to localStorage
 * @param {string} locale - The locale code to save
 */
const saveLocale = (locale) => {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch (error) {
    console.error('Error saving locale:', error);
  }
};

/**
 * Custom composable for managing and exposing all i18n/locale related functions
 * 
 * @returns {Object} An object containing all locale-related functions and state
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useLocale } from '@/composables';
 * 
 * const { 
 *   t, 
 *   locale, 
 *   setLocale, 
 *   availableLocales,
 *   currentLocaleInfo 
 * } = useLocale();
 * 
 * // Translate a key
 * const message = t('common.save');
 * 
 * // Change locale
 * setLocale('vi');
 * 
 * // Get current locale info
 * console.log(currentLocaleInfo.value); // { code: 'en', name: 'English', flag: '🇺🇸' }
 * </script>
 * ```
 */
export function useLocale() {
  const i18n = useI18n();

  // Initialize locale from storage
  const savedLocale = loadLocale();
  if (i18n.locale.value !== savedLocale) {
    i18n.locale.value = savedLocale;
  }

  // Reactive locale state
  const locale = computed({
    get: () => i18n.locale.value,
    set: (value) => {
      i18n.locale.value = value;
    }
  });

  // Watch for locale changes and persist
  watch(
    () => i18n.locale.value,
    (newLocale) => {
      saveLocale(newLocale);
    }
  );

  /**
   * Set the current locale
   * @param {string} localeCode - The locale code to set (e.g., 'en', 'vi')
   * @returns {void}
   */
  const setLocale = (localeCode) => {
    if (AVAILABLE_LOCALES.some(loc => loc.code === localeCode)) {
      i18n.locale.value = localeCode;
    } else {
      console.warn(`Locale "${localeCode}" is not available. Available locales:`, AVAILABLE_LOCALES.map(l => l.code));
    }
  };

  /**
   * Get the current locale code
   * @returns {string} The current locale code
   */
  const getLocale = () => {
    return i18n.locale.value;
  };

  /**
   * Get the fallback locale
   * @returns {string} The fallback locale code
   */
  const getFallbackLocale = () => {
    return i18n.fallbackLocale.value;
  };

  /**
   * Set the fallback locale
   * @param {string} localeCode - The locale code to set as fallback
   */
  const setFallbackLocale = (localeCode) => {
    i18n.fallbackLocale.value = localeCode;
  };

  /**
   * Get all available locales
   * @returns {Array} Array of locale objects with code, name, and flag
   */
  const getAvailableLocales = () => {
    return AVAILABLE_LOCALES;
  };

  /**
   * Get current locale information
   * @returns {Object|null} Locale object with code, name, and flag, or null if not found
   */
  const currentLocaleInfo = computed(() => {
    return AVAILABLE_LOCALES.find(loc => loc.code === locale.value) || null;
  });

  /**
   * Check if a translation key exists
   * @param {string} key - The translation key to check
   * @param {string} localeCode - Optional locale code, defaults to current locale
   * @returns {boolean} True if the key exists
   */
  const hasTranslation = (key, localeCode = null) => {
    return i18n.te(key, localeCode || locale.value);
  };

  /**
   * Get all translations for a key across all locales
   * @param {string} key - The translation key
   * @returns {Object} Object with locale codes as keys and translations as values
   */
  const getTranslations = (key) => {
    const translations = {};
    AVAILABLE_LOCALES.forEach(loc => {
      if (i18n.te(key, loc.code)) {
        translations[loc.code] = i18n.t(key, {}, { locale: loc.code });
      }
    });
    return translations;
  };

  /**
   * Format a number according to the current locale
   * @param {number} value - The number to format
   * @param {Object} options - Intl.NumberFormat options
   * @returns {string} Formatted number string
   */
  const formatNumber = (value, options = {}) => {
    return i18n.n(value, options);
  };

  /**
   * Format a date according to the current locale
   * @param {Date|number|string} value - The date to format
   * @param {string|Object} format - Format string or Intl.DateTimeFormat options
   * @returns {string} Formatted date string
   */
  const formatDate = (value, format = {}) => {
    return i18n.d(value, format);
  };

  /**
   * Get the locale-specific number format
   * @param {number} value - The number to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted number
   */
  const number = (value, options = {}) => {
    return i18n.n(value, options);
  };

  /**
   * Get the locale-specific date format
   * @param {Date|number|string} value - The date to format
   * @param {string|Object} format - Format string or options
   * @returns {string} Formatted date
   */
  const date = (value, format = {}) => {
    return i18n.d(value, format);
  };

  /**
   * Toggle between available locales (cycles through them)
   * @returns {string} The new locale code
   */
  const toggleLocale = () => {
    const currentIndex = AVAILABLE_LOCALES.findIndex(loc => loc.code === locale.value);
    const nextIndex = (currentIndex + 1) % AVAILABLE_LOCALES.length;
    const nextLocale = AVAILABLE_LOCALES[nextIndex].code;
    setLocale(nextLocale);
    return nextLocale;
  };

  /**
   * Check if the current locale is RTL (Right-to-Left)
   * @returns {boolean} True if RTL
   */
  const isRTL = computed(() => {
    // Add RTL locales here if needed in the future
    const rtlLocales = ['ar', 'he', 'fa', 'ur'];
    return rtlLocales.includes(locale.value);
  });

  /**
   * Get locale direction (ltr or rtl)
   * @returns {string} 'ltr' or 'rtl'
   */
  const localeDirection = computed(() => {
    return isRTL.value ? 'rtl' : 'ltr';
  });

  /**
   * Safe translation wrapper that handles null/undefined values
   * If the key is null or undefined, returns it as-is instead of translating
   * @param {string|null|undefined} key - The translation key
   * @param {...any} args - Additional arguments to pass to the translation function
   * @returns {string|any} Translated string or the original value if null/undefined
   */
  const safeTranslate = (key, ...args) => {
    // If key is null, undefined, or empty string, return it as-is
    if (key === null || key === undefined || key === '') {
      return key;
    }
    // Otherwise, use the original translation function
    return i18n.t(key, ...args);
  };

  return {
    // Core vue-i18n functions
    t: safeTranslate,              // Safe translation function (handles null/undefined)
    te: i18n.te,                  // Translation exists check
    tm: i18n.tm,                  // Get all translations for a key
    rt: i18n.rt,                  // Resolve translation
    d: i18n.d,                    // Date formatting
    n: i18n.n,                    // Number formatting
    locale,                       // Reactive locale (computed ref)
    fallbackLocale: i18n.fallbackLocale, // Fallback locale (ref)
    messages: i18n.messages,      // Messages object (ref)
    
    // Locale management functions
    setLocale,
    getLocale,
    getFallbackLocale,
    setFallbackLocale,
    getAvailableLocales,
    toggleLocale,
    
    // Locale information
    availableLocales: AVAILABLE_LOCALES,
    currentLocaleInfo,
    isRTL,
    localeDirection,
    
    // Helper functions
    hasTranslation,
    getTranslations,
    formatNumber,
    formatDate,
    number,
    date,
    
    // Direct access to i18n instance (for advanced usage)
    i18n
  };
}

