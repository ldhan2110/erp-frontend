<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useLocale, useSettings } from '@composables';
import { useAppStore } from '@store/common';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import { storeToRefs } from 'pinia'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'close']);

const { t, locale } = useLocale();
const { settings, setLanguage, setDateFormat, setDarkMode, setPrimaryColor } = useSettings();
const appStore = useAppStore();
const { languages } = storeToRefs(appStore);

// Map API language codes (ENG, VIE, KOR) to i18n locale codes (en, vi, ko)
const mapLanguageCode = (code) => {
  const mapping = {
    'ENG': 'en',
    'VIE': 'vi',
    'KOR': 'ko'
  };
  return mapping[code] || code.toLowerCase().substring(0, 2);
};

// Convert API language data to Select component format
const languageOptions = computed(() => {
  debugger;
  if (!Array.isArray(languages.value) || languages.value.length === 0) {
    // Fallback to default languages if API data is not loaded yet
    return [
      { label: '🇺🇸 English', value: 'en', icon: null, originalCode: 'ENG' },
      { label: '🇻🇳 Tiếng Việt', value: 'vi', icon: null, originalCode: 'VIE' }
    ];
  }
  
  return languages.value.map(lang => {
    const localeCode = mapLanguageCode(lang.CODE);
    const iconPath = lang.ICON || null;
    return {
      label: lang.NAME || lang.CODE,
      value: localeCode,
      icon: iconPath,
      originalCode: lang.CODE,
      originalData: lang
    };
  });
});

const currentLanguage = computed(() => {
  return languageOptions.value.find(lang => lang.value === settings.value.language) || languageOptions.value[0];
});

// Date format options
const dateFormats = [
  { label: 'Day/Month/Year', value: 'DD/MM/YYYY' },
  { label: 'Month/Day/Year', value: 'MM/DD/YYYY' },
  { label: 'Year/Month/Day', value: 'YYYY/MM/DD' },
  { label: 'Day Month Year', value: 'DD MMMM YYYY' }
];

const currentDateFormat = computed(() => {
  return dateFormats.find(format => format.value === settings.value.dateFormat) || dateFormats[0];
});

const dateFormatOptions = computed(() => dateFormats);

// Primary color options
const colorOptions = [
  { label: 'Purple', value: '#9333ea' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Green', value: '#10b981' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Teal', value: '#14b8a6' }
];

const currentColor = computed(() => {
  return colorOptions.find(color => color.value === settings.value.primaryColor) || colorOptions[2];
});

const colorOptionsList = computed(() => colorOptions);

// Handlers
const handleLanguageChange = (event) => {
  const langCode = event.value;
  setLanguage(langCode);
  appStore.saveLanguage(langCode);
};

const handleDateFormatChange = (event) => {
  setDateFormat(event.value);
};

const handleDarkModeChange = (event) => {
  setDarkMode(event.value);
};

const handleColorChange = (event) => {
  setPrimaryColor(event.value);
};

const handleClose = () => {
  emit('update:visible', false);
  emit('close');
};

const visibleModel = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// Load languages when modal opens
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    const languages = appStore.languages;
    if (!Array.isArray(languages) || languages.length === 0) {
      appStore.getLanguages();
    }
  }
});

// Also try to load on mount
onMounted(() => {
  const languages = appStore.languages;
  if (!Array.isArray(languages) || languages.length === 0) {
    appStore.getLanguages();
  }
});
</script>

