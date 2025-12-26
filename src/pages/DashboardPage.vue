<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useLocale, useSidebar, useSettings } from '@/composables';
  import { useTabsStore } from '@/store/common/tabs';
  import TabView from 'primevue/tabview';
  import TabPanel from 'primevue/tabpanel';
  import AppHeader from '@/components/common/header/AppHeader.vue';
  import AppSidebar from '@/components/common/sidebar/AppSidebar.vue';
  import TabContentLoader from '@/components/tabs/TabContentLoader.vue';
  
  const tabsStore = useTabsStore();
  
  // Initialize settings
  const { initializeSettings } = useSettings();
  onMounted(() => {
    initializeSettings();
  });
  
  // Sidebar management - all logic extracted to composable
  const {
    sidebarOpen,
    sidebarCollapsed,
    isDesktop,
    toggleSidebar,
    toggleCollapse,
  } = useSidebar();

  // Tab management
  const activeTabIndex = computed({
    get: () => {
      if (!tabsStore.activeTabId || tabsStore.tabs.length === 0) return 0;
      const index = tabsStore.tabs.findIndex(tab => tab.id === tabsStore.activeTabId);
      return index >= 0 ? index : 0;
    },
    set: (value) => {
      const selectedTab = tabsStore.tabs[value];
      if (selectedTab) {
        tabsStore.setActiveTab(selectedTab.id);
      }
    }
  });

  const handleTabChange = (event) => {
    activeTabIndex.value = event.index;
  };

  const handleCloseTab = (tabId, event) => {
    event.stopPropagation();
    tabsStore.closeTab(tabId);
  };
</script>

<template>
  <div class="dashboard-page">
    <div class="app-container">
      <AppHeader 
        :sidebar-open="sidebarOpen"
        :sidebar-collapsed="sidebarCollapsed"
        :is-desktop="isDesktop"
        @toggle-sidebar="toggleSidebar"
        @toggle-collapse="toggleCollapse"
      />
      <div class="app-layout">
        <!-- Backdrop overlay for mobile -->
        <div 
          v-if="sidebarOpen"
          class="app-sidebar-backdrop"
          @click="toggleSidebar"
        ></div>
        <AppSidebar 
          v-model="sidebarOpen" 
          :collapsed="sidebarCollapsed"
        />
        <main 
          class="app-main"
          :class="{ 
            'app-main-sidebar-open': sidebarOpen && !sidebarCollapsed,
            'app-main-sidebar-collapsed': sidebarOpen && sidebarCollapsed
          }"
        >
          <div class="app-main-content">
            <!-- Empty state when no tabs -->
            <div v-if="!tabsStore.hasTabs" class="app-empty-state">
              <div class="empty-state-content">
                <i class="pi pi-inbox empty-state-icon"></i>
                <h3 class="empty-state-title">No tabs open</h3>
                <p class="empty-state-message">Click on a menu item from the sidebar to open a tab</p>
              </div>
            </div>

            <!-- TabView when tabs exist -->
            <TabView 
              v-else
              v-model:activeIndex="activeTabIndex"
              @tab-change="handleTabChange"
              class="app-tabview"
              :class="{
                'sidebar-expanded': sidebarOpen && !sidebarCollapsed,
                'sidebar-collapsed': sidebarOpen && sidebarCollapsed,
                'sidebar-closed': !sidebarOpen
              }"
              scrollable
            >
              <TabPanel 
                v-for="tab in tabsStore.tabs" 
                :key="tab.id"
              >
                <template #header>
                  <div 
                    class="tab-header-content"
                    :class="{ 'tab-active': tab.id === tabsStore.activeTabId }"
                  >
                    <i 
                      :class="tab.id === tabsStore.activeTabId ? 'pi pi-star-fill' : 'pi pi-star'"
                      class="tab-star-icon"
                    ></i>
                    <span class="tab-label">{{ tab.label }}</span>
                    <button 
                      class="tab-close-button"
                      @click="handleCloseTab(tab.id, $event)"
                      type="button"
                    >
                      <i class="pi pi-times"></i>
                    </button>
                  </div>
                </template>
                <div class="tab-content">
                  <TabContentLoader :route="tab.route" :label="tab.label" />
                </div>
              </TabPanel>
            </TabView>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  background: var(--p-surface-ground);
  display: flex;
  flex-direction: column;
}

.app-layout {
  display: flex;
  flex: 1;
  position: relative;
}

.app-main {
  flex: 1;
  transition: margin-left 0.3s ease-in-out;
  width: 100%;
  padding: 15px;
}

.app-main-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* TabView container max width - flexible based on sidebar state */
/* Default: account for padding (15px each side = 30px = ~1.875rem, rounded to 2rem) */
.app-tabview :deep(.p-tabview-tablist-container) {
  max-width: calc(100vw - 2rem) !important;
}

/* On mobile (sidebar overlays, doesn't affect width) */
@media (max-width: 1023px) {
  .app-tabview :deep(.p-tabview-tablist-container) {
    max-width: calc(100vw - 2rem) !important; /* Sidebar overlays, so same calculation */
  }
}

