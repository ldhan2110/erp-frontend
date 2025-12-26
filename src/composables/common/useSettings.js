import { ref, watch } from 'vue';
import { useLocale } from './useLocale';

const STORAGE_KEY = 'app-settings';

// Default settings
const defaultSettings = {
  language: 'en',
  dateFormat: 'DD/MM/YYYY',
  darkMode: false,
  primaryColor: '#6366f1' // Default indigo color
};

// Load settings from localStorage
const loadSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return { ...defaultSettings };
};

// Save settings to localStorage
const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Apply dark mode to document
const applyDarkMode = (enabled) => {
  if (enabled) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Apply primary color to CSS variables
const applyPrimaryColor = (color) => {
  document.documentElement.style.setProperty('--p-primary-color', color);
  // You can also update other color-related CSS variables if needed
};

// Global settings state (singleton pattern)
let globalSettings = null;
let initialized = false;

/**
 * Composable for managing application settings
 * Handles language, date format, dark mode, and primary color
 */
export function useSettings() {
  const { locale } = useLocale();
  
  // Use singleton settings state
  if (!globalSettings) {
    globalSettings = ref(loadSettings());
  }
  
  const settings = globalSettings;
  
  // Initialize settings (only call once globally)
  const initializeSettings = () => {
    if (initialized) return;
    initialized = true;
    
    // Apply language
    locale.value = settings.value.language;
    
    // Apply dark mode
    applyDarkMode(settings.value.darkMode);
    
    // Apply primary color
    applyPrimaryColor(settings.value.primaryColor);
  };
  
  // Update language
  const setLanguage = (lang) => {
    settings.value.language = lang;
    locale.value = lang;
    saveSettings(settings.value);
  };
  
  // Update date format
  const setDateFormat = (format) => {
    settings.value.dateFormat = format;
    saveSettings(settings.value);
  };
  
  // Toggle dark mode
  const setDarkMode = (enabled) => {
    settings.value.darkMode = enabled;
    applyDarkMode(enabled);
    saveSettings(settings.value);
  };
  
  // Update primary color
  const setPrimaryColor = (color) => {
    settings.value.primaryColor = color;
    applyPrimaryColor(color);
    saveSettings(settings.value);
  };
  
  // Watch for changes and persist
  watch(
    () => settings.value,
    (newSettings) => {
      saveSettings(newSettings);
    },
    { deep: true }
  );
  
  return {
    settings,
    setLanguage,
    setDateFormat,
    setDarkMode,
    setPrimaryColor,
    initializeSettings
  };
}

