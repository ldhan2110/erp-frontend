import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref([]);
  const activeTabId = ref(null);
  const maxTabs = ref(10);

  // Check if item is a leaf (no submenu items)
  const isLeafItem = (item) => {
    return !item.items || item.items.length === 0;
  };

  // Generate unique tab ID from route
  const generateTabId = (route) => {
    return route || `tab-${Date.now()}`;
  };

  // Actions
  const addTab = (item) => {
    // Only add tabs for leaf items
    if (!isLeafItem(item)) {
      return;
    }

    const tabId = generateTabId(item.route);
    
    // Check if tab already exists
    const existingTab = tabs.value.find(tab => tab.id === tabId);
    if (existingTab) {
      // If tab exists, just activate it
      setActiveTab(tabId);
      return;
    }

    // Check max tabs limit
    if (tabs.value.length >= maxTabs.value) {
      // Remove oldest tab (first in array)
      tabs.value.shift();
    }

    // Create new tab
    const newTab = {
      id: tabId,
      label: item.label,
      icon: item.icon,
      route: item.route,
      component: null // Will be set dynamically based on route
    };

    tabs.value.push(newTab);
    setActiveTab(tabId);
  };

  const removeTab = (tabId) => {
    const index = tabs.value.findIndex(tab => tab.id === tabId);
    if (index === -1) return;

    tabs.value.splice(index, 1);

    // If removed tab was active, switch to another tab
    if (activeTabId.value === tabId) {
      if (tabs.value.length > 0) {
        // Switch to previous tab if available, otherwise next tab
        const newIndex = index > 0 ? index - 1 : 0;
        activeTabId.value = tabs.value[newIndex].id;
      } else {
        activeTabId.value = null;
      }
    }
  };

  const setActiveTab = (tabId) => {
    const tab = tabs.value.find(t => t.id === tabId);
    if (tab) {
      activeTabId.value = tabId;
    }
  };

  const closeTab = (tabId) => {
    removeTab(tabId);
  };

  const closeAllTabs = () => {
    tabs.value = [];
    activeTabId.value = null;
  };

  const closeOtherTabs = (tabId) => {
    const tab = tabs.value.find(t => t.id === tabId);
    if (tab) {
      tabs.value = [tab];
      activeTabId.value = tabId;
    }
  };

  // Getters
  const activeTab = computed(() => {
    return tabs.value.find(tab => tab.id === activeTabId.value) || null;
  });

  const hasTabs = computed(() => {
    return tabs.value.length > 0;
  });

  return {
    // State
    tabs,
    activeTabId,
    maxTabs,
    // Actions
    addTab,
    removeTab,
    setActiveTab,
    closeTab,
    closeAllTabs,
    closeOtherTabs,
    // Getters
    activeTab,
    hasTabs
  };
});