/* On desktop - sidebar affects layout */
@media (min-width: 1024px) {
  /* When sidebar is expanded (16rem = 256px) */
  .app-tabview.sidebar-expanded :deep(.p-tabview-tablist-container) {
    max-width: calc(100vw - 16rem - 2rem) !important;
  }

  /* When sidebar is collapsed (4rem = 64px) */
  .app-tabview.sidebar-collapsed :deep(.p-tabview-tablist-container) {
    max-width: calc(100vw - 4rem - 2rem) !important;
  }

  /* When sidebar is closed (no sidebar, only padding) - rare on desktop */
  .app-tabview.sidebar-closed :deep(.p-tabview-tablist-container) {
    max-width: calc(100vw - 2rem) !important;
  }
}

.app-tabview {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-tabview :deep(.p-tabview-panels) {
  flex: 1;
  overflow: auto;
  background: #ffffff; /* White background for seamless connection with active tab */
  border-top: none; /* Remove top border for seamless connection */
}

.app-tabview :deep(.p-tabview-nav) {
  overflow-x: auto;
  overflow-y: hidden;
  background: #f3f4f6; /* Light grey background */
  border: none;
  padding: 0.75rem 0.75rem 0 0.75rem; /* Top/left/right padding, no bottom */
  gap: 0.5rem;
  display: flex;
  flex-wrap: nowrap;
}

.app-tabview :deep(.p-tabview-nav li) {
  max-width: 200px;
  min-width: 120px;
  margin: 0;
  list-style: none;
}

.app-tabview :deep(.p-tabview-nav li.p-highlight) {
  max-width: none;
}

.app-tabview :deep(.p-tabview-nav li .p-tabview-nav-link) {
  background: #f3f4f6; /* Light grey background */
  border: none; /* Remove border */
  border-radius: 0.375rem 0.375rem 0 0; /* Rounded top corners only */
  border-bottom: none; /* Remove bottom border for seamless connection */
  padding: 0.5rem 0.75rem;
  color: #374151;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
}

.app-tabview :deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  background: #f3f4f6; /* Same light grey as inactive, not colored */
  border: none; /* Remove border */
  border-bottom: none; /* Remove bottom border to connect with content */
  color: #374151; /* Default color, overridden by icon/text in active state */
}

.app-tabview :deep(.p-tabview-nav li:not(.p-highlight) .p-tabview-nav-link:hover) {
  background: #e5e7eb; /* Slightly darker grey for hover */
  border: none;
}

.app-tabview :deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link:hover) {
  background: #f3f4f6; /* Same as default, minimal hover effect */
}

.tab-header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
}

.tab-star-icon {
  font-size: 0.875rem;
  flex-shrink: 0;
  color: #6b7280; /* Dark grey for inactive tabs */
  margin-right: 0.375rem;
}

.tab-header-content.tab-active .tab-star-icon {
  color: var(--p-primary-color); /* Use theme primary color from useSettings */
}

.tab-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151; /* Dark grey for inactive tabs */
}

.tab-header-content.tab-active .tab-label {
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
  color: var(--p-primary-color); /* Use theme primary color from useSettings */
}

.tab-close-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.125rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  transition: background-color 0.2s;
  flex-shrink: 0;
  margin-left: 0.5rem;
  opacity: 0.7;
}

.tab-close-button:hover {
  background: rgba(0, 0, 0, 0.1); /* Dark grey hover for visibility on light background */
  opacity: 1;
}

.tab-header-content.tab-active .tab-close-button:hover {
  background: rgba(0, 0, 0, 0.1); /* Same hover effect for active tabs */
}

.tab-close-button i {
  font-size: 0.625rem;
  color: #6b7280; /* Dark grey for visibility on light background */
}

.tab-header-content.tab-active .tab-close-button i {
  color: #6b7280; /* Same dark grey for both active and inactive states */
}

.tab-content {
  height: 100%;
  overflow: auto;
}

.app-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.empty-state-content {
  text-align: center;
  padding: 2rem;
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--p-text-color-secondary);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin: 0 0 0.5rem 0;
}

.empty-state-message {
  color: var(--p-text-color-secondary);
  margin: 0;
}

/* Backdrop overlay for mobile */
.app-sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 35;
  display: none;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* On mobile, sidebar overlays, so no margin needed */
@media (max-width: 1023px) {
  .app-main {
    margin-left: 0;
  }
  
  .app-sidebar-backdrop {
    display: block;
  }
}

/* On larger screens, no backdrop needed */
@media (min-width: 1024px) {
  .app-sidebar-backdrop {
    display: none;
  }
}

/* On larger screens, sidebar pushes content when open */
@media (min-width: 1024px) {
  .app-main {
    margin-left: 0;
    transition: margin-left 0.3s ease-in-out;
  }
  
  .app-main-sidebar-open {
    margin-left: 16rem; /* Sidebar expanded width */
  }
  
  .app-main-sidebar-collapsed {
    margin-left: 4rem; /* Sidebar collapsed width (icons only) */
  }
}
</style>

