import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient, API_ENDPOINTS } from '@config/api';
import { i18n } from '@config';

export const useAppStore = defineStore('app', () => {
  // Language
  const language = ref("en");
  const languages = ref([]);
  const langMappingList = ref([]);

  const getLanguages = async () => {
    debugger;
    const response = await apiClient.post(API_ENDPOINTS.PROC, {
        proc: "SYS_SEL_LANGUAGE",
    });
    if (response.data) {
      languages.value = response.data.data;
    }
  }

  const getLangMappingList = async () => {
    const response = await apiClient.post(API_ENDPOINTS.PROC, {
        proc: "SYS_SEL_LANGUAGE_MAPPING",
    });
    if (response.data) {
      langMappingList.value = response.data.data;
    }
  }

  const saveLanguage = (langCode) => {
    if (langCode) {
      language.value = langCode;
      localStorage.setItem('language', langCode);
      i18n.global.locale.value = langCode;
    }
  }

  const initializeApp = async () => {
    getLanguages();
    getLangMappingList();
  }

  return {
    language,
    languages,
    langMappingList,
    getLanguages,
    getLangMappingList,
    saveLanguage,
    initializeApp
  }
});

