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

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string (e.g., '#6366f1')
 * @returns {Object} RGB object with r, g, b values
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Darken a hex color by a percentage
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
const darkenColor = (hex, percent) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - (percent / 100);
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);
  
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};

/**
 * Lighten a hex color by a percentage
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened hex color
 */
const lightenColor = (hex, percent) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = percent / 100;
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);
  
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};

/**
 * Calculate text color (white or black) based on background brightness
 * @param {string} hex - Hex color string
 * @returns {string} '#ffffff' or '#000000'
 */
const getContrastColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Apply primary color to CSS variables
const applyPrimaryColor = (color) => {
  const root = document.documentElement;
  
  // Base primary color
  root.style.setProperty('--p-primary-color', color);
  
  // Calculate color variations
  const hoverColor = darkenColor(color, 10); // 10% darker for hover
  const activeColor = darkenColor(color, 15); // 15% darker for active
  const textColor = getContrastColor(color);
  const hoverTextColor = getContrastColor(hoverColor);
  
  // Button primary colors
  root.style.setProperty('--p-button-primary-background', color);
  root.style.setProperty('--p-button-primary-hover-background', hoverColor);
  root.style.setProperty('--p-button-primary-active-background', activeColor);
  root.style.setProperty('--p-button-primary-border-color', color);
  root.style.setProperty('--p-button-primary-hover-border-color', hoverColor);
  root.style.setProperty('--p-button-primary-active-border-color', activeColor);
  root.style.setProperty('--p-button-primary-color', textColor);
  root.style.setProperty('--p-button-primary-hover-color', hoverTextColor);
  root.style.setProperty('--p-button-primary-active-color', hoverTextColor);
  
  // Focus ring color (lighter version for accessibility)
  const focusColor = lightenColor(color, 20);
  root.style.setProperty('--p-focus-ring-color', focusColor);
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