<template>
  <Dialog
    v-model:visible="visibleModel"
    :header="t('settings.title')"
    modal
    :style="{ width: '32rem' }"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :draggable="false"
    class="p-settings-modal"
    @hide="handleClose"
  >
    <template #header>
      <div class="p-settings-modal-header">
        <i class="pi pi-lightbulb p-settings-modal-icon"></i>
        <span class="p-settings-modal-title">{{ t('settings.title') }}</span>
      </div>
    </template>

    <div class="p-settings-content">
      <!-- Language Setting -->
      <div class="p-setting-item">
        <div class="p-setting-item-left">
          <i class="pi pi-globe p-setting-icon"></i>
          <div class="p-setting-info">
            <div class="p-setting-title">{{ t('settings.language.title') }}</div>
            <div class="p-setting-description">{{ t('settings.language.description') }}</div>
          </div>
        </div>
        <div class="p-setting-item-right">
          <Select
            v-model="settings.language"
            :options="languageOptions"
            optionLabel="label"
            optionValue="value"
            class="p-setting-select"
            @change="handleLanguageChange"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="p-setting-select-value">
                <img 
                  v-if="languageOptions.find(opt => opt.value === slotProps.value)?.icon"
                  :src="languageOptions.find(opt => opt.value === slotProps.value)?.icon"
                  :alt="languageOptions.find(opt => opt.value === slotProps.value)?.label"
                  class="p-setting-language-icon"
                />
                {{ languageOptions.find(opt => opt.value === slotProps.value)?.label }}
              </div>
            </template>
            <template #option="slotProps">
              <div class="p-setting-language-option">
                <img 
                  v-if="slotProps.option.icon"
                  :src="slotProps.option.icon"
                  :alt="slotProps.option.label"
                  class="p-setting-language-icon"
                />
                {{ slotProps.option.label }}
              </div>
            </template>
          </Select>
        </div>
      </div>

      <!-- Dark Mode Setting -->
      <div class="p-setting-item">
        <div class="p-setting-item-left">
          <i class="pi pi-lightbulb p-setting-icon"></i>
          <div class="p-setting-info">
            <div class="p-setting-title">{{ t('settings.darkMode.title') }}</div>
            <div class="p-setting-description">{{ t('settings.darkMode.description') }}</div>
          </div>
        </div>
        <div class="p-setting-item-right">
          <InputSwitch
            v-model="settings.darkMode"
            @update:modelValue="handleDarkModeChange"
            class="p-setting-switch"
          />
        </div>
      </div>

      <!-- Primary Color Setting -->
      <div class="p-setting-item">
        <div class="p-setting-item-left">
          <i class="pi pi-palette p-setting-icon"></i>
          <div class="p-setting-info">
            <div class="p-setting-title">{{ t('settings.primaryColor.title') }}</div>
            <div class="p-setting-description">{{ t('settings.primaryColor.description') }}</div>
          </div>
        </div>
        <div class="p-setting-item-right">
          <Select
            v-model="settings.primaryColor"
            :options="colorOptionsList"
            optionLabel="label"
            optionValue="value"
            class="p-setting-select p-setting-color-select"
            @change="handleColorChange"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="p-setting-select-value p-setting-color-value">
                <span
                  class="p-setting-color-swatch"
                  :style="{ backgroundColor: slotProps.value }"
                ></span>
                {{ colorOptionsList.find(opt => opt.value === slotProps.value)?.label }}
              </div>
            </template>
            <template #option="slotProps">
              <div class="p-setting-color-option">
                <span
                  class="p-setting-color-swatch"
                  :style="{ backgroundColor: slotProps.option.value }"
                ></span>
                {{ slotProps.option.label }}
              </div>
            </template>
          </Select>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="t('common.close')"
        severity="secondary"
        @click="handleClose"
        class="p-settings-close-button"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.p-settings-modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.p-settings-modal-icon {
  font-size: 1.25rem;
  color: var(--p-primary-color);
}

.p-settings-modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.p-settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.p-setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: var(--p-surface-50);
  border-radius: 12px;
  border: 1px solid var(--p-surface-border);
  transition: all 0.2s ease;
}

.p-setting-item:hover {
  background: var(--p-surface-100);
  border-color: var(--p-primary-color);
}

.p-setting-item-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.p-setting-icon {
  font-size: 1.5rem;
  color: var(--p-primary-color);
  flex-shrink: 0;
}

.p-setting-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.p-setting-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--p-text-color);
  line-height: 1.4;
}

.p-setting-description {
  font-size: 0.8125rem;
  color: var(--p-text-muted-color);
  line-height: 1.4;
}

.p-setting-item-right {
  flex-shrink: 0;
}

.p-setting-select {
  min-width: 10rem;
}

:deep(.p-setting-select .p-select) {
  border-radius: 8px;
  border: 1px solid var(--p-surface-border);
  background: var(--p-surface-0);
  transition: all 0.2s ease;
}

:deep(.p-setting-select .p-select:hover) {
  border-color: var(--p-primary-color);
}

:deep(.p-setting-select .p-select:focus) {
  border-color: var(--p-primary-color);
  box-shadow: 0 0 0 2px rgba(var(--p-primary-color-rgb), 0.1);
}

.p-setting-select-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.p-setting-color-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.p-setting-color-swatch {
  width: 1rem;
  height: 1rem;
  border-radius: 4px;
  border: 1px solid var(--p-surface-border);
  flex-shrink: 0;
  display: inline-block;
}

.p-setting-color-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.p-setting-language-icon {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
  flex-shrink: 0;
}

.p-setting-language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.p-setting-switch {
  flex-shrink: 0;
}

.p-settings-close-button {
  min-width: 6rem;
}

/* Responsive */
@media (max-width: 640px) {
  .p-setting-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .p-setting-item-right {
    width: 100%;
  }

  .p-setting-select {
    width: 100%;
    min-width: 100%;
  }
}
</style>

