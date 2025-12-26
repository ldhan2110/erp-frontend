import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { apiClient, API_ENDPOINTS } from '@config/api';
import { i18n } from '@config';
import listToTree from "list-to-tree-lite";
import { useAuthStore } from './auth';

export const useAppStore = defineStore('app', () => {
  const authStore = useAuthStore()
  const { getUserInfo } = authStore;
  const {  user } = storeToRefs(authStore);

  // Menu List
  const menuList = ref([]);
  
  // Language
  const language = ref("en");
  const languages = ref([]);
  const langMappingList = ref([]);


  const getMenuList = async () => {
    debugger;
    const response = await apiClient.post(API_ENDPOINTS.PROC, {
      proc: "SYS_SEL_USER_MENU",
      para: [user.value.PK],
    });
    if (response.data) {
      menuList.value =  listToTree(response.data.data, {
        idKey: "PK",
        parentKey: "P_PK",
        childrenKey: "childMenu",
      });
    }
  }

  const getLanguages = async () => {
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

  // watch(
  //   () => user.value,
  //   (u) => {
  //     debugger;
  //     if (u?.PK) {
  //       getMenuList();
  //     } else {
  //       getUserInfo();
  //     }
  //   },
  //   { immediate: true }
  // );


  const initializeApp = async () => {
    getLanguages();
    getLangMappingList();

    // Load menu list
    if (!user.value?.PK) {
      await getMenuList();
      getMenuList();
    } else {
      getMenuList();
    }
  }

  return {
    menuList,
    language,
    languages,
    langMappingList,
    getLanguages,
    getLangMappingList,
    getMenuList,
    saveLanguage,
    initializeApp
  }
});

